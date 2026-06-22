terraform {
    required_providers {
        aws = {
        source = "hashicorp/aws"
        version = "~> 5.0"
        }
        tls = {
        source = "hashicorp/tls"
        version = "~> 4.0"
        }
        local = {
        source = "hashicorp/local"
        version = "~> 2.0"
        }
    }
}

provider "aws" {
    region = var.aws_region
    access_key = "test"
    secret_key = "test"
    skip_credentials_validation = true
    skip_metadata_api_check = true
    skip_requesting_account_id = true

    endpoints {
        ec2 = var.floci_endpoint
        rds = var.floci_endpoint
        sts = var.floci_endpoint
        iam = var.floci_endpoint
    }
}

module "network" {
    source = "./modules/network"
    vpc_cidr = var.vpc_cidr
    subnet_a = var.subnet_a
    subnet_b = var.subnet_b
}

module "compute" {
    source = "./modules/compute"
    ami_id = var.ami_id
    instance_type = var.instance_type
    subnet_id = module.network.subnet_a_id
}

module "database" {
    source = "./modules/database"
    db_name = var.db_name
    db_user = var.db_user
    db_password = var.db_password
}