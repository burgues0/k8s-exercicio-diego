resource "aws_instance" "api_server" {
    ami = "ami-ubuntu2204"
    instance_type = "t3.micro"
    key_name = aws_key_pair.app_key.key_name
    user_data     = base64encode(<<-EOF
        #!/bin/bash
        apt-get update -y
        apt-get install -y curl openssh-server
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
        mkdir -p /run/sshd
        /usr/sbin/sshd -D &
    EOF
    )
    tags = {
        Name = "api-ec2"
    }
}