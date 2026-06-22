output "gateway_public_ip" {
    value = module.compute.gateway_public_ip
}

output "backend_public_ip" {
    value = module.compute.backend_public_ip
}

output "rds_endpoint" {
    value = module.database.rds_endpoint
}

output "rds_host" {
    value = module.database.rds_host
}