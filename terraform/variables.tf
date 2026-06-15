variable "instance_type" {
    description = "Tipo da instância EC2"
    type = string
    default = "t2.micro"
}

variable "server_name" {
    description = "Nome do servidor"
    type = string
    default = "api-server"
}

variable "database_name" {
    description = "Nome do banco de dados"
    type = string
    default = "postgres-db"
}