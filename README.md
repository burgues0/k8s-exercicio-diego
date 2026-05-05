# Step by Step
```
user@hostname:~$ git clone git@github.com:burgues0/k8s-exercicio-diego.git
user@hostname:~$ k3d cluster create devops-diego --servers 1 --agents 3 -p "8080:80@loadbalancer"
user@hostname:~$ cd k8s-exercicio-diego
user@hostname:~/k8s-exercicio-diego$ docker build -t api-python-exercicio .
user@hostname:~/k8s-exercicio-diego$ k3d image import api-python-exercicio -c devops-diego
user@hostname:~/k8s-exercicio-diego$ cd k8s
user@hostname:~/k8s-exercicio-diego/k8s$ k apply -f ingress.yaml
user@hostname:~/k8s-exercicio-diego/k8s$ k apply -f service.yaml
user@hostname:~/k8s-exercicio-diego/k8s$ k apply -f deployment.yaml
user@hostname:~/k8s-exercicio-diego/k8s$ k apply -f postgres.yaml
```

## Teste

> curl http://localhost:8080/alunos

> k get pods

> k logs -f api-python-deployment-{replicaset}-{id-pod}
