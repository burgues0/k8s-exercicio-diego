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

# general
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

resource "azurerm_network_security_group" "nsg" {
    name = "nsg-exercicio1"
    location = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name

    security_rule {
        name = "SSH"
        priority = 1001
        direction = "Inbound"
        access = "Allow"
        protocol = "Tcp"
        source_port_range = "*"
        destination_port_range = "22"
        source_address_prefix = "*"
        destination_address_prefix = "*"
    }

    security_rule {
        name = "HTTP"
        priority = 1002
        direction = "Inbound"
        access = "Allow"
        protocol = "Tcp"
        source_port_range = "*"
        destination_port_range = "80"
        source_address_prefix = "*"
        destination_address_prefix = "*"
    }

    security_rule {
        name = "API-Port"
        priority = 1003
        direction = "Inbound"
        access = "Allow"
        protocol = "Tcp"
        source_port_range = "*"
        destination_port_range = "3000"
        source_address_prefix = "*"
        destination_address_prefix = "*"
    }
}

# vm1
resource "azurerm_public_ip" "ip_vm1" {
    name = "ip-vm1"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location
    allocation_method = "Static"
    sku = "Standard"
}

resource "azurerm_network_interface" "nic_vm1" {
    name = "nic-vm1"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location

    ip_configuration {
        name = "internal"
        subnet_id = azurerm_subnet.subnet.id
        private_ip_address_allocation = "Static"
        private_ip_address = "10.0.10.4"
        public_ip_address_id = azurerm_public_ip.ip_vm1.id
    }
}

resource "azurerm_network_interface_security_group_association" "as_vm1" {
    network_interface_id = azurerm_network_interface.nic_vm1.id
    network_security_group_id = azurerm_network_security_group.nsg.id
}

resource "azurerm_linux_virtual_machine" "vm1" {
    name = "vm1"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location
    size = var.vm_size
    admin_username = "azureuser"
    disable_password_authentication = true
    network_interface_ids = [azurerm_network_interface.nic_vm1.id]

    admin_ssh_key {
        username = "azureuser"
        public_key = file("~/.ssh/azure.pub")
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

# vm2
resource "azurerm_public_ip" "ip_vm2" {
    name = "ip-vm2"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location
    allocation_method = "Static"
    sku = "Standard"
}

resource "azurerm_network_interface" "nic_vm2" {
    name = "nic-vm2"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location

    ip_configuration {
        name = "internal"
        subnet_id = azurerm_subnet.subnet.id
        private_ip_address_allocation = "Static"
        private_ip_address = "10.0.10.5"
        public_ip_address_id = azurerm_public_ip.ip_vm2.id
    }
}

resource "azurerm_network_interface_security_group_association" "as_vm2" {
    network_interface_id = azurerm_network_interface.nic_vm2.id
    network_security_group_id = azurerm_network_security_group.nsg.id
}

resource "azurerm_linux_virtual_machine" "vm2" {
    name = "vm2"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location
    size = var.vm_size
    admin_username = "azureuser"
    disable_password_authentication = true
    network_interface_ids = [azurerm_network_interface.nic_vm2.id]

    admin_ssh_key {
        username = "azureuser"
        public_key = file("~/.ssh/azure.pub")
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

# gateway
resource "azurerm_public_ip" "ip_gateway" {
    name = "ip-gateway"
    location = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name
    allocation_method = "Static"
    sku = "Standard"
}

resource "azurerm_network_interface" "nic_gateway" {
    name = "nic-gateway"
    location = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name

    ip_configuration {
        name = "internal"
        subnet_id = azurerm_subnet.subnet.id
        private_ip_address_allocation = "Static"
        private_ip_address = "10.0.10.6"
        public_ip_address_id = azurerm_public_ip.ip_gateway.id
    }
}

resource "azurerm_network_interface_security_group_association" "as_gateway" {
    network_interface_id = azurerm_network_interface.nic_gateway.id
    network_security_group_id = azurerm_network_security_group.nsg.id
}

resource "azurerm_linux_virtual_machine" "gateway" {
    name = "vm-gateway"
    resource_group_name = azurerm_resource_group.rg.name
    location = azurerm_resource_group.rg.location
    size = var.vm_size2
    admin_username = "azureuser"
    disable_password_authentication = true
    network_interface_ids = [azurerm_network_interface.nic_gateway.id]

    admin_ssh_key {
        username = "azureuser"
        public_key = file("~/.ssh/azure.pub")
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