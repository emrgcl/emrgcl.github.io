---
layout: post
title: "Terraform Refactoring: Azure VM Example"
date: 2023-05-04
categories: terraform azure refactoring
---

> When working with Terraform configurations, it's essential to keep them modular and maintainable. One way to achieve this is by using modules. This post demonstrates how to refactor an Azure VM Terraform configuration to use modules, without causing any changes to the existing infrastructure. We will also cover how to use the `terraform state mv` command to update the Terraform state during the refactoring process.

<!--more-->

## Initial Azure VM Configuration

Here's the initial Terraform configuration for an Azure VM:

{% highlight hcl %}
provider "azurerm" {
features {}
}

resource "azurerm_resource_group" "example" {
name = "example-resources"
location = "East US"
}

resource "azurerm_virtual_network" "example" {
name = "example-vnet"
address_space = ["10.0.0.0/16"]
location = azurerm_resource_group.example.location
resource_group_name = azurerm_resource_group.example.name
}

resource "azurerm_subnet" "example" {
name = "example-subnet"
resource_group_name = azurerm_resource_group.example.name
virtual_network_name = azurerm_virtual_network.example.name
address_prefixes = ["10.0.1.0/24"]
}

resource "azurerm_network_interface" "example" {
name = "example-nic"
location = azurerm_resource_group.example.location
resource_group_name = azurerm_resource_group.example.name

ip_configuration {
name = "internal"
subnet_id = azurerm_subnet.example.id
private_ip_address_allocation = "Dynamic"
}
}

resource "azurerm_linux_virtual_machine" "example" {
name = "example-vm"
location = azurerm_resource_group.example.location
resource_group_name = azurerm_resource_group.example.name
network_interface_ids = [
azurerm_network_interface.example.id,
]
size = "Standard_B1s"

admin_username = "adminuser"
admin_password = "P@ssw0rd1234!"

os_disk {
caching = "ReadWrite"
storage_account_type = "Standard_LRS"
}

source_image_reference {
publisher = "Canonical"
offer = "UbuntuServer"
sku = "18.04-LTS"
version = "latest"
}
}
{% endhighlight %}

## Refactored Configuration with Modules

Here's the refactored Terraform configuration that uses a module for the Azure VM:

### main.tf

{% highlight hcl %}
provider "azurerm" {
features {}
}

resource "azurerm_resource_group" "example" {
name = "example-resources"
location = "East US"
}

module "vm" {
source = "./vm"

resource_group_name = azurerm_resource_group.example.name
location = azurerm_resource_group.example.location
admin_username = "adminuser"
admin_password = "P@ssw0rd1234!"
}
{%endhighlight %}

### vm/variables.tf

{% highlight hcl %}
variable "resource_group_name" {
type = string
}

variable "location" {
type = string
}

variable "admin_username" {
type = string
}

variable "admin_password" {
type = string
}
{% endhighlight %}

### vm/main.tf

{% highlight hcl %}
resource "azurerm_virtual_network" "example" {
name = "example-vnet"
address_space = ["10.0.0.0/16"]
location = var.location
resource_group_name = var.resource_group_name
}

resource "azurerm_subnet" "example" {
name = "example-subnet"
resource_group_name = var.resource_group_name
virtual_network_name = azurerm_virtual_network.example.name
address_prefixes = ["10.0.1.0/24"]
}

resource "azurerm_network_interface" "example" {
name = "example-nic"
location = var.location
resource_group_name = var.resource_group_name

ip_configuration {
name = "internal"
subnet_id = azurerm_subnet.example.id
private_ip_address_allocation = "Dynamic"
}
}

resource "azurerm_linux_virtual_machine" "example" {
name = "example-vm"
location = var.location
resource_group_name = var.resource_group_name
network_interface_ids = [
azurerm_network_interface.example.id,
]
size = "Standard_B1s"

admin_username = var.admin_username
admin_password = var.admin_password

os_disk {
caching = "ReadWrite"
storage_account_type = "Standard_LRS"
}

source_image_reference {
publisher = "Canonical"
offer = "UbuntuServer"
sku = "18.04-LTS"
version = "latest"
}
}
{% endhighlight %}

## Updating Terraform State with `terraform state mv`

After refactoring, use the `terraform state mv` command to update the Terraform state:

1. Move the `azurerm_virtual_network` resource:

   {% highlight bash %}
   terraform state mv azurerm_virtual_network.example module.vm.azurerm_virtual_network.example
   {% endhighlight %}

2. Move the `azurerm_subnet` resource:

   {% highlight bash %}
   terraform state mv azurerm_subnet.example module.vm.azurerm_subnet.example
   {% endhighlight %}

3. Move the `azurerm_network_interface` resource:

   {% highlight bash %}
   terraform state mv azurerm_network_interface.example module.vm.azurerm_network_interface.example
   {% endhighlight %}

4. Move the `azurerm_linux_virtual_machine` resource:

   {% highlight bash %}
   terraform state mv azurerm_linux_virtual_machine.example module.vm.azurerm_linux_virtual_machine.example
   {% endhighlight %}

After running these `terraform state mv` commands, your Terraform state should be updated to match the new module structure. Run `terraform init`, `terraform validate`, and `terraform plan` to verify that your refactored configuration does not cause any changes to your existing infrastructure.

In conclusion, refactoring your Terraform configuration to use modules can help improve maintainability and modularity. Using the `terraform state mv` command allows you to update your Terraform state during the refactoring process without causing disruptions to your existing infrastructure.
