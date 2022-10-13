---
layout: post
title:  "Enable DevOps (Source Control) for Azure Autoamtion"
date:   2022-10-13 09:05:42 +0300
categories: Azure DevOps AzureAutomation 
---
> Do you need a better (**DevOps**) way to manage **Azure Automation runbooks**? In this post we will integrate Azure Automation With **Azure Devops**, start managing our runbooks using VSCode & Git.We will also discuss and decide a branching strategy based on **Git Flow**. Spend an hour with me to enhance your Azure Automation Workflow management.  

## Branching Strategy and Automatio Runbooks.
Before integrating source control for our beloved runbooks, we need to decide on how to manage the source aka. "Branching Strategy". 


My main goal in this solution is to isolate production and development deployments. I also need the runbook developers isolate their feature / runbook works from development and production until they are ready to release.

Well.. There a some common strategies followed by devs but "**Git Flow**" looks suitable for me. For more about branching strategies please [read this.](https://learn.microsoft.com/en-us/azure/devops/repos/git/git-branching-guidance?view=azure-devops)

Azure Automation allows us to integrate with source control and choose branches in git to sycn and publish the runbooks.

I can point Development branch to a development azure autoamtion account and the main branch to the production automation account.

That being said, I need two branches for releases (prod and dev) and individual branches to work on the runbook development.

The hiearchy of branches looks like.
Main: Production
Development: Development
Emreg_dev_runbook1: individual branch that develop code.
```
    |
    |--Main |
            |- Development
                    |
                    |- Emreg_dev_runbook1
```

I will do all coding effort on the level of "Emreg_dev_runbook1" crate as many branches as needed and once I am ready for release, I will **merge** the branch onto Development Branch.

At this point Azure Automation will kick sync because I made commit to Development Branch and my runbooks will be published to Development environment.

Once I am happy with the runbooks working on the Development Environment, I will merge Development environment onto main and main points to the prdouction Azure Autoomation and same sync will happen and now I am in prod!

## Requirements
Before diving into the topic make sure the following are in-place
1. Being a project administrator on an Azure DevOps project.
1. Being able to create and manage Automation account
1. Vscde & git for windows installed and some git fundenmentals (push, commit, branch, merge etc.)
1. Powershell console and Az module installed.

## High Level Steps
1. Create a Pat Token in Azure Devops and set necessary permissions
1. Set policy to align with Branching Policy
1. Create a repository for Azure Automation
1. Create two Branchecs (One for Development and one for Production)
1. Create two Azure Automation Accounts (One for Development and one for Production)
1. Configure Automation accounts for system assigned managed identiy and assign contribure role assignments
1. Configure Source Control on each Automation account


# Configure Source Control

```PowerShell
$parameters = @{
    Name = "DevopsIntegration"
    RepoUrl ="https://test@dev.azure.com/test/Project/_git/DbOps"
    SourceType ="vsogit"
    AccessToken = ("" | ConvertTo-SecureString -AsPlainText -Force)
    ResourceGroupName ="rg-"
    AutomationAccountName ="DevopsIntegration"
    FolderPath="/Runbooks"
    Branch ="master"
}
Connect-AzAccount | Out-Null
Set-AzContext -Subscription "xxxxa791-369f-48a7-966d-2f21afc2xxxx" | Out-Null
New-AzAutomationSourceControl @parameters
```