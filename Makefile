.PHONY: help install dev start stop restart status logs clean build test health env-check env-setup

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Configuration
APP_NAME := OpenAI ChatKit App
PORT := 3000
NODE := node
NPM := npm
PID_FILE := .chatkit.pid
LOG_FILE := chatkit.log

##@ General

help: ## Display this help message
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  $(APP_NAME) - Makefile Commands$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

##@ Setup & Installation

install: ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@$(NPM) install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

env-check: ## Check environment configuration
	@echo "$(BLUE)Checking environment...$(NC)"
	@ENV_FILE=""; \
	if [ -f .env.local ]; then \
		ENV_FILE=".env.local"; \
	elif [ -f .env ]; then \
		ENV_FILE=".env"; \
	else \
		echo "$(RED)✗ No .env or .env.local file found!$(NC)"; \
		echo "$(YELLOW)Run 'make env-setup' to create it$(NC)"; \
		exit 1; \
	fi; \
	echo "$(BLUE)Using $$ENV_FILE$(NC)"; \
	if ! grep -q "OPENAI_API_KEY=sk-" $$ENV_FILE; then \
		echo "$(RED)✗ OPENAI_API_KEY not configured in $$ENV_FILE$(NC)"; \
		exit 1; \
	fi; \
	if ! grep -q "CHATKIT_WORKFLOW_ID=wf_" $$ENV_FILE && ! grep -q "NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_" $$ENV_FILE; then \
		echo "$(RED)✗ CHATKIT_WORKFLOW_ID (or NEXT_PUBLIC_CHATKIT_WORKFLOW_ID) not configured in $$ENV_FILE$(NC)"; \
		exit 1; \
	fi; \
	echo "$(GREEN)✓ Environment configured$(NC)"; \
	echo "$(GREEN)✓ API Key: $$(grep OPENAI_API_KEY $$ENV_FILE | cut -d= -f2 | cut -c1-20)...$(NC)"; \
	if grep -q "CHATKIT_WORKFLOW_ID=wf_" $$ENV_FILE; then \
		echo "$(GREEN)✓ Workflow: $$(grep CHATKIT_WORKFLOW_ID $$ENV_FILE | cut -d= -f2) (server-side)$(NC)"; \
	else \
		echo "$(GREEN)✓ Workflow: $$(grep NEXT_PUBLIC_CHATKIT_WORKFLOW_ID $$ENV_FILE | cut -d= -f2) (client-side)$(NC)"; \
	fi

env-setup: ## Create .env.local file from example
	@if [ -f .env.local ]; then \
		echo "$(YELLOW)⚠ .env.local already exists$(NC)"; \
		read -p "Overwrite? (y/N) " -n 1 -r; \
		echo ""; \
		if [[ ! $$REPLY =~ ^[Yy]$$ ]]; then \
			echo "$(BLUE)Keeping existing .env.local$(NC)"; \
			exit 0; \
		fi; \
	fi
	@if [ -f .env.example ]; then \
		cp .env.example .env.local; \
		echo "$(GREEN)✓ Created .env.local from .env.example$(NC)"; \
	else \
		echo "$(BLUE)Creating default .env.local...$(NC)"; \
		echo "# OpenAI API Key" > .env.local; \
		echo "OPENAI_API_KEY=sk-YOUR_API_KEY_HERE" >> .env.local; \
		echo "" >> .env.local; \
		echo "# Workflow ID (server-side, for file upload support)" >> .env.local; \
		echo "CHATKIT_WORKFLOW_ID=wf_YOUR_WORKFLOW_ID_HERE" >> .env.local; \
		echo "" >> .env.local; \
		echo "# Legacy (optional, for backward compatibility)" >> .env.local; \
		echo "# NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_YOUR_WORKFLOW_ID_HERE" >> .env.local; \
		echo "$(GREEN)✓ Created .env.local$(NC)"; \
	fi
	@echo "$(YELLOW)⚠ Please edit .env.local with your credentials$(NC)"

##@ Development

dev: env-check ## Start development server (foreground)
	@echo "$(BLUE)Starting ChatKit app in development mode...$(NC)"
	@echo "$(YELLOW)App will be available at https://localhost:$(PORT)$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop$(NC)"
	@echo ""
	@$(NPM) run dev

start: env-check ## Start development server (background)
	@echo "$(BLUE)Starting ChatKit app in background...$(NC)"
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "$(YELLOW)⚠ App already running (PID: $$(cat $(PID_FILE)))$(NC)"; \
		exit 0; \
	fi
	@rm -f $(PID_FILE)
	@nohup $(NPM) run dev > $(LOG_FILE) 2>&1 & echo $$! > $(PID_FILE)
	@echo "$(GREEN)✓ App started (PID: $$(cat $(PID_FILE)))$(NC)"
	@sleep 3
	@if kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "$(GREEN)✓ App is running at https://localhost:$(PORT)$(NC)"; \
		echo "$(BLUE)View logs: make logs$(NC)"; \
	else \
		echo "$(RED)✗ Failed to start app$(NC)"; \
		echo "$(YELLOW)Check logs: tail $(LOG_FILE)$(NC)"; \
		rm -f $(PID_FILE); \
		exit 1; \
	fi

