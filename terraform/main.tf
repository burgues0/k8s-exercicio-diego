terraform {
    required_providers {
        aws = {
        source  = "hashicorp/aws"
        version = "~> 5.0"
        }
    }
}

provider "aws" {
    region = "us-east-1"
    access_key = "test"
    secret_key = "test"
    skip_credentials_validation = true
    skip_metadata_api_check = true
    skip_requesting_account_id = true

    endpoints {
        ec2 = "http://localhost:4566"
    }
}

resource "aws_vpc" "main" {
    cidr_block = "10.0.0.0/16"
    enable_dns_hostnames = true
    tags = { Name = "main-vpc" }
}

resource "aws_subnet" "public_1" {
    vpc_id = aws_vpc.main.id
    cidr_block = "10.0.1.0/24"
    availability_zone = "us-east-1a"
}

resource "aws_internet_gateway" "gw" {
    vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "public_rt" {
    vpc_id = aws_vpc.main.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.gw.id
    }
}

resource "aws_route_table_association" "a" {
    subnet_id      = aws_subnet.public_1.id
    route_table_id = aws_route_table.public_rt.id
}

resource "aws_security_group" "allow_traffic" {
    name        = "allow_traffic"
    vpc_id      = aws_vpc.main.id

    ingress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}