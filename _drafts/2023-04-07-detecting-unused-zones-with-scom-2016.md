---
layout: post
title:  "Detecting Unused Zones with System Center Operations Manager 2016"
date:   2023-04-07
categories: SCOM DNS Monitoring
---

> Welcome to our latest post on detecting unused zones with System Center Operations Manager (SCOM) 2016! Ensuring efficient use of DNS resources and maintaining a clean DNS environment are crucial for optimal network performance. Identifying and addressing unused DNS zones can help reduce the attack surface, simplify management, and improve the overall health of your DNS infrastructure.

In this post, we'll discuss the importance of monitoring unused zones and how Microsoft's DNS Management Pack for SCOM 2016 can help you detect them.

## The Importance of Detecting Unused Zones

Unused DNS zones can arise due to various reasons, such as decommissioned servers, outdated records, or human errors. These zones can potentially:

1. Consume system resources, leading to slower DNS performance.
2. Create confusion for administrators, making it harder to manage DNS effectively.
3. Increase the risk of cyber-attacks, as attackers may exploit unmonitored or outdated records.

Therefore, detecting and removing unused zones is essential for maintaining a healthy DNS environment.

## Monitoring Unused Zones with SCOM 2016 and the DNS Management Pack

The [Microsoft DNS Management Pack](https://www.microsoft.com/en-us/download/details.aspx?id=54524) for SCOM 2016 includes a built-in monitor for detecting unused zones. The monitor leverages a PowerShell script to collect DNS zone statistics, such as the number of queries received.

Here are some key PowerShell snippets from the script that emphasize how the monitoring process works:

```powershell
$zones += get-DnsServerZone -ComputerName $PrincipalName | Where {$_.ZoneType -eq "Primary" -or $_.ZoneType -eq "Secondary"}

foreach ($zone in $zones)
{
    $allStatistics = Get-DnsServerStatistics -ZoneName $zone.ZoneName -ComputerName $PrincipalName -ErrorAction Stop
    [double]$QueriesReceived = 0
    foreach ($zoneQueryStat in $zoneQueryStatistics)
    {
        $QueriesReceived += $zoneQueryStat.QueriesReceived
    }
}
