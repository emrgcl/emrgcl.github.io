---
layout: post
title: "Update Node.js to use Fetch Api for JavaScript"
date: 2022-10-08 09:05:42 +0300
categories: Frontend
---

> I was studying **ReactJS** for a project to help **Azure** users in managing **resource tags**. I needed to work on [sample JavaScripts](https://github.com/emrgcl/JavaScriptSamples) to basically manage arrays, work with fetch api and so on. I prefer running `node scriptname.js` instead of starting a live server and viewing on the browser but noticed that the fetch api is not avaiable in node lts version but on the current (latest) version. Now I need to update! Lets see how easy it is on Windows!. Hmmm probably 30 minutes reading and installation time in total!

<!--more-->

## The problem

- try to run the following basic fetch request `node FetchSample.js`.

```JavaScript
fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => response.json())
  .then((json) => console.log(json));
```

- You will recieve the following error:

  `ReferenceError: fetch is not defined`

As mentioned earlier int he post fetch api is not supported by node in the LTS branch but in the Latest one.

Note: If you are using browser you dont need to update node.

# Update Node using NVM

The easiest way is to use a tool named nvm (Node Version Manager) and we need to install it first.

To install nvm I will use Winget, it is bundled into Windows 11 For more information about please visit [Use the winget tool to install and manage applications](https://learn.microsoft.com/en-us/windows/package-manager/winget/)

> Note: The winget command line tool is only supported on **_Windows 10 1709 (build 16299)_** or later at this time.

- Open a Powershell Terminal (I recommend Windows Terminal!)
- Search the package in winget `winget search nvm`

  ![WingetSearch]({{ site.url }}/assets/images/22-10-08-Update-Node-To-Use-Fetch-Api/Winget_Search.jpg)

- Installion is easy `Winget install 'NVM for windows'`, once the download finishes the follow the install wizard that pops up, you are good to go.
- Lets see our nvm version `nvm v` . In my case it was 1.1.9.
- Lets see our Node version! thats the whole point for this blog, to update it! Sooo run `nvm list`
  ![currentversion]({{ site.url }}/assets/images/22-10-08-Update-Node-To-Use-Fetch-Api/NVM_Current_Version.jpg)
- Lets see what are the available versions to install. `nvm list available`
  ![availableversion]({{ site.url }}/assets/images/22-10-08-Update-Node-To-Use-Fetch-Api/NVM_Available_Versions.jpg)
- Note the version we need. In this case **18.10.0**
- Lets update Node! To install latest you can use `nvm install latest` or for specific version `nvm install 18.10.0`. I am the fan of the latest : )
  ![intalllatest]({{ site.url }}/assets/images/22-10-08-Update-Node-To-Use-Fetch-Api/nvm_install_latest.jpg)
- Not finished yet, but we are close! Now we have two installations of Node. Do an `nvm list` you should see more than one and please note you installed the latest but not using it yet.
  ![list]({{ site.url }}/assets/images/22-10-08-Update-Node-To-Use-Fetch-Api/NVM_list.jpg)
- `nvm use 18.10.0` to set the version to the latest! You are done!
  ![useversion]({{ site.url }}/assets/images/22-10-08-Update-Node-To-Use-Fetch-Api/nvm_use.jpg)
- lets run the script now! `node FetchSample.js`

  ![finally]({{ site.url }}/assets/images/22-10-08-Update-Node-To-Use-Fetch-Api/use-fetch-with-node.jpg)

All set happy noding!...
