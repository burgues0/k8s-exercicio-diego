output "ip_publico_vm1" {
    value = azurerm_public_ip.ip_vm1.ip_address
}

output "ip_publico_vm2" {
    value = azurerm_public_ip.ip_vm2.ip_address
}

output "ip_publico_gateway" {
    value = azurerm_public_ip.ip_gateway.ip_address
}