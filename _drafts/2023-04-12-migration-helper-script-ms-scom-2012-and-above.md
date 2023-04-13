---
layout: post
title: "Creating a Migration Helper Script for Microsoft System Center Operations Manager 2012 and Above"
date: 2023-04-12
categories: [PowerShell, Microsoft, SCOM]
---

In this post, we will walk through the process of creating a PowerShell script to help migrate Microsoft System Center Operations Manager (SCOM) 2012 and above. The script will update XML configuration files by modifying the `ServerName` attribute under the `Cmdb` and `ConfigStore` categories. Additionally, we will implement `-WhatIf` support using `SupportsShouldProcess`.

<div class="chat-container">
<div class ="message user">
<span class="content">I will paste the content of a file named ConfigService.config . The file content is xml and I will ask you to create PowerShell script with my second request. Please verify that you understand and if so please wait for me to paste the xml content.</Span>
</div>
<div class = "message assistant">
<span class = "content">I understand your request. You want me to create a PowerShell script based on the XML content from a file named ConfigService.config. Please go ahead and paste the XML content, and I will help you create the PowerShell script accordingly.</span>
</div>
<div class = "messsage user">
<span class = "content"><pre><?xml version="1.0" encoding="utf-8"?>
<Config Version="1.0">
  <Component Name="Microsoft.EnterpriseManagement.ManagementConfiguration">
    <Instance Name="Default">
      <Category Name="Service">
        <Setting Name="ServiceEventLogName" Value="Operations Manager" />
        <Setting Name="ServiceEventLogSource" Value="OpsMgr Management Configuration" />
        <Setting Name="ServiceEventLogDisplayName" Value="OpsMgr Management Configuration Service" />
      </Category>
      <Category Name="Engine">
        <Setting Name="MaxResponseThreadsPercentage" Value="25" />
        <Setting Name="ThreadPoolThreadCountPerProcessor" Value="25" />
        <Setting Name="MaxThreadPoolThreadCount" Value="200" />
        <Setting Name="MaxConfigurationRequestBatchSize" Value="5" />
        <Setting Name="RequestReEnqueueOnLockoutTimeoutMilliseconds" Value="5000" />
        <Setting Name="ConfigurationHashingBufferSizeKb" Value="1024" />
      </Category>
      <Category Name="Cmdb">
        <Setting Name="ServerName" Value="scom" />
        <Setting Name="DatabaseName" Value="OperationsManager" />
        <Setting Name="PortNumber" Value="0" />
        <Setting Name="FailoverPartnerServerName" Value="" />
        <Setting Name="FailoverPartnerPortNumber" Value="0" />
      </Category>
      <Category Name="ConfigStore">
        <Setting Name="ServerName" Value="scom" />
        <Setting Name="DatabaseName" Value="OperationsManager" />
        <Setting Name="PortNumber" Value="0" />
        <Setting Name="FailoverPartnerServerName" Value="" />
      </Category>
    </Instance>
  </Component>
</Config></pre></span>
</div>
<div class="message user">
  <span class="content">I want you to create a PowerShell script that finds category element named 'cmdb' and under this category find the 'setting' sub element whose name attribute is 'ServerName' and change the value of the 'value' attribute to 'server1'</span>
</div>

<div class="message assistant">
  <span class="content">Sure, here's a PowerShell script that performs the requested operation:
  
  {% highlight powershell %}
[CmdletBinding(SupportsShouldProcess)]
param(
[Parameter(Mandatory=$true)][string]$FilePath,
    [Parameter(Mandatory=$true)][string]$ServerName
)

if (-not (Test-Path $FilePath)) {
Write-Error "File not found: $FilePath"
return
}

$xml = [xml](Get-Content $FilePath)

$categories = @("Cmdb", "ConfigStore")

foreach ($categoryName in $categories) {
$category = $xml.Config.Component.Instance.Category | Where-Object { $_.Name -eq $categoryName }
$setting = $category.Setting | Where-Object { $\_.Name -eq "ServerName" }

    if ($setting -ne $null) {
        $oldValue = $setting.Value
        if ($PSCmdlet.ShouldProcess("Updating ServerName setting in category '$categoryName' from '$oldValue' to '$ServerName'")) {
            $setting.Value = $ServerName
        }
    } else {
        Write-Error "Setting 'ServerName' not found under category '$categoryName'"
    }

}

if ($PSCmdlet.ShouldProcess("Saving changes to file '$FilePath'")) {
$xml.Save($FilePath)
}
{% endhighlight %}</span>

</div>

</div>

This script updates the `ServerName` attribute under the `Cmdb` and `ConfigStore`

categories and saves the changes back to the original file. It uses the `-WhatIf` parameter to show the potential changes before making them, providing a safe way to preview the results.

I hope this script helps you with your migration tasks for Microsoft System Center Operations Manager 2012 and above. If you have any questions or need further assistance, please feel free to ask in the comments section below.
