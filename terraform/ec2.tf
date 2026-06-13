resource "aws_instance" "api_server" {
    ami = "ami-ff0fea8310f3"
    instance_type = var.instance_type

    tags = {
        Name = var.server_name
    }
}