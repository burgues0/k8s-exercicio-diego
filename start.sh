set -e

cd floci
docker compose up -d --wait

cd ../terraform
terraform init -input=false -upgrade
terraform apply -auto-approve

cd ../ansible
ansible-playbook -i hosts.ini api.yaml
ansible-playbook -i hosts.ini gateway.yaml

EC2_CONTAINER=$(docker ps --format '{{.Names}}' | grep floci-ec2)
EC2_IP=$(docker inspect $EC2_CONTAINER --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}')

socat TCP-LISTEN:5000,fork,reuseaddr TCP:$EC2_IP:5000 &

sleep 2
curl -s http://localhost:5000/usuarios