#!/bin/bash
set -e

docker compose up -d --wait

cd terraform
terraform init -input=false -upgrade
terraform apply -auto-approve
cd ..

ansible-playbook -i ansible/hosts.ini ansible/deploy.yaml

curl -s http://localhost:5000/health