---
layout: post
title:  "Jekyll QuickStart"
date:   2022-09-22 12:05:42 +0300
categories: "Dev Tools"
---


## Installing Jekyll
I assume you are running windows for your dev enironment and this guide covers installation for Windows.

Jekyll is a gem for Ruby (A gem is a pacakge in ruby). All we need to do is install and configure ruby, add the Jekkyl gem:

- Install Ruby on Windows (use one of the below options): 
    - You can download Ruby installer and run manually. [Download here](https://rubyinstaller.org/downloads/)
    - Use [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) - *Winget is built in to Windows 11. I recommend to upgrade to Windows 11 for development environment* To install Ruby using Winget: 
    `winget install RubyInstallerTeam.Ruby`
- run `gem install jekyll bundler`
- Install the Jekyll package `gem install jekyll bundler`
- Verify the installation by `jekyll -v`

## Run your site
Build site with live preivew (no refresh needed!)
```
bundle exec jekyll serve --drafts
```
## Draft Posts
You can draft your posts by putting your posts under ```_drafts``` folder without the date. They  will not be compiled in your _sites and wont be visible to visitorsç

Have fun with your drafts, Wanna see your draft posts and preview?
```
bundle exec jekyll serve --drafts --livereload
```

## Syntax Highligting
You can use either the liquid way or the markdown way...
{% raw %}
```liquid
{% highlight powershell %}
Get-Command -Name Get-service -Syntax
if ($Name -eq 'sth') {
  do-this
}
{% endhighlight %}
```

```powershell
Get-Command -Name Get-service -Syntax
if ($Name -eq 'sth') {
  do-this
}
```
{% endraw %}


## using jeykl raw Tag
