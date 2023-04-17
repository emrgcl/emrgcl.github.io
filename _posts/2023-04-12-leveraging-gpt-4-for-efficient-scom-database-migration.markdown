---
layout: post
title: "Leveraging GPT-4 for Efficient SCOM Database Move: A Time-Saving PowerShell Script Solution"
date: 2023-04-12
categories: [AI, GPT-4, PowerShell, SCOM]
---

In this post, we will explore how utilizing GPT-4 saved time and effort during a project involving the migration of SCOM databases in a large environment with six management servers. Instead of spending half a day manually developing and testing a PowerShell script to update XML configuration files, GPT-4 was employed to quickly create a reliable and efficient solution. The script modifies the ServerName attribute under the Cmdb and ConfigStore categories and implements -WhatIf support using SupportsShouldProcess. Discover the power of AI-driven assistance and how GPT-4 can revolutionize the way we approach complex tasks like this one.

> Note: Please note that the users (EG) prompts are not corrected, typos, grammar mistakes might exist to reflect the real life epxerience.

<div class="chat-container">
<div class ="message user">
<span class="content">I will paste the content of a file named ConfigService.config . The file content is xml and I will ask you to create PowerShell script with my second request. Please verify that you understand and if so please wait for me to paste the xml content.</Span>
</div>
<div class = "message assistant">
<span class = "content">I understand your request. You want me to create a PowerShell script based on the XML content from a file named ConfigService.config. Please go ahead and paste the XML content, and I will help you create the PowerShell script accordingly.</span>
</div>
</div>
<!--more-->
<div class="chat-container">
<div class ="message user">
<span class="content">{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
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
</Config>
{% endhighlight %}</Span>
</div>

<div class = "message assistant">
<span class = "content">Here is a PowerShell script that reads the XML content you provided and stores it in a variable named `$xmlContent` . You can use this variable to extract any required information from the XML and manipulate it as needed.
<span>
{%highlight PowerShell%}

$xmlContent = @"

<?xml version="1.0" encoding="utf-8"?>
<Config Version="1.0">
  ...
</Config>
"@

# Load the XML content into an XML object

[xml]$xmlObject = $xmlContent

# Access XML elements using the XML object

# Example: Access the ServerName value in the Cmdb Category

$serverName = $xmlObject.Config.Component.Instance.Category.Where({ $_.Name -eq "Cmdb" }).Setting.Where({ $_.Name -eq "ServerName" }).Value

# Output the value of the ServerName setting

Write-Host "Server Name: $serverName"
{%endhighlight%}

</span>
Replace the ... with the rest of the XML content you provided. You can modify this script to extract other values or perform additional tasks based on the XML content.
</span>

</div>

</div>

So far so good. The script finds the xml element, stores it into a variable and then outputs the variable. Couple things to improve.

1. Change the value of the element
1. Add the second category
1. Make variables parametric. The xml is burried into the script we should get it from a path, plus the servername
1. Doesnt yet save but only output the result.
1. As mentioned in summary it would be great to have `-whatif` option.

My requirement was simple in the beggining I wanted GPT4 to find an change the value of an element in xml using PowerShell. Starting small and adding step by step was my strategy in this conversation. Lets improve the script now.

<div class="chat-container">

<div class="message user">
  <span class="content">I want you to create a PowerShell script that finds category element named 'cmdb' and under this category find the 'setting' sub element whose name attribute is 'ServerName' and change the value of the 'value' attribute to 'server1'</span>
</div>

<div class = "message assistant">
<span class = "content">Here is a PowerShell script that loads the XML content, finds the 'cmdb' category, locates the 'setting' element with the name attribute 'ServerName', and changes the 'value' attribute to 'server1':
{%highlight PowerShell%}
$xmlContent = @"
<?xml version="1.0" encoding="utf-8"?>
<Config Version="1.0">
  ...
</Config>
"@

# Load the XML content into an XML object

[xml]$xmlObject = $xmlContent

# Find the 'cmdb' category

$cmdbCategory = $xmlObject.Config.Component.Instance.Category | Where-Object { $\_.Name -eq 'Cmdb' }

# Find the 'setting' element with the name attribute 'ServerName'

$serverNameSetting = $cmdbCategory.Setting | Where-Object { $\_.Name -eq 'ServerName' }

# Change the 'value' attribute to 'server1'

$serverNameSetting.Value = 'server1'

# Save the modified XML content to a new file, if needed

$xmlObject.Save("ModifiedConfigService.config")

# Display the modified XML content

Write-Host $xmlObject.OuterXml

{%endhighlight%}
Replace the ... with the rest of the XML content you provided. This script will display the modified XML content in the console. If you want to save the modified XML to a new file, uncomment the line $xmlObject.Save("ModifiedConfigService.config").
</span>

</div>
<div class="message user">
  <span class="content">I want you to load the xml from the file and in the end save the xml to the same file</span>
</div>
<div class="message assistant">
<span class="content">
Here's a PowerShell script that reads the XML content from a file named `ConfigService.config`, modifies the 'value' attribute of the 'ServerName' setting under the 'cmdb' category, and then saves the changes back to the same file:
{%highlight PowerShell%}
# Load the XML content from the file
[xml]$xmlObject = Get-Content -Path "ConfigService.config"

# Find the 'cmdb' category

$cmdbCategory = $xmlObject.Config.Component.Instance.Category | Where-Object { $\_.Name -eq 'Cmdb' }

# Find the 'setting' element with the name attribute 'ServerName'

$serverNameSetting = $cmdbCategory.Setting | Where-Object { $\_.Name -eq 'ServerName' }

# Change the 'value' attribute to 'server1'

$serverNameSetting.Value = 'server1'

# Save the modified XML content back to the same file

$xmlObject.Save("ConfigService.config")

{%endhighlight%}
This script assumes that the file ConfigService.config exists in the current working directory. If it's in another directory, update the file path in both the Get-Content and $xmlObject.Save() commands accordingly.
</span>

</div>

<div class = 'message user'>
<span class='content'>
okay now I want you to add risk mitigation by implementing -whatif with supportshouldprocessed enabled in the script. the if block should be placed where you make the change to the attribute and also the if block should include the save. In the operetion mention the path of the value and as target use the current value of the 'value' attribute
</span>
</Div>

<div class='message assistant'>
  <span class='content'>
   To add risk mitigation using -WhatIf with SupportShouldProcess enabled, you can create a PowerShell script with cmdletbinding attribute and use the ShouldProcess() function. Here's the updated script:
   {% highlight powershell %}
   [CmdletBinding(SupportsShouldProcess=$true)]
param()

# Load the XML content from the file

[xml]$xmlObject = Get-Content -Path "ConfigService.config"

# Find the 'cmdb' category

$cmdbCategory = $xmlObject.Config.Component.Instance.Category | Where-Object { $\_.Name -eq 'Cmdb' }

# Find the 'setting' element with the name attribute 'ServerName'

$serverNameSetting = $cmdbCategory.Setting | Where-Object { $\_.Name -eq 'ServerName' }

# Define the operation and target for the ShouldProcess() function

$operation = "Change the 'value' attribute of the 'ServerName' setting"
$target = $serverNameSetting.Value

# Check if the operation should be executed

if ($PSCmdlet.ShouldProcess($target, $operation)) { # Change the 'value' attribute to 'server1'
$serverNameSetting.Value = 'server1'

    # Save the modified XML content back to the same file
    $xmlObject.Save("ConfigService.config")

}
{% endhighlight %}

Now, you can run this script with the -WhatIf flag to see what would happen without actually making changes:

{% highlight powershell %}
.\YourScriptName.ps1 -WhatIf
{% endhighlight %}

Replace YourScriptName.ps1 with the actual name of the PowerShell script file. If you want to execute the changes, run the script without the -WhatIf flag:

{% highlight powershell %}
.\YourScriptName.ps1

{% endhighlight %}
</span>

</div>
<div class='message user'>
  <span class='content'>
   now please instead of hardcoding the value please use a parameter in the script named ServerName and plase add the FilePath parameter to load the file from.
  </span>
</div>
<div class='message assistant'>
  <span class='content'>
   To use parameters for the ServerName and FilePath, you can modify the script as follows:
   {% highlight powershell %}
   [CmdletBinding(SupportsShouldProcess=$true)]
param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath,

    [Parameter(Mandatory=$true)]
    [string]$ServerName

)

