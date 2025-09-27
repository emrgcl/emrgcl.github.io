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

- **Scheduled Query Rule** - Runs KQL queries using the `arg()` function to access Azure Resource Graph and check SQL Server extension status across all accessible subscriptions
- **System Managed Identity** - Authenticates queries to Azure Resource Graph with Reader permissions (automatically assigned to deployment subscription, manual assignment needed for other subscriptions)
- **Action Group** - Sends detailed email notifications about failing servers with their specific Resource IDs
- **Role Assignment** - Grants managed identity Reader role at subscription level (automatic for deployment subscription via ARM template)

### Deployment Prerequisites

Before deploying this solution, ensure you have:

**Required Permissions:**
- **Contributor** role on the target resource group (to deploy the ARM template resources)
- **User Access Administrator** or **Owner** role at the subscription level (required for the ARM template to create the role assignment that grants the managed identity Reader access)
- **Note**: For multi-subscription monitoring, you'll also need User Access Administrator or Owner role on additional subscriptions to grant the managed identity Reader access to those subscriptions

**Required Resources:**
- An existing Log Analytics Workspace
- Azure Arc-enabled servers with SQL Server extensions installed
- **Important**: If Arc SQL Servers exist in multiple subscriptions, you'll need to manually grant Reader access after deployment (see Cross-Subscription Monitoring Setup section)

## Deep Dive: The Monitoring Query

The solution leverages Azure Resource Graph through Log Analytics to query Arc SQL Servers across all accessible subscriptions. Here's how it works:

### How the Query Executes

The scheduled query rule runs in your Log Analytics Workspace using the `arg()` function to access Azure Resource Graph:

```kql
arg("").resources
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

**Key Points:**
- The `arg("")` function queries Azure Resource Graph, not the Log Analytics data
- It can query across all subscriptions where the managed identity has Reader access
- Results include Arc SQL Servers from all accessible subscriptions
- **The Resource IDs of failing servers** are collected in the `FailedResourceIds` array for precise troubleshooting

### Understanding Permissions

The query requires proper permissions to work across subscriptions:

1. **Deployment Subscription**: The ARM template automatically grants Reader role to the alert rule's managed identity
2. **Other Subscriptions**: You must manually grant Reader access for Arc SQL Servers in other subscriptions
3. **Query Scope**: Without proper permissions, the query will only see Arc SQL Servers in the deployment subscription

### Cross-Subscription Monitoring Setup

If you have Arc SQL Servers across multiple subscriptions, you'll need to grant the managed identity **Reader** access to each subscription. The managed identity only needs Reader role (not Contributor or Owner) since it only queries resource information through Azure Resource Graph.

**Important**: You (the person running these commands) need User Access Administrator or Owner role on the target subscriptions to create these role assignments, but the managed identity itself only receives Reader permissions.

#### PowerShell Method

```powershell
# Get the alert rule's managed identity
$alertRuleName = "Arc SQL Upload Health Alert"
$resourceGroupName = "rg-arc-monitoring"
$alertRule = Get-AzScheduledQueryRule -Name $alertRuleName -ResourceGroupName $resourceGroupName
$principalId = $alertRule.Identity.PrincipalId

Write-Host "Managed Identity Principal ID: $principalId"

# Grant Reader role to additional subscriptions
$additionalSubscriptions = @(
    "subscription-id-2",
    "subscription-id-3"
)

foreach ($subId in $additionalSubscriptions) {
    Write-Host "Granting Reader role to subscription: $subId"
    New-AzRoleAssignment `
        -ObjectId $principalId `
        -RoleDefinitionName "Reader" `
        -Scope "/subscriptions/$subId"
}
```

#### Azure CLI Method

```bash
# Get the managed identity principal ID
ALERT_NAME="Arc SQL Upload Health Alert"
RG_NAME="rg-arc-monitoring"
PRINCIPAL_ID=$(az monitor scheduled-query show \
    --name "$ALERT_NAME" \
    --resource-group "$RG_NAME" \
    --query "identity.principalId" -o tsv)

echo "Managed Identity Principal ID: $PRINCIPAL_ID"

# Grant Reader role to additional subscriptions
SUBSCRIPTIONS=("subscription-id-2" "subscription-id-3")

for SUB_ID in "${SUBSCRIPTIONS[@]}"; do
    echo "Granting Reader role to subscription: $SUB_ID"
    az role assignment create \
        --assignee-object-id "$PRINCIPAL_ID" \
        --role "Reader" \
        --scope "/subscriptions/$SUB_ID"
done
```

#### Verify Permissions

After granting permissions, verify the managed identity can see Arc SQL Servers across subscriptions:

```powershell
# Test the query in Log Analytics
$query = @"
arg("").resources
| where type =~ 'microsoft.hybridcompute/machines/extensions'
| where properties.type in ('WindowsAgent.SqlServer', 'LinuxAgent.SqlServer')
| summarize ServerCount = count() by subscriptionId
| order by ServerCount desc
"@

Invoke-AzOperationalInsightsQuery -WorkspaceId "your-workspace-id" -Query $query
```

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

You have multiple options for deploying this ARM template. Choose the method that best fits your workflow:

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

## Advanced Scenarios

### Multi-Subscription Monitoring

Since the solution uses Azure Resource Graph via the `arg()` function, you don't need to deploy the template to each subscription. Instead, deploy once and grant the managed identity Reader access to all subscriptions:

```powershell
# Deploy the solution once
$deploymentSubscription = "primary-subscription-id"
Set-AzContext -SubscriptionId $deploymentSubscription
# Deploy template as shown above

# Then grant Reader access to all subscriptions with Arc SQL Servers
$alertRule = Get-AzScheduledQueryRule -Name "Arc SQL Upload Health Alert" -ResourceGroupName "rg-arc-monitoring"
$principalId = $alertRule.Identity.PrincipalId

$allSubscriptions = @("sub1-id", "sub2-id", "sub3-id")
foreach ($subId in $allSubscriptions) {
    New-AzRoleAssignment -ObjectId $principalId -RoleDefinitionName "Reader" -Scope "/subscriptions/$subId"
}
```

This single deployment will monitor all Arc SQL Servers across all granted subscriptions.

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