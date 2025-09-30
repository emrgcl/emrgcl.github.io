# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based blog/personal website hosted on GitHub Pages. The site focuses on technical content covering Azure, PowerShell, DevOps, AI, and various Microsoft technologies. The owner is a Principal Field Engineer at Microsoft with expertise in System Center, Azure Monitor, Infrastructure as Code, and related technologies.

## Common Development Commands

### Local Development
```bash
# Install dependencies
bundle install

# Serve the site locally with live reload
bundle exec jekyll serve

# Build the site
bundle exec jekyll build

# Clean generated files
bundle exec jekyll clean
```

### Content Management
```bash
# Create new blog post (manually create in _posts/ directory)
# Follow naming convention: YYYY-MM-DD-title.md or .markdown

# Preview drafts locally
bundle exec jekyll serve --drafts
```

## Site Architecture

### Directory Structure
- `_posts/`: Published blog posts (markdown files with YAML front matter)
- `_drafts/`: Draft posts not yet published
- `_layouts/`: HTML templates (default.html, post.html, home.html, page.html)
- `_includes/`: Reusable HTML components (header, footer, chat interface, etc.)
- `_sass/`: SCSS stylesheets with custom chat styles in `custom/` subdirectory
- `_data/`: JSON data files for dynamic content (chat.json, gpt.json)
- `assets/`: Static assets including images, JavaScript, and compiled CSS
- `_site/`: Generated static site (excluded from version control)

### Key Features
- **Blog Posts**: Technical articles with categories and tags
- **Chat Interface**: Custom chat-style component using Liquid templates and JSON data
- **Responsive Design**: Uses Minima theme with custom SCSS overrides
- **Comments**: Disqus integration for blog posts
- **Analytics**: Google Analytics integration
- **Social Integration**: GitHub and Twitter links

### Front Matter Standards
Blog posts use YAML front matter with these common fields:
```yaml
---
layout: post
title: "Post Title"
date: YYYY-MM-DD
categories: [Category1, Category2]
tags: [tag1, tag2, tag3]
summary: "Brief description for excerpts"
---
```

### Custom Components
- **Chat Interface**: Uses `_includes/chat.liquid` with styling from `_sass/custom/_chat.scss`
- **Copy-to-Clipboard**: JavaScript functionality for code blocks
- **Custom CSS**: Override theme defaults in `_sass/custom/` directory

## Development Notes

- Uses GitHub Pages compatible gems (see Gemfile)
- Content categories include: Azure, PowerShell, DevOps, Git, Terraform, Linux, AI/GPT-4
- Images stored in `assets/images/` with post-specific subdirectories
- Site uses Jekyll sitemap and feed plugins
- Custom excerpt separator: `<!--more-->`

## Content Guidelines

- Technical posts focus on practical solutions and tutorials
- Include code examples and step-by-step instructions
- Use categories and tags consistently for organization
- Add images to support technical explanations
- Follow the existing writing style and structure patterns