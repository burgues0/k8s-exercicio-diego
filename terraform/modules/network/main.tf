resource "aws_vpc" "main" {
    cidr_block = var.vpc_cidr
}

resource "aws_subnet" "public_a" {
    vpc_id = aws_vpc.main.id
    cidr_block = var.subnet_a
    availability_zone = "us-east-1a"
}

resource "aws_subnet" "public_b" {
    vpc_id = aws_vpc.main.id
    cidr_block = var.subnet_b
    availability_zone = "us-east-1b"
}