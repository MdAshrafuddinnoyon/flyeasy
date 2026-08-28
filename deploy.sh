#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#   FlyEasy Tourism Platform — Linux/VPS Auto-Deploy Script
#   Works on: Ubuntu 20.04+, Debian 11+, CentOS 7+
#   Usage: bash deploy.sh
# ═══════════════════════════════════════════════════════════════

set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'; BOLD='\033[1m'

echo -e "${BOLD}${CYAN}"
echo "╔═══════════════════════════════════════════════╗"
echo "║   FlyEasy Tourism Platform — VPS Deployer     ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# ─── Check requirements ─────────────────────────────────────────
echo -e "${YELLOW}Checking system requirements...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${YELLOW}Node.js not found. Installing Node.js 20...${NC}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo -e "${RED}Node.js 18+ required. Found: $(node -v)${NC}"
  exit 1
fi

if ! command -v mysql &> /dev/null; then
  echo -e "${YELLOW}MySQL client not found. Please install MySQL first.${NC}"
  echo "  Ubuntu:  sudo apt install mysql-server"
  echo "  CentOS:  sudo yum install mysql-server"
  exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"
echo -e "${GREEN}✅ MySQL found${NC}"

# ─── Install PM2 if not present ─────────────────────────────────
if ! command -v pm2 &> /dev/null; then
  echo -e "${YELLOW}Installing PM2...${NC}"
  sudo npm install -g pm2
fi
echo -e "${GREEN}✅ PM2 ready${NC}"

# ─── Run the Node.js installer ──────────────────────────────────
echo -e "\n${BOLD}${CYAN}Launching FlyEasy Installer...${NC}\n"
node install.js

# ─── Setup PM2 on system boot ───────────────────────────────────
echo -e "${YELLOW}Setting PM2 to start on system boot...${NC}"
pm2 startup 2>/dev/null || true
pm2 save 2>/dev/null || true

echo -e "\n${GREEN}${BOLD}✅ Deployment complete!${NC}"
echo -e "${CYAN}Check running processes: pm2 status${NC}"
echo -e "${CYAN}View logs: pm2 logs flyeasy-api${NC}"
