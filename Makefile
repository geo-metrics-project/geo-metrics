.PHONY: geometrics-namespace postgres llm-service report-service frontend all

SCRIPT_DIR=$(shell cd scripts/setup && pwd)
SETUP_SCRIPT=$(SCRIPT_DIR)/setup-geometrics.sh

geometrics-namespace:
	bash $(SETUP_SCRIPT) create_namespace

postgres:
	bash $(SETUP_SCRIPT) deploy_postgres

llm-service:
	bash $(SETUP_SCRIPT) deploy_llm_service

report-service:
	bash $(SETUP_SCRIPT) deploy_report_service

frontend:
	bash $(SETUP_SCRIPT) deploy_frontend

all: geometrics-namespace postgres llm-service report-service frontend