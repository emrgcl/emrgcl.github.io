---
layout: post
title: "Pushing Your First File Using Git"
date: 2023-04-29
categories: [DevOps, Git, Series]
---

> In this tutorial, we will go through the process of pushing your first file to a remote Git repository step by step, showing the `git status` output and explaining it between each step.

<!--more-->

## Step 1: Create a new file

First, navigate to your local Git repository using the terminal. Then, create a new file called `example.txt`.

{% highlight bash %}
touch example.txt
{% endhighlight %}

## Step 2: Check Git status

Run the `git status` command to see the current status of your repository.

{% highlight bash %}
git status
{% endhighlight %}

{% highlight text %}
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
(use "git add <file>..." to include in what will be committed)

        example.txt

nothing added to commit but untracked files present (use "git add" to track)
{% endhighlight %}

The output shows that there's an untracked file (example.txt) in your repository. Untracked files are new files that Git hasn't started tracking yet.

## Step 3: Add the file to the staging area

Add the new file to the staging area using the `git add` command.

{% highlight bash %}
git add example.txt
{% endhighlight %}

## Step 4: Check Git status again

{% highlight bash %}
git status
{% endhighlight %}

{% highlight text %}
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
(use "git restore --staged <file>..." to unstage)

        new file:   example.txt

{% endhighlight %}

The output shows that the new file (example.txt) is now in the staging area and ready to be committed. The staging area is where you can organize changes you want to include in your next commit.

## Step 5: Commit the changes

Commit the changes with a descriptive message using the `git commit` command.

{% highlight bash %}
git commit -m "Add example.txt"
{% endhighlight %}

## Step 6: Check Git status again

{% highlight bash %}
git status
{% endhighlight %}

{% highlight text %}
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
(use "git push" to publish your local commits)

nothing to commit, working tree clean
{% endhighlight %}

The output shows that your local branch (main) is ahead of the remote branch (origin/main) by one commit. This means you have successfully committed the changes, and your working tree is clean.

## Step 7: Push the changes

Push the committed changes to the remote repository using the `git push` command.

{% highlight bash %}
git push
{% endhighlight %}

## Step 8: Check Git status one more time

{% highlight bash %}
git status
{% endhighlight %}

{% highlight text %}
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
{% endhighlight %}

The output shows that your branch is up to date with the remote branch, indicating that you have successfully pushed the changes.

Congratulations! You've successfully pushed your first file to a remote Git repository. Keep practicing to get more comfortable with Git
