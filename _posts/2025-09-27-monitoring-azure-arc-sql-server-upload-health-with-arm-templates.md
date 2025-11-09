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

## The Solution: Comprehensive Arc SQL Server Monitoring

I created this [ARM template](https://gist.github.com/emrgcl/2b6666262cf6fe5a2cc5696b2b516227) to deploy a complete monitoring solution for Arc SQL Server health. The solution now includes **two independent monitoring rules** that work together to give you full visibility:

### 1. Upload Health Monitoring
- **Detects stale data**: Identifies Arc SQL Server extensions that haven't uploaded data within a configurable timeout period (default: 3 days)
- **Catches offline servers**: Unlike simple status checks, this detects servers that show "OK" but haven't actually uploaded recently
- **Provides precise targeting**: Lists exact Resource IDs of affected machines (up to 5000)

### 2. Provisioning Failure Monitoring  
- **Identifies deployment issues**: Catches extensions stuck in Creating, Updating, Failed, or any non-Succeeded state
- **Enables rapid response**: Alerts on provisioning problems that could block SQL Server management
- **Pinpoints problem servers**: Provides exact Resource IDs for targeted troubleshooting

## Architecture Overview

The solution consists of these main components:

![Arc SQL Monitoring Architecture](https://gist.github.com/user-attachments/assets/720d77b5-2da8-4c88-9348-6dc00bd39fb8)

- **Two Scheduled Query Rules** - Run KQL queries using the `arg()` function to access Azure Resource Graph
- **Shared Action Group** - Both alerts use the same action group for consistent notifications to multiple recipients
- **System Managed Identities** - Each alert rule has its own managed identity for authentication
- **Role Assignments** - Grant managed identities Reader role at subscription level (automatic for deployment subscription)

### Deployment Prerequisites

Before deploying this solution, ensure you have:

**Required Permissions:**
- **Contributor** role on the target resource group (to deploy the ARM template resources)
- **User Access Administrator** or **Owner** role at the subscription level (required for the ARM template to create the role assignments that grant the managed identities Reader access)
- **Note**: For multi-subscription monitoring, you'll also need User Access Administrator or Owner role on additional subscriptions to grant the managed identities Reader access to those subscriptions

**Required Resources:**
- An existing Log Analytics Workspace
- Azure Arc-enabled servers with SQL Server extensions installed
- **Important**: If Arc SQL Servers exist in multiple subscriptions, you'll need to manually grant Reader access after deployment (see Cross-Subscription Monitoring Setup section)

## Deep Dive: The Monitoring Queries

The solution leverages Azure Resource Graph through Log Analytics to query Arc SQL Servers across all accessible subscriptions. Here's how each query works:

### Upload Health Query

This query detects servers that haven't uploaded data within the timeout period:
```kql
arg("").Resources
| where type == "microsoft.hybridcompute/machines/extensions"
| where properties.type in ("WindowsAgent.SqlServer", "LinuxAgent.SqlServer")
| extend machineResourceId = substring(id, 0, indexof(id, "/extensions"))
| extend statusExpirationLengthRange = 3d  // Configurable via parameter
| extend startDate = startofday(now() - statusExpirationLengthRange), endDate = startofday(now())
| extend extractedDateString = extract("timestampUTC : (\\d{4}\\W\\d{2}\\W\\d{2})", 1, tostring(properties.instanceView.status.message))
| extend extractedDateStringYear = split(extractedDateString, '/')[0], extractedDateStringMonth = split(extractedDateString, '/')[1], extractedDateStringDay = split(extractedDateString, '/')[2]
| extend extractedDate = todatetime(strcat(extractedDateStringYear,"-",extractedDateStringMonth,"-",extractedDateStringDay,"T00:00:00Z"))
| extend isNotInDateRange = not(extractedDate >= startDate and extractedDate <= endDate)
| where properties.provisioningState == "Succeeded"
| where isNotInDateRange == 1
| summarize
    FailedCount = dcount(machineResourceId),
    FailedMachinesList = strcat_array(make_set(machineResourceId, 5000), ";")
```

### Provisioning Failure Query

This simpler query identifies extensions with provisioning issues:
```kql
arg("").resources
| where type == "microsoft.hybridcompute/machines/extensions"
| where properties.type in ("WindowsAgent.SqlServer", "LinuxAgent.SqlServer")
| extend machineResourceId = substring(id, 0, indexof(id, "/extensions"))
| where properties.provisioningState != "Succeeded"
| summarize
    FailedCount = dcount(machineResourceId),
    FailedProvisioningList = strcat_array(make_set(machineResourceId, 5000), ";")
```

**Key Points:**
- Both queries use `arg("")` to access Azure Resource Graph
- Results include Arc SQL Servers from all accessible subscriptions
- Machine Resource IDs are extracted and deduplicated
- Lists are limited to 5000 entries due to string size constraints

### Understanding Permissions

The queries require proper permissions to work across subscriptions:

1. **Deployment Subscription**: The ARM template automatically grants Reader role to both alert rules' managed identities
2. **Other Subscriptions**: You must manually grant Reader access for Arc SQL Servers in other subscriptions
3. **Query Scope**: Without proper permissions, the queries will only see Arc SQL Servers in the deployment subscription

### Cross-Subscription Monitoring Setup

If you have Arc SQL Servers across multiple subscriptions, you'll need to grant the managed identities **Reader** access to each subscription. Each alert rule has its own managed identity that needs permissions.

**Important**: You (the person running these commands) need User Access Administrator or Owner role on the target subscriptions to create these role assignments, but the managed identities themselves only receive Reader permissions.

#### PowerShell Method
```powershell
# Get both alert rules' managed identities
$uploadAlertName = "Arc-SQL-Server-Upload-Health-Monitor"
$provisioningAlertName = "Arc-SQL-Extension-Provisioning-Failures"
$resourceGroupName = "rg-arc-monitoring"

$uploadAlert = Get-AzScheduledQueryRule -Name $uploadAlertName -ResourceGroupName $resourceGroupName
$provisioningAlert = Get-AzScheduledQueryRule -Name $provisioningAlertName -ResourceGroupName $resourceGroupName

$uploadPrincipalId = $uploadAlert.Identity.PrincipalId
$provisioningPrincipalId = $provisioningAlert.Identity.PrincipalId

Write-Host "Upload Alert Managed Identity: $uploadPrincipalId"
Write-Host "Provisioning Alert Managed Identity: $provisioningPrincipalId"

# Grant Reader role to additional subscriptions
$additionalSubscriptions = @(
    "subscription-id-2",
    "subscription-id-3"
)

foreach ($subId in $additionalSubscriptions) {
    Write-Host "Granting Reader role to subscription: $subId"
    
    # Grant for upload monitoring alert
    New-AzRoleAssignment `
        -ObjectId $uploadPrincipalId `
        -RoleDefinitionName "Reader" `
        -Scope "/subscriptions/$subId"
    
    # Grant for provisioning monitoring alert  
    New-AzRoleAssignment `
        -ObjectId $provisioningPrincipalId `
        -RoleDefinitionName "Reader" `
        -Scope "/subscriptions/$subId"
}
```

#### Azure CLI Method
```bash
# Get the managed identity principal IDs
UPLOAD_ALERT="Arc-SQL-Server-Upload-Health-Monitor"
PROVISIONING_ALERT="Arc-SQL-Extension-Provisioning-Failures"
RG_NAME="rg-arc-monitoring"

UPLOAD_PRINCIPAL=$(az monitor scheduled-query show \
    --name "$UPLOAD_ALERT" \
    --resource-group "$RG_NAME" \
    --query "identity.principalId" -o tsv)

PROVISIONING_PRINCIPAL=$(az monitor scheduled-query show \
    --name "$PROVISIONING_ALERT" \
    --resource-group "$RG_NAME" \
    --query "identity.principalId" -o tsv)

echo "Upload Alert Managed Identity: $UPLOAD_PRINCIPAL"
echo "Provisioning Alert Managed Identity: $PROVISIONING_PRINCIPAL"

# Grant Reader role to additional subscriptions
SUBSCRIPTIONS=("subscription-id-2" "subscription-id-3")

for SUB_ID in "${SUBSCRIPTIONS[@]}"; do
    echo "Granting Reader role to subscription: $SUB_ID"
    
    # Grant for upload monitoring alert
    az role assignment create \
        --assignee-object-id "$UPLOAD_PRINCIPAL" \
        --role "Reader" \
        --scope "/subscriptions/$SUB_ID"
    
    # Grant for provisioning monitoring alert
    az role assignment create \
        --assignee-object-id "$PROVISIONING_PRINCIPAL" \
        --role "Reader" \
        --scope "/subscriptions/$SUB_ID"
done
```

#### Verify Permissions

After granting permissions, verify the managed identities can see Arc SQL Servers across subscriptions:
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

The template has been updated with new parameters for better flexibility and multi-recipient support:

### Core Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| **workspaceResourceId** | string | Full resource ID of your Log Analytics Workspace | `/subscriptions/{id}/resourceGroups/{rg}/providers/Microsoft.OperationalInsights/workspaces/{name}` |
| **emailAddresses** | array | Array of email addresses for notifications | `["admin@contoso.com", "dba@contoso.com"]` |

### Monitoring Configuration

| Parameter | Type | Description | Default | Options |
|-----------|------|-------------|---------|---------|
| **uploadTimeoutDays** | integer | Days without data upload before marking as failed | `3` | 1-30 |
| **alertSeverity** | string | Severity level for both alerts | `Critical` | `Critical`, `Error`, `Warning`, `Informational`, `Verbose` |
| **evaluationFrequency** | string | How often to check both conditions | `Daily` | `15 minutes`, `1 hour`, `6 hours`, `12 hours`, `Daily` |

### Optional Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| **projectTag** | string | Tag value for resource tagging | `ArcSqlMonitor` |

### Parameter Examples

**Production Environment** - Daily health reports with 3-day timeout:
```json
{
  "emailAddresses": ["sql-admins@company.com", "ops-team@company.com"],
  "uploadTimeoutDays": 3,
  "alertSeverity": "Critical",
  "evaluationFrequency": "Daily"
}
```
*Recommendation: Daily frequency works well as a reporting mechanism, providing a daily health status without alert fatigue.*

**Test Environment** - More frequent checks with shorter timeout:
```json
{
  "emailAddresses": ["dev-team@company.com"],
  "uploadTimeoutDays": 1,
  "alertSeverity": "Warning",
  "evaluationFrequency": "6 hours"
}
```
*For test environments, shorter timeouts help catch issues during development and testing cycles.*

## Deployment Steps

You have multiple options for deploying this ARM template. Choose the method that best fits your workflow:

### 1. Quick Deploy with Azure Portal

The easiest way to deploy is using the Deploy to Azure button:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fgist.githubusercontent.com%2Femrgcl%2F2b6666262cf6fe5a2cc5696b2b516227%2Fraw%2Fe1abe2a7aa463cd1d2dadd13ed9ab3b800a5002b%2Farc-sql-monitoring.json)

### 2. Deploy with PowerShell
```powershell
# Set parameters
$resourceGroupName = "rg-arc-monitoring"
$templateUri = "https://gist.githubusercontent.com/emrgcl/2b6666262cf6fe5a2cc5696b2b516227/raw/e1abe2a7aa463cd1d2dadd13ed9ab3b800a5002b/arc-sql-monitoring.json"

# Create parameters object
$parameters = @{
    workspaceResourceId = "/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.OperationalInsights/workspaces/{workspace-name}"
    emailAddresses = @("sql-admins@company.com", "dba-team@company.com")
    uploadTimeoutDays = 3
    alertSeverity = "Critical"
    evaluationFrequency = "Daily"
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
TEMPLATE_URI="https://gist.githubusercontent.com/emrgcl/2b6666262cf6fe5a2cc5696b2b516227/raw/e1abe2a7aa463cd1d2dadd13ed9ab3b800a5002b/arc-sql-monitoring.json"

# Deploy template
az deployment group create \
  --resource-group $RG_NAME \
  --template-uri $TEMPLATE_URI \
  --parameters \
    workspaceResourceId="/subscriptions/{subscription-id}/resourceGroups/{rg-name}/providers/Microsoft.OperationalInsights/workspaces/{workspace-name}" \
    emailAddresses='["sql-admins@company.com","dba-team@company.com"]' \
    uploadTimeoutDays=3 \
    alertSeverity="Critical" \
    evaluationFrequency="Daily"
```

## Advanced Scenarios

### Multi-Subscription Monitoring

Since the solution uses Azure Resource Graph via the `arg()` function, you don't need to deploy the template to each subscription. Instead, deploy once and grant the managed identities Reader access to all subscriptions:
```powershell
# Deploy the solution once
$deploymentSubscription = "primary-subscription-id"
Set-AzContext -SubscriptionId $deploymentSubscription
# Deploy template as shown above

# Then grant Reader access to both managed identities for all subscriptions
$uploadAlert = Get-AzScheduledQueryRule -Name "Arc-SQL-Server-Upload-Health-Monitor" -ResourceGroupName "rg-arc-monitoring"
$provisioningAlert = Get-AzScheduledQueryRule -Name "Arc-SQL-Extension-Provisioning-Failures" -ResourceGroupName "rg-arc-monitoring"

$uploadPrincipalId = $uploadAlert.Identity.PrincipalId
$provisioningPrincipalId = $provisioningAlert.Identity.PrincipalId

$allSubscriptions = @("sub1-id", "sub2-id", "sub3-id")
foreach ($subId in $allSubscriptions) {
    New-AzRoleAssignment -ObjectId $uploadPrincipalId -RoleDefinitionName "Reader" -Scope "/subscriptions/$subId"
    New-AzRoleAssignment -ObjectId $provisioningPrincipalId -RoleDefinitionName "Reader" -Scope "/subscriptions/$subId"
}
```

This single deployment will monitor all Arc SQL Servers across all granted subscriptions.

### Integration with Azure Logic Apps

Extend the solution with Logic Apps for advanced automation:
1. Create Logic Apps triggered by either alert
2. Query failing servers and gather additional diagnostics
3. Create ServiceNow tickets automatically
4. Attempt automated remediation for common issues
5. Send notifications to Microsoft Teams or Slack

## Conclusion

This enhanced ARM template solution provides comprehensive monitoring for Azure Arc SQL Server health, covering both data upload issues and provisioning failures. By proactively detecting both types of problems, you can maintain full visibility across your hybrid SQL Server estate and quickly respond to issues before they impact your operations.

The solution acts as a daily health report, using Azure Monitor's alerting mechanism as a cost-effective reporting tool. You get precise information about which servers need attention, eliminating the guesswork from troubleshooting.

## Next Steps

1. **Deploy the template** in your test environment
2. **Adjust the timeout** based on your upload patterns
3. **Grant cross-subscription access** if needed
4. **Monitor both alerts** to establish baselines
5. **Share your experience** - I'd love to hear how this works in your environment!

The complete template and documentation are available in my [GitHub Gist](https://gist.github.com/emrgcl/2b6666262cf6fe5a2cc5696b2b516227). Feel free to fork it and customize it for your needs.

Have questions or suggestions? Leave a comment below or reach out on Twitter [@emrgcl](https://twitter.com/emrgcl).