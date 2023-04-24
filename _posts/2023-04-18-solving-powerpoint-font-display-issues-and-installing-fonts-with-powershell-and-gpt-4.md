---
layout: post
title: "Solving PowerPoint Font Display Issues and Installing Fonts with PowerShell: A Journey with GPT-4"
date: 2023-04-18
categories: [PowerShell, Productivity, AI]
---

Recently, I encountered an issue while working on a PowerPoint slide deck on my laptop. I used the Cascadia Code font, which displayed perfectly while I was editing the slides. However, when I presented the slideshow on the same computer, the Cascadia Code font did not display. Instead, the default font appeared in its place. This was confusing and frustrating, so I decided to find a solution to resolve this issue.

To find a solution, I turned to GPT-4, an AI language model by OpenAI. I started by explaining the problem and asking for a reason why it occurred. GPT-4 provided valuable insights into the issue, explaining that the font might not have been installed on my system. It also suggested using PowerShell to install the font.

<div class='chat-container'>
   <div class='message user'>
     <span class='content'>
      why/how did this happen? I am editing on the same computer.
     </span>
   </div>
   <div class='message assistant'>
     <span class='content'>
      It is possible that the Cascadia Code font is not properly installed on your computer. Although PowerPoint may display the font correctly while editing, it may revert to the default font during the slideshow if the font is not installed on the system.
     </span>
   </div>
</div>

<!--more-->

During our conversation, GPT-4 guided me in creating a PowerShell script to download, extract, and install the Cascadia Code font on my system. The AI even helped me improve the script to automatically retrieve the font name from the font file.

{% highlight powershell %}
function Get-FontName {
    param (
        [Parameter(Mandatory=$true)][string]$FontPath
    )

    $fontBytes = [System.IO.File]::ReadAllBytes($FontPath)
    $font = New-Object -TypeName System.Drawing.Text.PrivateFontCollection

    $fontData = [System.Runtime.InteropServices.Marshal]::AllocHGlobal($fontBytes.Length)
    [System.Runtime.InteropServices.Marshal]::Copy($fontBytes, 0, $fontData, $fontBytes.Length)
    $font.AddMemoryFont($fontData, $fontBytes.Length)
    [System.Runtime.InteropServices.Marshal]::FreeHGlobal($fontData)

    $font.Families[0].Name
}

$url = "https://github.com/microsoft/cascadia-code/releases/download/v2111.01/CascadiaCode-2111.01.zip"
$output = "C:\Temp\CascadiaCode.zip"
$extractFolder = "C:\Temp\CascadiaCode"

# Download the zip file

Invoke-WebRequest -Uri $url -OutFile $output

# Extract the zip file

Expand-Archive -Path $output -DestinationPath $extractFolder -Force

# Find the font file (.ttf) in the extracted folder

$fontFile = Get-ChildItem -Path $extractFolder -Filter "*.ttf" -Recurse | Select-Object -First 1

if ($fontFile) {
    $fontDestination = "C:\Windows\Fonts\$($fontFile.Name)"
$fontName = Get-FontName -FontPath $fontFile.FullName

    if (-Not (Test-Path -Path $fontDestination)) {
        # Install the font
        Copy-Item -Path $fontFile.FullName -Destination $fontDestination
        $fontRegistryKey = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts"
        $fontRegistryValueName = "$fontName (TrueType)"
        Set-ItemProperty -Path $fontRegistryKey -Name $fontRegistryValueName -Value $fontFile.Name
        Write-Host "$fontName font installed successfully."
    } else {
        Write-Host "$fontName font is already installed."
    }

} else {
Write-Host "Font file not found in the extracted folder."
}
{%endhighlight%}

I opened PowerShell and pasted the script into the window, then pressed Enter to execute it. The script downloaded the provided zip file, extracted its contents to a temporary folder, located the font file, and installed the Cascadia Code font on my system. When the font installation was successful, the script displayed a message indicating that the font had been installed.

After installing the Cascadia Code font using this PowerShell script, the font displayed correctly in both editing and slideshow modes in PowerPoint. This solution not only resolved my font display issue, but also allowed me to easily install other fonts using PowerShell
