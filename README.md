# GEO Metrics

## Purpose
GEO Metrics generates analytical reports that evaluate how well content is optimized for generative AI answer engines (Generative Engine Optimization). It ingests content, queries multiple LLM providers, scores visibility/readiness, and produces structured reports.

## Architecture

### Core Services
- **api-gateway** (port 3000): Unified entry point, request orchestration
- **report-service** (port 8080): Aggregates LLM outputs, computes GEO scores, stores reports
- **llm-service** (port 8081): Interface to multiple LLM providers (OpenAI, Groq)
- **db** (port 5432): PostgreSQL database for report persistence

### Service Communication
```
Client → API Gateway (3000)
           ↓
           ├→ Report Service (8080) → Database (5432)
           └→ LLM Service (8081)
```

---

## Kubernetes Deployment

### Prerequisites
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- [Docker](https://docs.docker.com/get-docker/) installed
- OpenAI and/or Groq API keys

---

### Step 1: Start Minikube

```bash
minikube start
```

### Step 2: Configure Docker for Minikube

Point your Docker CLI to Minikube's Docker daemon so images are built directly in the cluster:

```bash
eval $(minikube docker-env)
```

**Note:** Run this command in each new terminal session where you want to build images.

---

### Step 3: Create Kubernetes Secrets

Create secrets for sensitive data before deploying:

```bash
# Database password
kubectl create secret generic db-secret \
  --from-literal=DB_PASSWORD=your_secure_password

# LLM API keys
kubectl create secret generic llm-secrets \
  --from-literal=OPENAI_API_KEY=your-openai-key \
  --from-literal=GROQ_API_KEY=your-groq-key
```

Verify secrets were created:
```bash
kubectl get secrets
```

---

### Step 4: Build Docker Images

Build all service images in Minikube's Docker environment:

```bash
# Build API Gateway
docker build -t api-gateway:latest ./api-gateway

# Build Report Service
docker build -t report-service:latest ./report-service

# Build LLM Service
docker build -t llm-service:latest ./llm-service
```

Verify images are available:
```bash
docker images | grep -E 'api-gateway|report-service|llm-service'
```

---

### Step 5: Deploy to Kubernetes

Apply all Kubernetes manifests:

```bash
kubectl apply -f k8s/
```

This will create:
- 4 Deployments (api-gateway, report-service, llm-service, db)
- 4 Services (ClusterIP for internal communication)
- 1 ConfigMap (database initialization script)

---

### Step 6: Verify Deployment

Check that all pods are running:

```bash
kubectl get pods
```

Expected output:
```
NAME                              READY   STATUS    RESTARTS   AGE
api-gateway-xxxxxxxxxx-xxxxx      1/1     Running   0          30s
report-service-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
llm-service-xxxxxxxxxx-xxxxx      1/1     Running   0          30s
db-xxxxxxxxxx-xxxxx               1/1     Running   0          30s
```

Check services:
```bash
kubectl get services
```

If any pod is not running, check logs:
```bash
kubectl logs -f deployment/api-gateway
kubectl logs -f deployment/report-service
kubectl logs -f deployment/llm-service
kubectl logs -f deployment/db
```

---

## API Endpoints

### Health Check
```bash
curl $API_URL/api/health
```

### Full GEO Analysis
```bash
curl -X POST $API_URL/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "brand_name": "Tesla",
    "models": ["openai:gpt-3.5-turbo", "groq:llama-3.1-8b-instant"],
    "keywords": ["electric", "innovation", "sustainable", "autopilot"],
    "prompt_template": "What do you know about {brand_name}? Describe their main products and innovations."
  }'
```

### List All Reports
```bash
curl $API_URL/api/reports
```

### Get Specific Report
```bash
curl $API_URL/api/reports/1
```

### Get Report Score
```bash
curl $API_URL/api/reports/1/score
```

### Query LLM Directly
```bash
curl -X POST $API_URL/api/llm/query \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model": "gpt-3.5-turbo",
    "prompt": "What is Generative Engine Optimization?"
  }'
```

---

## Environment Variables

### API Gateway
- `PORT`: Server port (default: 3000)
- `LLM_SERVICE_URL`: LLM service endpoint (default: http://llm-service:8081)
- `REPORT_SERVICE_URL`: Report service endpoint (default: http://report-service:8080)

### Report Service
- `PORT`: Server port (default: 8080)
- `DB_HOST`: Database host (default: db)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name (default: geo_metrics)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (from secret)

### LLM Service
- `PORT`: Server port (default: 8081)
- `OPENAI_API_KEY`: OpenAI API key (from secret)
- `GROQ_API_KEY`: Groq API key (from secret)

### Database
- `POSTGRES_DB`: Database name (default: geo_metrics)
- `POSTGRES_USER`: Database user (default: postgres)
- `POSTGRES_PASSWORD`: Database password (from secret)

---

## Cleanup

```bash
kubectl delete -f k8s/
kubectl delete secret db-secret llm-secrets
minikube stop
minikube delete
```