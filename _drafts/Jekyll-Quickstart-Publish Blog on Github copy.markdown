---
layout: post
title:  "Jekyll QuickStart -3- Publish Blog on Github"
date:   2022-09-22 10:05:42 +0300
categories: "Dev Tools"
---
> Lets publish our Jekyll blog to Github! You can even add your custom domain...

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
- to run the site run again `bundle exec jekyll serve`
  - in my case I had the following error. The soluıtion is to to add the Webrick dependency in your gem file.

    ``
    C:/Ruby31-x64/lib/ruby/gems/3.1.0/gems/jekyll-4.2.2/lib/jekyll/commands/serve/servlet.rb:3:in `require': cannot load such file -- webrick (LoadError)
    ``

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
- Hapy Jekylling :) Browse to http://127.0.0.1:4000/ and Enjoy!
