# Step by Step
```
user@hostname:~$ git clone -b knex-pg git@github.com:burgues0/k8s-exercicio-diego.git
user@hostname:~$ k3d cluster create devops-diego --servers 1 --agents 3 -p "8080:80@loadbalancer"
user@hostname:~$ cd k8s-exercicio-diego
user@hostname:~/k8s-exercicio-diego$ docker build -t api-node-exercicio .
user@hostname:~/k8s-exercicio-diego$ k3d image import api-node-exercicio -c devops-diego
user@hostname:~/k8s-exercicio-diego$ cd k8s
user@hostname:~/k8s-exercicio-diego/k8s$ kubectl apply -f dev/ns.yaml
user@hostname:~/k8s-exercicio-diego/k8s$ kubectl apply -f hmg/ns.yaml
user@hostname:~/k8s-exercicio-diego/k8s$ kubectl apply -Rf dev/.
user@hostname:~/k8s-exercicio-diego/k8s$ kubectl apply -Rf hmg/.
user@hostname:~/k8s-exercicio-diego/k8s$ kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
user@hostname:~/k8s-exercicio-diego/k8s$ sudo echo "127.0.0.1    dev.local" >> /etc/hosts
user@hostname:~/k8s-exercicio-diego/k8s$ sudo echo "127.0.0.1    hmg.local" >> /etc/hosts
```

## Teste

> curl http://dev.local:8080/

> curl http://hmg.local:8080/

> kubectl -n ns-dev get pods -o wide (pra ver o affinity dos nodes)

> kubectl -n ns-hmg get pods -o wide

> kubectl logs -f api-node-deployment-{replicaset}-{id-pod}
