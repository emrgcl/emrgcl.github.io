---
layout: post
title:  "Azure Monitor Agent and VM Insights: Deployment and Configuration Best Practices"
date:   2022-09-26 09:05:42 +0300
categories: Azure
---
> 
# Overview

At the very current moment we have two agents for Azure Monitor
- **Azure Monitor Agent (AMA):** The new agent, actually an extension to VM or Arc For Servers which consolidates Telgraph for Linux, Diognostic Extension for Log Analytics Agent
- **Log Analytics Agent (MMA):** This agent is the old experience and many of the customers have this agent already deployed also using this agent as a SCOM Agent meaning sending data to both Azure Monitor and on-prem SCOM. This agent will be retired as of 31 August 2024.
 [Click here for more info.](https://azure.microsoft.com/en-us/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/)


# The reasons for a new Agent
