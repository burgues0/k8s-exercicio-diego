# Step by Step
```
user@hostname:~$ git clone -b knex-pg git@github.com:burgues0/k8s-exercicio-diego.git
user@hostname:~$ k3d cluster create devops-diego --servers 1 --agents 3 -p "8080:80@loadbalancer"
user@hostname:~$ cd k8s-exercicio-diego
user@hostname:~/k8s-exercicio-diego$ docker build -t api-python-exercicio .
user@hostname:~/k8s-exercicio-diego$ k3d image import api-python-exercicio -c devops-diego
user@hostname:~/k8s-exercicio-diego$ cd k8s
user@hostname:~/k8s-exercicio-diego/k8s$ k apply -Rf .
user@hostname:~/k8s-exercicio-diego/k8s$ k apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

## Teste

> curl http://localhost:8080/alunos

> k get pods

> k logs -f api-python-deployment-{replicaset}-{id-pod}
