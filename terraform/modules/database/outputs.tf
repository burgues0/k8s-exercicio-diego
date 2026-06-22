output "rds_endpoint" {
    value = aws_db_instance.postgres.endpoint
}

output "rds_host" {
    value = aws_db_instance.postgres.address
}