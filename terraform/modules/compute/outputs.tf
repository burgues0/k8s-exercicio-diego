output "gateway_public_ip" {
    value = aws_instance.gateway.public_ip
}

output "backend_private_key_path" {
    value = local_sensitive_file.backend_private_key.filename
}

output "backend_port" {
    value = 2301
}

output "backend_2_private_key_path" {
    value = local_sensitive_file.backend_2_private_key.filename
}

output "backend_2_port" {
    value = 2302
}