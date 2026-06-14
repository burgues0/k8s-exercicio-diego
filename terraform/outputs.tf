output "instance_public_ip" {
    value = aws_instance.api_server.public_ip
}

output "private_key_path" {
    value = local_sensitive_file.private_key.filename
}

output "rds_endpoint" {
    value = aws_db_instance.postgres.endpoint
}

output "rds_host" {
    value = aws_db_instance.postgres.address
}