---
layout: post
title:  "Better Observability With Azure Monitor Agent (AMA)"
date:   2022-09-25 09:05:42 +0300
categories: Azure AzureMonitor AzureMonitorAgent 
---
# Overview

***Azure Monitor Agent (AMA)*** is Generally Available [since Jun 2021](https://techcommunity.microsoft.com/t5/azure-observability-blog/a-powerful-agent-for-azure-monitor-and-a-simpler-world-of-data/ba-p/2443285), hoping to replace the **legacy** agent (Microsoft Monitoring Agent (SCOM Agent) / Log Analytics Agent) on Windows Servers.

The Legacy agent [will not be supported](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/agents-overview) after August 2024.

Before diving into new features, deployment and configuration options of Azure Monitor Agent I would like to talk about the story of the Legacy Agent first. This will help us to better digest which path to choose while deploying or migrating.

The Legacy agent (Log Analytics Agent) is actually built on top of the beloved SCOM agent (Microsoft Monitoring Agent) which has been used by many enterprises since 2007! 

This agent served well for sending data to Log Analytics Worksapces but things evolved, change is continuous and there was a need for a new agent. There are many reasons but below are the main ones.
- Too many agents
- Configuration was not centralized
- Filtering Event log on the agent side was not available. We had to collect all or some but not be specific..
- Better deployment methods needed to align with DevOps pipelines using ARM. Collection settings was requiring to much effort to automate.
- Multi-home support limitations
- Performance (Event Per Second) improvements.

# The new Agent - Azure Monitor Agent - AMA
The new agent is actually an extension to Azure VM or to Arc For Servers which makes Arc For Servers a prerequisite for on prem scenarios. Yes! if you have on-prem servers you need to [Deploy Connected Machine Agent](https://learn.microsoft.com/en-us/azure/azure-arc/servers/deployment-options) first... (dont worry though, we will cover!)

## Data Collection Rules - DCR
Data is collection method is maybe the most important change. We are not collecting data any more with solutions or the agent management tab on log analytics workspaces but with ***Data Collection Rules** which are actually resources that can be manageable using arm! 

You can access these data collection rules in Monitor blade in the portal and add/remove/set using the portal.
![DCR](/assets/images/22-09-25-Better-Observability-With-AzureMonitorAgent/dcr-1.jpg)

# What about solutions ? 
We have our solutions that we loved, enabled them and forgot about data collection for many scenarios like VMInsights. 

This (Deploying solutions to Workspaces) method is ***legacy*** now! This method behind the scenes use the management pack framework of the old agent (SCOM/MMA/Log Analytics Agent) which is no more the case.

Since the data collection is done by DCRs, the solutions needs to be re-engineered to support to use DCRs. Dont worry again, most of them are Public Preview and soon to be parity with the elder ones.

>***Important:***  As the date of the post Not all solutions support the new DCR meaning the new agent... But many are in Public Preview.

Below is the current status of the solutions for the new agent.

| Azure Monitor Feature        | Current Support  |
|------------------------------|------------------|
| VM insights                  | Public Preview   |
| Container Insights           | Public Preview   |
| Microsoft Defender For Cloud | Public Preview   |
| Sentinel                     | Public Preview   |
| Change Tracking              | Private Preview  |
| Update Managemenetv2         | Public Preview   |

>***Note:*** the above information is valid as of the date of the post. Please check the paity using [this link](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/agents-overview#supported-services-and-features)

# Prerequisites

- On-Premise servers require that the server to be provision to Arc For Servers. 
 - Permissions: 
    - Azure VM: Member of ```Virtual Machine Contributor``` Role
    - Azure Arc-Enabled Servers: Member of ```Azure Connected Machine Resource Administrator``` Role
    - Arm Deployments: Any role that includes the action ```Microsoft.Resources/deployments/*``` on Subscription and/or Resource Groups
- [Firewall requirements](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-data-collection-endpoint?tabs=PowerShellWindows#firewall-requirements): please review the requirements 
    - if possible use Servicetags (both AzureMonitor and AzureResourceManager) where possible.
- Proxy: Azure Monitor agent supports proxy even though not in the documentation my personal experience is to disable the ssl inpsection on proxies as I had issues in the past.
- Identity: 
    - Azure VM: It is required the Azure VM to have identiy assigned. Both System-assigned or User-Assigned identities can be used. 
    - Azure Arc For Servers: For Azure Servers connectued using Arc, system-assigned identity is the only option is already handled by the connected machine agent installation.

# Deployment Options

- Use DCRs to Deploy the Extension: Once you target a DCR to a resource (vm or arc) the extension is deployed automatically.
- Deploy Extension using ARM (json/bicep): Declarative/template method to deploy the extension.
    - [Azure VM with User-Assigned identity](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/resource-manager-agent?tabs=json#user-assigned-managed-identity-recommended)
    - [Azure VM with System-Assigned identity](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/resource-manager-agent?tabs=json#system-assigned-managed-identity)
    - [Azure Arc-enabled Windows server](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/resource-manager-agent?tabs=bicep#azure-arc-enabled-windows-server)
- PowerShell or Azure CLI: The imperative way to deploy the extension. 
    - [User-assigned managed identity](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-manage?tabs=ARMAgentPowerShell%2CPowerShellWindows%2CPowerShellWindowsArc%2CCLIWindows%2CCLIWindowsArc#user-assigned-managed-identity)
    - [System-assigned managed identity](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-manage?tabs=ARMAgentPowerShell%2CPowerShellWindows%2CPowerShellWindowsArc%2CCLIWindows%2CCLIWindowsArc#system-assigned-managed-identity)
    - [Install on Azure Arc-enabled servers](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-manage?tabs=ARMAgentPowerShell%2CPowerShellWindows%2CPowerShellWindowsArc%2CCLIWindows%2CCLIWindowsArc#install-on-azure-arc-enabled-servers)

I have a repository which has deployment samples / demos I used in eaarlier events which you can access [here](https://github.com/emrgcl/EnableAMA). 

# Scenarios to Consider
Now we have a new agent but what to do? How to install or migrate ? There are several different scenarios which we will cover each in individual posts.

- Azure VMs
    - Azure VMs with no monitoring enabled earlier. Lucky you!!! :)
    - Azure VMs with Legacy agent installed and configured to send data to Azure Monitor only.
- On-Prem Servers
    - On-Prem Server with Legacy agent installed and congfigured to send data to both Azure Monitor and SCOM
    - On-Prem Server with Legacy agent installed and configured to send data to Azure Monitor (No SCOM in-place)

# References

- [A powerful agent for Azure Monitor and a simpler world of data collection; now generally available!](https://techcommunity.microsoft.com/t5/azure-observability-blog/a-powerful-agent-for-azure-monitor-and-a-simpler-world-of-data/ba-p/2443285)
- [Azure Monitor Agent overview](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/agents-overview)
- [Log Analytics agent overview](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/log-analytics-agent)
- [Azure Connected Machine agent deployment options
](https://learn.microsoft.com/en-us/azure/azure-arc/servers/deployment-options)
- [Supported services and features](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/agents-overview#supported-services-and-features)
- [Firewall requirements](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-data-collection-endpoint?tabs=PowerShellWindows#firewall-requirements)
