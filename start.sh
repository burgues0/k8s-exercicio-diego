set -e

cd localstack
docker compose up -d --wait

cd ../terraform
terraform init -input=false -upgrade
terraform apply -auto-approve

cd ../ansible
ansible-playbook -i hosts.ini api.yaml
ansible-playbook -i hosts.ini gateway.yaml

curl -s http://localhost:5000/usuarios