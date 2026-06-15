output "instance_id" {
    value = aws_instance.api_server.id
}

output "database_id" {
    value = aws_instance.db_server.id
}