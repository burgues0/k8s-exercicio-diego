output "gateway_public_ip" {
    value = aws_instance.gateway.public_ip
}

output "backend_public_ip" {
    value = aws_instance.backend.public_ip
}

output "private_key_path" {
    value = local_sensitive_file.private_key.filename
}