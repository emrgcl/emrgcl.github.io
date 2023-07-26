---
layout: post
title: "Anonymize Your Git Commits: How to Override Author's Email with GIT_COMMITTER_EMAIL"
date: 2023-07-26
categories: Git, Tutorial
---

> In Git, the name and email address associated with each commit are recorded. This information can be set globally or on a per-project basis. However, there might be situations where you want to override this information for a single commit or a series of commits. This can be done using the `GIT_COMMITTER_EMAIL` environment variable.

<!--more-->

The `GIT_COMMITTER_EMAIL` environment variable allows you to change the email address of the committer. In Git, the committer is the person who last applied the changes, and may not necessarily be the author of the changes.

To override the committer's email for a single commit, you can use this command:

{% highlight bash %}
GIT_COMMITTER_EMAIL="newemail@example.com" git commit -m "Your commit message"
{% endhighlight %}

In this example, "newemail@example.com" is the email you want to use for the current commit. This command will only affect the current commit.

If you want to use a specific email for all commits in a certain repository, you can set the `user.email` configuration at the repository level:

{% highlight bash %}
git config user.email "newemail@example.com"
{% endhighlight %}

This command will set the `user.email` configuration for the current repository only, and it will not affect other repositories on your system. All future commits in the current repository will use "newemail@example.com" as the committer's email, unless you change it again.

Remember, if you're contributing to open-source projects, it's a best practice to use a real and identifiable email address so that your collaborators can easily recognize your commits. However, for the sake of privacy, you might want to use a public email address, such as a no-reply email address provided by GitHub or other similar platforms.

As previously noted, remember to replace **"newemail@example.com"** and **"Your commit message"** with your actual placeholder email and commit message
