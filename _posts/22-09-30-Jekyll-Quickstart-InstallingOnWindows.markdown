---
layout: post
title:  "Jekyll QuickStart -1- Installing on Windows"
date:   2022-09-30 09:05:42 +0300
categories: Tools Blogging Jekyll
---
> Lets install Jeykll on windows and start blogging! By the end of this blog you will have your Jeykll Site up and running on your Local Windows computer! Installing Jekyll is few easy steps that will not take more than 1 hour. Jump in! you might finish within 30 minutes as well : )

## What is Jekyll? Why do I need it?
Well.. 

## Highlevel Steps and Prerequisite

I highly recommend the followings already installed before starting this blog posts.
 - [Visual Studio Code](https://code.visualstudio.com/docs/?dv=win) : We will edit config files in this post. Why not to install VSCode we will already need an aweseome editor for editing our posts int he upcoming days!!
 - [Git for Windows](https://git-scm.com/download/win) : As of the end of blog we will start working on our code. If theres any code/text we should start using git! But we also will need the git binaries to push and sync with Github as well. Yes! in later posts we will host our Jekyll site at GitHub pages! 

High level steps:
- Installing Ruby
- Configuring Ruby
- Install Jekyll Gem
- Create your first site
- Add required gems to your site.

## Installing Jekyll
I assume you are running windows for your dev enironment and this guide covers installation for Windows.

Jekyll is a gem for Ruby (A gem is a pacakge in ruby). All we need to do is install and configure ruby, add the Jekkyl gem:

- Install Ruby With DevKit on Windows (use one of the below options): 
    - You can download Ruby installer and run manually. [Download here](https://rubyinstaller.org/downloads/)
    - Use [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) - *Winget is built in to Windows 11. I recommend to upgrade to Windows 11 for development environment* To install Ruby using Winget: 
    `winget install RubyInstallerTeam.Ruby`
  > **Note:** By Default Ruby is intalled in `C:/Ruby24-x64`
- Once you install ruby dont uncheck the gui and run each option in the msy installer.
  > **Note:** At this point `C:/Ruby24-x64` should be appended to Path environment varible. If you are on Windows Terminal, you need exit and restart Windos Terminal. If you dont see the environment varible updated simply add manually.
- Install the Jekyll package `gem install jekyll bundler`
- Verify the installation by `jekyll -v`
- Run `jekyll new myblog` . This will create a folder named `myblog` and install jekyll into `myblog` folder.
- Run `bundle exec jekyll serve` to start the site.
  - in my case I had the following error. The soluıtion is to to add the Webrick dependency in your gem file.

    ``
    C:/Ruby31-x64/lib/ruby/gems/3.1.0/gems/jekyll-4.2.2/lib/jekyll/commands/serve/servlet.rb:3:in `require': cannot load such file -- webrick (LoadError)
    ``
  - Terminate the process by `ctrl+c`

  - Add the following to your GemFile.
  
    ```
    gem "webrick", "~> 1.7"
    ```
  - if you added the webrick to gem file you will need to run `bundle install`
  - To run the site run again `bundle exec jekyll serve`
- As of now you will have the following output

  ```
  PS C:\temp\myblog>  bundle exec jekyll serve
  Configuration file: C:/temp/myblog/_config.yml
              Source: C:/temp/myblog
        Destination: C:/temp/myblog/_site
  Incremental build: disabled. Enable with --incremental
        Generating...
        Jekyll Feed: Generating feed for posts
                      done in 0.781 seconds.
  Auto-regeneration: enabled for 'C:/temp/myblog'
      Server address: http://127.0.0.1:4000/
    Server running... press ctrl-c to stop.
  [2022-09-28 13:45:24] ERROR `/favicon.ico' not found.
  ```
  >Note:  Dont worry about the icon error, the theme looks for by default. I never used it :)
- Hapy Jekylling :) Browse to http://127.0.0.1:4000/ and Enjoy!
