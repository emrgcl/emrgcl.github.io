---
layout: post
title: "Fixing MSI Databases with PowerShell and GPT-4"
date: 2023-04-28
categories: [PowerShell, GPT-4, MSI, Windows]
tags: [powershell, gpt-4, msi, windows, installation, automation]
---

# Fixing MSI Databases with PowerShell and GPT-4

A few days ago, I encountered a software installation issue that left me stumped. The software couldn't be uninstalled with the system account, and it kept returning an MSI 1605 error. After a bit of research, I discovered that this issue might be caused by a bad `ProductID` in the MSI database. To resolve this problem, I needed a way to add the correct `ProductID` to the existing MSI file. That's when I turned to GPT-4 for assistance.

<!--more-->
<div class='chat-container'>
   <div class='message user'>
     <span class='content'>
      Hey GPT-4, can you help me add a `ProductID` to an existing MSI file using PowerShell?
     </span>
   </div>

   <div class='message assistant'>
     <span class='content'>
      Of course! You can use the Windows Installer COM object in PowerShell to modify the MSI file. Here's a script to add the `ProductID` property with the specified value:
     </span>
    {% highlight powershell %}
    # Define the path to the MSI file and the new MSI file
    $originalMsiPath = "path\to\original.msi"
    $newMsiPath = "path\to\modified.msi"

    # Copy the original MSI file to the new MSI file
    Copy-Item -Path $originalMsiPath -Destination $newMsiPath

    # Open the MSI file with the Windows Installer COM object
    $windowsInstaller = New-Object -ComObject WindowsInstaller.Installer
    $database = $windowsInstaller.OpenDatabase($newMsiPath, 1)

    # Define the new property and its value
    $propertyName = "ProductID"
    $propertyValue = "correct-product-id-value"

    # Add the property and its value to the MSI file
    $sqlQuery = "INSERT INTO `Property` (`Property`, `Value`) VALUES ('$propertyName', '$propertyValue')"
    $view = $database.OpenView($sqlQuery)
    $view.Execute()
    $view.Close()

    # Save the changes and close the MSI file
    $database.Commit()
        {% endhighlight %}
   </div>
   <div class='message user'>
     <span class='content'>
      That's awesome, GPT-4! I'll give it a try right away.
     </span>
   </div>
</div>

After implementing GPT-4's solution, I was able to modify the MSI file and add the correct ProductID. The software uninstallation process then worked flawlessly with the system account, and the MSI 1605 error was no more.

Throughout this experience, I was amazed at how GPT-4 could quickly provide a practical solution to my problem. It's incredible how advancements in AI, like GPT-4, have made it possible for us to tackle complex challenges with ease.

In conclusion, if you ever find yourself in a similar situation where you need to manipulate MSI databases, don't hesitate to give PowerShell and GPT-4 a try. It might just save you a lot of time and headaches!
