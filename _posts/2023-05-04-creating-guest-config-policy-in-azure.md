---
layout: post
title: "Creating a Guest Config Policy in Azure: A Chatbot-guided Tutorial"
excerpt: "Dive into the world of Azure Guest Configuration Policies with ChatGPT, as it expertly guides a user through the process of deploying a registry setting using PowerShell Desired State Configuration."
categories: [azure, powershell, tutorial]
---

> In a world where automation and cloud computing dominate the landscape, an eager learner sought the guidance of ChatGPT, an intelligent AI language model. The learner's goal was to create a Guest Configuration Policy in Azure that deployed a registry setting using PowerShell Desired State Configuration (DSC). ChatGPT eagerly obliged, providing a detailed and comprehensive tutorial.

Dive into the world of Azure Guest Configuration Policies with ChatGPT, as it expertly guides a user through the process of deploying a registry setting using PowerShell Desired State Configuration.

<!--more-->

<div class='chat-container'>
   <div class='message user'>
     <span class='content'>
      How do I create a Guest Configuration Policy in Azure to deploy a registry setting using PowerShell DSC?
     </span>
   </div>
   <div class='message assistant'>
     <span class='content'>
      To create a guest configuration policy in Azure that deploys a registry setting using PowerShell Desired State Configuration (DSC), you need to follow these steps:
     </span>
   </div>
</div>


- Install the required modules:
   {% highlight powershell %}
   Install-Module -Name Az -AllowClobber
   Install-Module -Name GuestConfiguration
   {% endhighlight %}

- Create a PowerShell DSC script:
   {% highlight powershell %}
   Configuration RegistryConfiguration {
       Import-DscResource -ModuleName PSDesiredStateConfiguration

       Node 'localhost' {
           Registry 'SetRegistryValue' {
               Key = 'HKEY_LOCAL_MACHINE\Software\ExampleKey'
               ValueName = 'ExampleValueName'
               ValueData = 'ExampleValueData'
               ValueType = 'String'
               Ensure = 'Present'
           }
       }
   }

   RegistryConfiguration
   {% endhighlight %}

- Create a MOF file:
   {% highlight powershell %}
   .\RegistryConfiguration.ps1
   {% endhighlight %}

- Create an Azure Storage Account:
   {% highlight powershell %}
   $resourceGroupName = "YourResourceGroupName"
   $location = "YourLocation"
   $storageAccountName = "youruniquestorageaccountname"

   New-AzResourceGroup -Name $resourceGroupName -Location $location
   New-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName -Location $location -SkuName Standard_LRS -Kind StorageV2
   {% endhighlight %}

- Upload the MOF file to the Storage Account:
   {% highlight powershell %}
   $ctx = (Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName).Context
   Set-AzStorageBlobContent -File '.\RegistryConfiguration\localhost.mof' -Container 'dscfiles' -Blob 'localhost.mof' -Context $ctx
   {% endhighlight %}

- Create a Guest Configuration Package:
   {% highlight powershell %}
   $configurationPath = '.\RegistryConfiguration\localhost.mof'
   New-GuestConfigurationPackage -Name 'RegistryConfiguration' -Path $configurationPath -Type 'Dsc'
   {% endhighlight %}

- Deploy the Guest Configuration Policy:
   {% highlight powershell %}
   $packagePath = '.\RegistryConfiguration.zip'
   $configurationDataPath = '.\RegistryConfiguration\ConfigurationData.psd1'
   $storageAccountSasToken = (New-AzStorageAccountSASToken -Service Blob -ResourceType Container, Object -Permission "r
{% endhighlight %}