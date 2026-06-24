output "gateway_public_ip" {
    value = module.compute.gateway_public_ip
}
output "backend_private_key_path" {
    value = module.compute.backend_private_key_path
}

output "backend_port" {
    value = module.compute.backend_port
}

output "rds_endpoint" {
    value = module.database.rds_endpoint
}

output "rds_host" {
    value = module.database.rds_host
}