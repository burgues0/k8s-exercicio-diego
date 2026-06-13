output "instance_id" {
    value = aws_instance.api_server.id
}

output "rds_endpoint" {
    value = terraform_data.mock_rds.output.endpoint
}