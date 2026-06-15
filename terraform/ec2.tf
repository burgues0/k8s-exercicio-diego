resource "aws_instance" "api_server" {
    ami = "ami-ff0fea8310f3"
    instance_type = var.instance_type
    subnet_id = aws_subnet.public_1.id
    vpc_security_group_ids = [aws_security_group.allow_traffic.id]

    tags = {
        Name = var.server_name
    }
}

resource "aws_instance" "db_server" {
    ami = "ami-ff0fea8310f3"
    instance_type = var.instance_type
    subnet_id = aws_subnet.public_1.id
    vpc_security_group_ids = [aws_security_group.allow_traffic.id]

    tags = {
        Name = var.database_name
    }
}