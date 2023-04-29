---
layout: post
title: "Initial Git Configuration on Windows"
categories: [DevOps, Git, Series, Windows]
date: 2023-04-29
---

> This post provides a step-by-step guide to setting up Git on a Windows machine, covering installation, user information configuration, default text editor selection, line ending adjustments, Git credentials storage, and proxy settings for secure connections. Learn how to properly configure your Git environment and streamline your development workflow on Windows.

<!--more-->

## 1. Install Git for Windows

Before you can configure Git, you'll need to have it installed on your computer. Download the installer from the [official Git website](https://git-scm.com/download/win) and follow the installation steps.

## 2. Set up your user information

Once Git is installed, open the Git Bash terminal and configure your user information. This information will be associated with your commits. Replace `<your_name>` and `<your_email>` with your actual name and email address.

{% highlight sh %}
git config --global user.name "<your_name>"
git config --global user.email "<your_email>"
{% endhighlight %}

## 3. Choose your default text editor

Git uses a text editor for tasks like commit message editing and conflict resolution. By default, Git uses the system's default editor (usually Vim). If you prefer a different editor, you can configure Git to use it. Replace `<editor>` with the command to start your preferred text editor.

{% highlight sh %}
git config --global core.editor "<editor>"
{% endhighlight %}

For example, to use Notepad++ as your default editor, you would run:

{% highlight sh %}
git config --global core.editor "'C:\Program Files\Notepad++\notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
{% endhighlight %}

## 4. Set up line endings

Windows and Unix-based systems use different line endings, which can cause issues when collaborating with others. It's recommended to configure Git to handle line endings automatically.

{% highlight sh %}
git config --global core.autocrlf true
{% endhighlight %}

This setting will convert LF line endings to CRLF when checking out files and convert them back to LF when committing. This ensures that your repository always has consistent line endings.

## 5. Enable Git credentials storage

To avoid typing your username and password every time you interact with a remote repository, you can configure Git to use a credential helper. The following command sets the credential helper to the Windows Credential Manager:

{% highlight sh %}
git config --global credential.helper wincred
{% endhighlight %}

Now, the next time you interact with a remote repository, Git will store your credentials in the Windows Credential Manager.

## 6. Configure proxy settings

If you need to access Git repositories through a proxy server, you can configure Git to use the proxy. Replace `<proxy_url>` and `<proxy_port>` with your proxy server's URL and port number, respectively.

Without authentication:

{% highlight sh %}
git config --global http.proxy http://<proxy_url>:<proxy_port>
git config --global https.proxy https://<proxy_url>:<proxy_port>
{% endhighlight %}

With authentication:

Replace `<username>` and `<password>` with your proxy server's username and password, respectively.

{% highlight sh %}
git config --global http.proxy http://<username>:<password>@<proxy_url>:<proxy_port>
git config --global https.proxy https://<username>:<password>@<proxy_url>:<proxy_port>
{% endhighlight %}

To remove the proxy settings, run the following commands:

{% highlight sh %}
git config --global --unset http.proxy
git config --global --unset https.proxy
{% endhighlight %}
