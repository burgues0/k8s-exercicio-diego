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
    filename = "${path.module}/../floci-api.pem"
    file_permission = "0600"
}