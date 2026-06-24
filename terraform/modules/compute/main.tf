resource "tls_private_key" "ssh_key" {
    algorithm = "RSA"
    rsa_bits = 4096
}

resource "aws_key_pair" "app_key" {
    key_name = "floci-api-key"
    public_key = tls_private_key.ssh_key.public_key_openssh
}

resource "local_sensitive_file" "private_key" {
    content = tls_private_key.ssh_key.private_key_pem
    filename = "${path.module}/../../floci-api.pem"
    file_permission = "0600"
}

resource "aws_instance" "gateway" {
    ami = var.ami_id
    instance_type = var.instance_type
    key_name = aws_key_pair.app_key.key_name
    subnet_id = var.subnet_id
    user_data = base64encode(<<-EOF
        #!/bin/bash
        apt-get update -y
        apt-get install -y curl openssh-server
        mkdir -p /run/sshd
        /usr/sbin/sshd -D &
    EOF
    )
}

resource "tls_private_key" "backend_key" {
    algorithm = "RSA"
    rsa_bits = 4096
}

resource "local_sensitive_file" "backend_private_key" {
    content = tls_private_key.backend_key.private_key_pem
    filename = "${path.module}/../../backend.pem"
    file_permission = "0600"
}

resource "docker_container" "backend" {
    name = "simulated-backend"
    image = "ubuntu:22.04"
    privileged = true

    ports {
        internal = 22
        external = 2301
    }

    command = ["/bin/bash", "-c", <<-EOF
        apt-get update -y &&
        apt-get install -y openssh-server curl gnupg ca-certificates lsb-release iptables &&

        install -m 0755 -d /etc/apt/keyrings &&
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg &&
        chmod a+r /etc/apt/keyrings/docker.gpg &&
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu jammy stable" > /etc/apt/sources.list.d/docker.list &&
        apt-get update -y &&
        apt-get install -y docker-ce docker-ce-cli containerd.io &&

        mkdir -p /root/.ssh &&
        echo '${tls_private_key.backend_key.public_key_openssh}' > /root/.ssh/authorized_keys &&
        chmod 700 /root/.ssh &&
        chmod 600 /root/.ssh/authorized_keys &&
        sed -i 's/#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config &&
        sed -i 's/#PubkeyAuthentication.*/PubkeyAuthentication yes/' /etc/ssh/sshd_config &&
        sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config &&
        mkdir -p /run/sshd &&
        containerd &
        dockerd &
        /usr/sbin/sshd -D
    EOF
    ]
}