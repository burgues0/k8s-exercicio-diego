terraform {
    required_providers {
        azurerm = {
            source = "hashicorp/azurerm"
            version = "=3.99.0"
        }
    }
}

provider "azurerm" {
    features {}
}

resource "azurerm_resource_group" "rg" {
    name = "rg-exercicio1"
    location = var.region
}

resource "azurerm_virtual_network" "vnet" {
    name = "vnet-exercicio1"
    address_space = ["10.0.0.0/16"]
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location
}

resource "azurerm_subnet" "subnet" {
    name = "subnet-exercicio1"
    resource_group_name = azurerm_resource_group.rg.name
    virtual_network_name = azurerm_virtual_network.vnet.name
    address_prefixes = ["10.0.10.0/24"]
}

resource "azurerm_public_ip" "ip" {
    name = "ip-exercicio1"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location
    allocation_method = "Static"
    sku = "Standard"
}

resource "azurerm_network_interface" "nic" {
    name = "nic-exercicio1"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location

    ip_configuration {
        name = "internal"
        subnet_id = azurerm_subnet.subnet.id
        private_ip_address_allocation = "Dynamic"
        public_ip_address_id = azurerm_public_ip.ip.id
    }
}

resource "azurerm_linux_virtual_machine" "vm" {
    name = "vm-exercicio1"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location
    size = var.vm_size
    admin_username = "azureuser"

    disable_password_authentication = true

    network_interface_ids = [
        azurerm_network_interface.nic.id
    ]

    admin_ssh_key {
        username = "azureuser"
        public_key = file("/home/burgues/.ssh/azure.pub")
    }

    os_disk {
        caching = "ReadWrite"
        storage_account_type = "Standard_LRS"
    }

    source_image_reference {
        publisher = "Canonical"
        offer = "0001-com-ubuntu-server-jammy"
        sku = "22_04-lts"
        version = "latest"
    }
}