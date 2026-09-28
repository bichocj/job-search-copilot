#!/bin/bash
set -euxo pipefail

# --- Install Docker + Compose plugin + git ---
dnf update -y
dnf install -y docker git
systemctl enable --now docker
usermod -aG docker ec2-user

DOCKER_CONFIG=/usr/local/lib/docker
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

# --- Figure out this instance's own public IP (so the frontend knows
#     where to reach the API, and the API knows what origin to allow) ---
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# --- Clone the project (push your own copy to GitHub first — see README) ---
cd /home/ec2-user
git clone ${git_repo_url} app
cd app

cat > .env <<EOF
ANTHROPIC_API_KEY=${anthropic_api_key}
PUBLIC_API_URL=http://$${PUBLIC_IP}:3000
PUBLIC_WEB_ORIGIN=http://$${PUBLIC_IP}:3001
EOF

docker compose up -d --build