stop: ## Stop the development server
	@if [ -f $(PID_FILE) ]; then \
		echo "$(BLUE)Stopping ChatKit app...$(NC)"; \
		if kill $$(cat $(PID_FILE)) 2>/dev/null; then \
			echo "$(GREEN)✓ App stopped$(NC)"; \
		else \
			echo "$(YELLOW)⚠ Process not found, cleaning up$(NC)"; \
		fi; \
		rm -f $(PID_FILE); \
	else \
		echo "$(YELLOW)⚠ No PID file found$(NC)"; \
		if lsof -ti:$(PORT) > /dev/null 2>&1; then \
			echo "$(BLUE)Killing process on port $(PORT)...$(NC)"; \
			lsof -ti:$(PORT) | xargs kill -9 2>/dev/null; \
			echo "$(GREEN)✓ Process killed$(NC)"; \
		else \
			echo "$(YELLOW)App not running$(NC)"; \
		fi; \
	fi

restart: stop ## Restart the development server
	@sleep 2
	@$(MAKE) start

status: ## Check if the app is running
	@echo "$(BLUE)Checking app status...$(NC)"
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "$(GREEN)✓ App is running$(NC)"; \
		echo "  PID: $$(cat $(PID_FILE))"; \
		echo "  URL: https://localhost:$(PORT)"; \
		echo "  Logs: $(LOG_FILE)"; \
	else \
		echo "$(YELLOW)✗ App is not running$(NC)"; \
		if lsof -ti:$(PORT) > /dev/null 2>&1; then \
			echo "$(YELLOW)⚠ But port $(PORT) is in use by another process$(NC)"; \
			lsof -i:$(PORT); \
		fi; \
	fi

logs: ## Tail application logs
	@if [ -f $(LOG_FILE) ]; then \
		echo "$(BLUE)Tailing $(LOG_FILE) (Ctrl+C to stop)...$(NC)"; \
		tail -f $(LOG_FILE); \
	else \
		echo "$(YELLOW)No log file found at $(LOG_FILE)$(NC)"; \
	fi

health: ## Check app health
	@echo "$(BLUE)Checking app health...$(NC)"
	@if curl -k -s -o /dev/null -w "%{http_code}" https://localhost:$(PORT) | grep -q "200"; then \
		echo "$(GREEN)✓ App is healthy (HTTP 200)$(NC)"; \
	else \
		echo "$(RED)✗ App is not responding$(NC)"; \
		exit 1; \
	fi

##@ Build & Production

build: env-check ## Build for production
	@echo "$(BLUE)Building production bundle...$(NC)"
	@$(NPM) run build
	@echo "$(GREEN)✓ Build complete$(NC)"

prod-start: build ## Start production server
	@echo "$(BLUE)Starting production server...$(NC)"
	@$(NPM) run start

##@ Testing & Debugging

test: ## Run tests (if any)
	@echo "$(BLUE)Running tests...$(NC)"
	@if grep -q "\"test\":" package.json; then \
		$(NPM) test; \
	else \
		echo "$(YELLOW)No tests configured$(NC)"; \
	fi

lint: ## Run linter
	@echo "$(BLUE)Running linter...$(NC)"
	@$(NPM) run lint

##@ Utilities

clean: stop ## Clean generated files and dependencies
	@echo "$(BLUE)Cleaning up...$(NC)"
	@rm -rf .next
	@rm -rf node_modules
	@rm -f $(LOG_FILE)
	@rm -f $(PID_FILE)
	@rm -f nohup.out
	@echo "$(GREEN)✓ Cleaned$(NC)"

clean-logs: ## Clean log files only
	@echo "$(BLUE)Cleaning logs...$(NC)"
	@rm -f $(LOG_FILE)
	@rm -f nohup.out
	@echo "$(GREEN)✓ Logs cleaned$(NC)"

info: ## Display app information
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  $(APP_NAME) - Information$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(GREEN)Configuration:$(NC)"
	@echo "  Port:        $(PORT)"
	@echo "  URL:         https://localhost:$(PORT)"
	@echo "  Log file:    $(LOG_FILE)"
	@echo "  PID file:    $(PID_FILE)"
	@echo ""
	@echo "$(GREEN)Environment:$(NC)"
	@ENV_FILE=""; \
	if [ -f .env.local ]; then \
		ENV_FILE=".env.local"; \
	elif [ -f .env ]; then \
		ENV_FILE=".env"; \
	fi; \
	if [ -n "$$ENV_FILE" ]; then \
		echo "  Config file: $$ENV_FILE"; \
		echo "  API Key:     $$(grep OPENAI_API_KEY $$ENV_FILE | cut -d= -f2 | cut -c1-20)..."; \
		if grep -q "CHATKIT_WORKFLOW_ID=wf_" $$ENV_FILE; then \
			echo "  Workflow:    $$(grep CHATKIT_WORKFLOW_ID $$ENV_FILE | cut -d= -f2) (server-side)"; \
		elif grep -q "NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_" $$ENV_FILE; then \
			echo "  Workflow:    $$(grep NEXT_PUBLIC_CHATKIT_WORKFLOW_ID $$ENV_FILE | cut -d= -f2) (client-side)"; \
		fi; \
	else \
		echo "  $(RED)No .env or .env.local file found$(NC)"; \
	fi
	@echo ""
	@echo "$(GREEN)Status:$(NC)"
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "  $(GREEN)✓ Running (PID: $$(cat $(PID_FILE)))$(NC)"; \
	else \
		echo "  $(YELLOW)✗ Not running$(NC)"; \
	fi
	@echo ""

##@ Complete Workflows

first-run: install env-setup ## Complete first-time setup
	@echo ""
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)  First-Time Setup Complete!$(NC)"
	@echo "$(BLUE)════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  1. Edit .env.local with your OpenAI API key and workflow ID"
	@echo "  2. Run: make start"
	@echo "  3. Open: https://localhost:$(PORT)"
	@echo ""

reset: clean install ## Reset everything (clean + reinstall)
	@echo "$(GREEN)✓ Reset complete$(NC)"
	@echo "$(YELLOW)Run 'make start' to start the app$(NC)"

