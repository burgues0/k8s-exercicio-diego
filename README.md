# Step by Step
```
user@hostname:~$ cd terraform
user@hostname:~/terraform$ terraform init
user@hostname:~/terraform$ terraform apply -auto-approve
user@hostname:~/terraform$ cd ../ansible
user@hostname:~/ansible$ ansible-playbook -i hosts.ini api.yaml
user@hostname:~/ansible$ ansible-playbook -i hosts.ini gateway.yaml
```

## Teste

> curl http://ip-publico-gateway/
