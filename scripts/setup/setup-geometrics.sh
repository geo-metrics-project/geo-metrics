#!/bin/bash
set -euo pipefail

# Colors and logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}✓${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1" >&2; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_step() { echo -e "${BLUE}==>${NC} $1"; }

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Namespace
GEOMETRICS_NAMESPACE="geo-metrics"

# Generate secure random secrets
generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Create geometrics namespace if it doesn't exist
create_namespace() {
    log_step "Ensuring geometrics namespace exists"

    if kubectl get namespace "$GEOMETRICS_NAMESPACE" &>/dev/null; then
        log_info "Namespace '$GEOMETRICS_NAMESPACE' already exists"
    else
        kubectl create namespace "$GEOMETRICS_NAMESPACE"
        log_info "Created namespace '$GEOMETRICS_NAMESPACE'"
    fi
}

# Deploy PostgreSQL database
deploy_postgres() {
    log_step "Deploying PostgreSQL to $GEOMETRICS_NAMESPACE"

    local geometrics_pwd=$(generate_secret)

    # Deploy PostgreSQL with Bitnami's built-in user creation
    helm upgrade --install geometrics-postgres bitnami/postgresql \
        --namespace "$GEOMETRICS_NAMESPACE" \
        -f "$PROJECT_ROOT/helm/values/values-postgres.yaml" \
        --set global.postgresql.auth.username="geometrics" \
        --set global.postgresql.auth.password="$geometrics_pwd" \
        --set global.postgresql.auth.database="geometrics" \
        --wait --timeout=5m

    # Build DSN for geometrics user (correct host for Bitnami)
    local host="geometrics-postgres-postgresql.$GEOMETRICS_NAMESPACE.svc.cluster.local"
    local db_dsn="postgresql://geometrics:$geometrics_pwd@$host:5432/geometrics?sslmode=disable"

    # Create secret for services
    kubectl create secret generic geometrics-db-credentials \
        --namespace "$GEOMETRICS_NAMESPACE" \
        --from-literal=dsn="$db_dsn" \
        --from-literal=host="$host" \
        --from-literal=port="5432" \
        --from-literal=database="geometrics" \
        --from-literal=username="geometrics" \
        --from-literal=password="$geometrics_pwd" \
        --dry-run=client -o yaml | kubectl apply -f -

    log_info "PostgreSQL deployed and DSN secrets created"
}

# Deploy LLM Service to Kubernetes
deploy_llm_service() {
    log_step "Deploying LLM service to Kubernetes"

    # Check if llm-secrets exists
    if ! kubectl get secret llm-secrets -n "$GEOMETRICS_NAMESPACE" &>/dev/null; then
        log_error "Secret 'llm-secrets' not found in namespace '$GEOMETRICS_NAMESPACE'"
        log_error "Create it with: kubectl create secret generic llm-secrets --namespace $GEOMETRICS_NAMESPACE --from-literal=HUGGINGFACE_API_KEY=your-key"
        return 1
    fi

    # Apply the deployment
    kubectl apply -f "$PROJECT_ROOT/k8s/llm-service-deployment.yaml" -n "$GEOMETRICS_NAMESPACE"

    # Wait for rollout
    kubectl rollout status deployment/llm-service -n "$GEOMETRICS_NAMESPACE" --timeout=300s

    log_info "LLM service deployed successfully"
}

# Deploy Report Service to Kubernetes
deploy_report_service() {
    log_step "Deploying Report service to Kubernetes"

    # Apply the deployment
    kubectl apply -f "$PROJECT_ROOT/k8s/report-service-deployment.yaml" -n "$GEOMETRICS_NAMESPACE"

    # Wait for rollout
    kubectl rollout status deployment/report-service -n "$GEOMETRICS_NAMESPACE" --timeout=300s

    log_info "Report service deployed successfully"
}

# Deploy frontend to Kubernetes
deploy_frontend() {
    log_step "Deploying frontend to Kubernetes"

    # Apply the deployment
    kubectl apply -f "$PROJECT_ROOT/k8s/frontend-deployment.yaml" -n "$GEOMETRICS_NAMESPACE"

    # Wait for rollout
    kubectl rollout status deployment/frontend -n "$GEOMETRICS_NAMESPACE" --timeout=300s

    log_info "Frontend deployed successfully"
}

if [[ $# -gt 0 ]]; then
    "$@"
fi