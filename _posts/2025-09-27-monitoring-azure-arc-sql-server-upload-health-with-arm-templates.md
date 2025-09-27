---
layout: post
title: "Monitoring Azure Arc SQL Server Upload Health with ARM Templates"
date: 2025-09-27
categories: [Azure, Arc, SQL Server, Monitoring]
tags: [azure-arc, sql-server, arm-templates, monitoring, azure-monitor, hybrid-cloud]
summary: "Deploy an automated monitoring solution for Azure Arc-enabled SQL Servers that identifies exactly which servers are failing to upload data, enabling targeted troubleshooting instead of blind searching."
---

> Managing hybrid SQL Server environments can be challenging, especially when you need to quickly identify which specific servers are failing to upload telemetry data to Azure. I recently developed an ARM template that not only alerts you to upload failures but pinpoints exactly which servers need attention. No more hunting through dozens of servers - let me show you how it works.

<!--more-->

# Monitoring Azure Arc SQL Server Upload Health with ARM Templates

If you're managing SQL Servers across hybrid environments with Azure Arc, you know the importance of ensuring that telemetry data uploads consistently. When Arc-enabled SQL Servers fail to upload data, you lose visibility into performance metrics, security insights, and compliance data. Today, I'll walk you through an ARM template solution that automatically monitors these uploads and alerts you when failures occur.

<div align="center">
<strong>Just want to deploy?</strong>
<br/>
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fgist.githubusercontent.com%2Femrgcl%2F2b6666262cf6fe5a2cc5696b2b516227%2Fraw%2Farc-sql-monitoring.json"><img src="https://aka.ms/deploytoazurebutton" alt="Deploy to Azure"/></a>
<br/>
<a href="#template-parameters">💎 Click here for parameter details</a>
<br/>
<a href="#deployment-prerequisites">🛠️ Before deployment read prerequisites</a>
</div>


## The Challenge

Azure Arc extends Azure management capabilities to SQL Servers running anywhere - on-premises, in other clouds, or at the edge. These servers upload telemetry data to Azure through the Arc agent and SQL Server extension. However, various issues can cause upload failures:

- Network connectivity problems
- Authentication issues
- Extension configuration errors
- Resource constraints on the host server

Without proactive monitoring, these failures can go unnoticed for days or weeks, creating blind spots in your monitoring coverage.

## The Solution: Automated Upload Health Monitoring

