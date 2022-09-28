---
layout: post
title:  "Jekyll QuickStart"
date:   2022-09-22 12:05:42 +0300
categories: "Dev Tools"
---

Build site with live preivew (no refresh needed!)
```
bundle exec jekyll serve --drafts --livereload
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
