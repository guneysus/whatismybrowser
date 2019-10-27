.DEFAULT_GOAL := build

.PHONY: help
help:  ## Print this message.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.PHONY: build 
build:  ## Build
	yarn build

.PHONY: ngrok-tunnel
ngrok-tunnel: ## start ngrok tunnel on whatismybrowser.ngrok.io
	ngrok http 8080 -subdomain=whatismybrowser -host-header="localhost:8080"