# Load the XML content from the file

[xml]$xmlObject = Get-Content -Path $FilePath

# Find the 'cmdb' category

$cmdbCategory = $xmlObject.Config.Component.Instance.Category | Where-Object { $\_.Name -eq 'Cmdb' }

# Find the 'setting' element with the name attribute 'ServerName'

$serverNameSetting = $cmdbCategory.Setting | Where-Object { $\_.Name -eq 'ServerName' }

# Define the operation and target for the ShouldProcess() function

$operation = "Change the 'value' attribute of the 'ServerName' setting"
$target = $serverNameSetting.Value

# Check if the operation should be executed

if ($PSCmdlet.ShouldProcess($target, $operation)) { # Change the 'value' attribute to the provided ServerName
$serverNameSetting.Value = $ServerName

    # Save the modified XML content back to the same file
    $xmlObject.Save($FilePath)

}

{% endhighlight %}
Now you can run the script and provide the ServerName and FilePath as parameters:

{% highlight powershell %}
.\YourScriptName.ps1 -FilePath "ConfigService.config" -ServerName "server1" -WhatIf

{% endhighlight %}
Replace YourScriptName.ps1 with the actual name of the PowerShell script file. If you want to execute the changes, run the script without the -WhatIf flag:
{% highlight powershell %}
.\YourScriptName.ps1 -FilePath "ConfigService.config" -ServerName "server1"

{% endhighlight %}
</span>

</div>
<div class='message user'>
  <span class='content'>
   I will now want a very similar update/change in the xml that you should perform in the same script.  Are you ready ?
  </span>
</div>
<div class='message assistant'>
  <span class='content'>
   Yes, I'm ready. Please provide the details of the update/change you'd like to make in the XML, and I'll help you modify the script accordingly.
  </span>
</div>
<div class='message user'>
  <span class='content'>
   Now find category element named ‘configstore’ and under this category find the 'setting' sub element whose name attribute is 'ServerName' and change the value of the 'value' attribute to 'server1’. Make only one save to xml and to file.
  </span>
</div>
<div class='message assistant'>
  <span class='content'>
   I've updated the script to include the changes you requested. It now finds the 'configstore' category and updates the 'ServerName' setting under it as well. The XML is saved to the file only once.
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

{% endhighlight %}
You can use this script to update both 'Cmdb' and 'ConfigStore' categories with the specified 'ServerName' value, and it will save the changes to the file only once.
</span>

</div>
</div>

The script works perfectly fine and if you run on your management server it will do the job. Now we need to find a way to run on all management servers. Lets make it another post : )

Have fun!
