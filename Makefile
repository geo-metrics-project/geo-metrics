.PHONY: geometrics-namespace frontend all

SCRIPT_DIR=$(shell cd scripts/setup && pwd)
SETUP_SCRIPT=$(SCRIPT_DIR)/setup-geometrics.sh

geometrics-namespace:
	bash $(SETUP_SCRIPT) create_namespace

frontend:
	bash $(SETUP_SCRIPT) deploy_frontend

all: geometrics-namespace frontend