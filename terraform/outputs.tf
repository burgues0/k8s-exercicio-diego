output "instance_id" {
    value = aws_instance.api_server.id
}

output "rds_endpoint" {
    value = aws_db_instance.postgres.endpoint
}