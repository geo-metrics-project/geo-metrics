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
K8S_DIR="$PROJECT_ROOT/k8s"

# Namespace
GEOMETRICS_NAMESPACE="geo-metrics"

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

# Deploy frontend to Kubernetes
deploy_frontend() {
    log_step "Deploying frontend to Kubernetes"

    # Apply the deployment
    kubectl apply -f "$K8S_DIR/frontend-deployment.yaml" -n "$GEOMETRICS_NAMESPACE"

    # Wait for rollout
    kubectl rollout status deployment/frontend -n "$GEOMETRICS_NAMESPACE" --timeout=300s

    log_info "Frontend deployed successfully"
}

if [[ $# -gt 0 ]]; then
    "$@"
fi