I created this [ARM template](https://gist.github.com/emrgcl/2b6666262cf6fe5a2cc5696b2b516227) to deploy a complete monitoring solution for Arc SQL Server upload health. Here's what it does:

1. **Queries all Arc-enabled SQL Servers** in your subscription
2. **Checks the upload status** for each server
3. **Calculates the overall success rate** 
4. **Alerts via email** when the success rate drops below your threshold
5. **Provides the exact Resource IDs of all failing servers** - this is the real value, giving you a precise list of which Arc SQL Servers need immediate attention

## Architecture Overview

The solution consists of four main components:

![Arc SQL Monitoring Architecture](https://gist.github.com/user-attachments/assets/720d77b5-2da8-4c88-9348-6dc00bd39fb8)

- **Scheduled Query Rule** - Runs KQL queries against Azure Resource Graph to check SQL Server extension status
- **System Managed Identity** - Queries resources across your subscription with Reader permissions
- **Action Group** - Sends detailed email notifications about failing servers
- **Role Assignment** - Grants managed identity necessary subscription-level permissions

### Deployment Prerequisites

Before deploying this solution, ensure you have:

**Required Permissions:**
- **Contributor** role on the target resource group
- **User Access Administrator** or **Owner** role at the subscription level (for role assignment)

**Required Resources:**
- An existing Log Analytics Workspace
- Azure Arc-enabled servers with SQL Server extensions installed

## Deep Dive: The Monitoring Query

The solution uses a sophisticated KQL query that:

```kql
resources
| where type =~ 'microsoft.hybridcompute/machines/extensions'
| where properties.type in ('WindowsAgent.SqlServer', 'LinuxAgent.SqlServer')
| extend extensionMessage = tostring(properties.instanceView.status.message)
| extend uploadStatus = iif(extensionMessage contains 'SQL Server Extension State: Ready', 'Success', 'Failed')
| summarize 
    TotalServers = count(),
    SuccessfulServers = countif(uploadStatus == 'Success'),
    FailedServers = countif(uploadStatus == 'Failed'),
    FailedResourceIds = make_list_if(id, uploadStatus == 'Failed')
| project 
    TotalServers,
    SuccessfulServers,
    FailedServers,
    FailedResourceIds,
    SuccessRate = round((toreal(SuccessfulServers) / toreal(TotalServers)) * 100, 2)
```

The magic of this query:
- Finds all SQL Server extensions (both Windows and Linux)
- Parses the extension status message to determine upload health
- **Collects the Resource IDs of all failing servers** in the `FailedResourceIds` array
- Provides exact server identification for targeted troubleshooting

## Template Parameters

Understanding the parameters helps you customize the monitoring solution for your environment:

### Core Parameters

| Parameter | Type | Description | Default/Example |
|-----------|------|-------------|-----------------|
| **workspaceResourceId** | string | Full resource ID of your Log Analytics Workspace | `/subscriptions/{id}/resourceGroups/{rg}/providers/Microsoft.OperationalInsights/workspaces/{name}` |
| **emailReceiverName** | string | Display name for the email recipient in alerts | `SQL Admin Team` |
| **emailAddress** | string | Email address to receive alert notifications | `sqladmin@company.com` |

### Monitoring Configuration

| Parameter | Type | Description | Default | Options |
|-----------|------|-------------|---------|---------|
| **successRateThreshold** | integer | Minimum success rate percentage before triggering alert | `60` | 0-100 |
| **alertSeverity** | string | Severity level of the alert | `Warning` | `Critical`, `Error`, `Warning`, `Informational`, `Verbose` |
| **evaluationFrequency** | string | How often to check the upload status | `Daily` | `15 minutes`, `1 hour`, `6 hours`, `12 hours`, `Daily` |
| **windowDuration** | string | Time window to analyze for each evaluation | `Daily` | `15 minutes`, `1 hour`, `6 hours`, `12 hours`, `Daily` |

### Optional Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| **location** | string | Azure region for deployment | Resource group location |
| **alertRuleName** | string | Name of the alert rule | `Arc SQL Upload Health Alert` |
| **actionGroupName** | string | Name of the action group | `Arc SQL Action Group` |

### Parameter Examples

**Production Environment** - High criticality, daily reporting:
```json
{
  "successRateThreshold": 90,
  "alertSeverity": "Critical",
  "evaluationFrequency": "Daily"
}
```
*Recommendation: Use daily frequency for production as upload issues typically require manual intervention and won't auto-resolve. This provides a daily health report without alert fatigue.*

**Development Environment** - Lower criticality, more frequent checks:
```json
{
  "successRateThreshold": 50,
  "alertSeverity": "Informational",
  "evaluationFrequency": "6 hours"
}
```
*For development environments, more frequent checks can help identify issues during testing and deployment activities.*

## Deployment Steps

### 1. Quick Deploy with Azure Portal

The easiest way to deploy is using the Deploy to Azure button:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fgist.githubusercontent.com%2Femrgcl%2F2b6666262cf6fe5a2cc5696b2b516227%2Fraw%2Farc-sql-monitoring.json)

### 2. Deploy with PowerShell

```powershell
# Set parameters
$resourceGroupName = "rg-arc-monitoring"
$templateUri = "https://gist.githubusercontent.com/emrgcl/2b6666262cf6fe5a2cc5696b2b516227/raw/arc-sql-monitoring.json"

# Create parameters object
$parameters = @{
    workspaceResourceId = "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.OperationalInsights/workspaces/{workspace-name}"
    emailReceiverName = "SQL Admin Team"
    emailAddress = "sqladmin@company.com"
    successRateThreshold = 80
    alertSeverity = "Warning"
    evaluationFrequency = "1 hour"
}

# Deploy template
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
    -TemplateUri $templateUri `
    -TemplateParameterObject $parameters
```

### 3. Deploy with Azure CLI

```bash
# Set variables
RG_NAME="rg-arc-monitoring"
TEMPLATE_URI="https://gist.githubusercontent.com/emrgcl/2b6666262cf6fe5a2cc5696b2b516227/raw/arc-sql-monitoring.json"

# Deploy template
az deployment group create \
  --resource-group $RG_NAME \
  --template-uri $TEMPLATE_URI \
  --parameters \
    workspaceResourceId="/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.OperationalInsights/workspaces/{workspace-name}" \
    emailReceiverName="SQL Admin Team" \
    emailAddress="sqladmin@company.com" \
    successRateThreshold=80 \
    alertSeverity="Warning" \
    evaluationFrequency="1 hour"
```

## Troubleshooting Common Issues

### 1. Permission Errors During Deployment

**Error**: "The client does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write'"

**Solution**: Ensure you have User Access Administrator or Owner role at the subscription level:

```bash
az role assignment create --assignee "{your-user-id}" \
  --role "User Access Administrator" \
  --scope "/subscriptions/{subscription-id}"
```

### 2. No SQL Servers Found

**Symptom**: Alert shows 0 total servers

**Checks**:
```powershell
# Verify Arc SQL Server extensions are installed
Get-AzResource -ResourceType "Microsoft.HybridCompute/machines/extensions" | 
  Where-Object {$_.Properties.type -in @('WindowsAgent.SqlServer', 'LinuxAgent.SqlServer')}
```

### 3. False Positives

**Symptom**: Servers marked as failed but data is uploading

**Solution**: Check the extension message format:
```powershell
# Get extension status for a specific server
$extension = Get-AzResource -ResourceId "/subscriptions/{sub-id}/resourceGroups/{rg}/providers/Microsoft.HybridCompute/machines/{machine-name}/extensions/WindowsAgent.SqlServer"
$extension.Properties.instanceView.status.message
```

## Best Practices

### 1. Start with a Higher Threshold
Begin with an 80-90% threshold and adjust down as you resolve common issues in your environment.

### 2. Use Resource Tags
Tag your Arc-enabled servers for better organization:
```powershell
Set-AzResource -ResourceId $vmResourceId -Tag @{
    "Environment" = "Production"
    "SQLVersion" = "2019"
    "MonitoringEnabled" = "True"
}
```

### 3. Combine with Log Analytics
Query uploaded SQL data to verify monitoring accuracy:
```kql
SqlAssessment_CL
| where TimeGenerated > ago(24h)
| summarize count() by Computer
| join kind=fullouter (
    resources
    | where type =~ 'microsoft.hybridcompute/machines'
    | project Computer = name
) on Computer
```

### 4. Set Up Multiple Action Groups
Configure different notification methods for different environments:
- Email for standard alerts
- SMS for critical production issues
- Webhook for integration with ticketing systems

## Advanced Scenarios

### Multi-Subscription Monitoring

To monitor Arc SQL Servers across multiple subscriptions, deploy the template to each subscription and aggregate alerts in a central Log Analytics workspace:

```powershell
$subscriptions = @("sub1-id", "sub2-id", "sub3-id")

foreach ($sub in $subscriptions) {
    Set-AzContext -SubscriptionId $sub
    # Deploy template as shown above
}
```

### Integration with Azure Logic Apps

Extend the solution with Logic Apps for advanced automation:
1. Create a Logic App triggered by the alert
2. Query failing servers and gather additional diagnostics
3. Create ServiceNow tickets automatically
4. Attempt automated remediation

## Conclusion

This ARM template solution provides a robust, automated approach to monitoring Azure Arc SQL Server upload health. By proactively detecting upload failures, you can maintain visibility across your hybrid SQL Server estate and ensure compliance with monitoring requirements.

The beauty of this solution is its simplicity - deploy once and get continuous monitoring across all your Arc-enabled SQL Servers, regardless of where they're running. No agents to install, no complex configurations to maintain.

## Next Steps

1. **Deploy the template** in your test environment
2. **Adjust the threshold** based on your baseline success rate
3. **Extend the solution** with additional automation
4. **Share your experience** - I'd love to hear how this works in your environment!

The complete template and documentation are available in my [GitHub Gist](https://gist.github.com/emrgcl/2b6666262cf6fe5a2cc5696b2b516227). Feel free to fork it and customize it for your needs.

Have questions or suggestions? Leave a comment below or reach out on Twitter [@emrgcl](https://twitter.com/emrgcl).