output "gateway_public_ip" {
    value = aws_instance.gateway.public_ip
}

output "backend_private_key_path" {
    value = local_file.backend_private_key.filename
}

output "backend_port" {
    value = 2301
}