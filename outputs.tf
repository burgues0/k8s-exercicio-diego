output "nome_vm" {
    value = azurerm_linux_virtual_machine.vm.name
}

output "ip_publico_vm" {
    value = azurerm_public_ip.ip.ip_address
}