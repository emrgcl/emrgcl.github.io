---
layout: post
title: "Mac Terminal Setup Guide"
date: 2026-03-07
categories: [macOS, Terminal, DevOps]
tags: [ghostty, homebrew, zsh, starship, neovim, cli, fzf, terminal]
summary: "A quick reference for setting up a modern, fast terminal on macOS with Ghostty, Starship prompt, and essential CLI tools like eza, bat, ripgrep, and more."
---

> Setting up a fresh macOS terminal doesn't have to be painful. In this guide, I walk through my go-to setup — Ghostty as the terminal emulator, Starship for a clean prompt, and a curated set of modern CLI tools like eza, bat, ripgrep, and zoxide that replace the defaults with something faster and more enjoyable. Whether you're starting from scratch or refining your workflow, this is a quick reference to get up and running.

<!--more-->

## 1. Install Ghostty (Terminal Emulator)

Download from [ghostty.org](https://ghostty.org) or:

```bash
brew install --cask ghostty
```

Config lives at `~/.config/ghostty/config`. Example:

```
font-family = JetBrainsMono Nerd Font
font-size = 14
theme = catppuccin-mocha
window-padding-x = 10
window-padding-y = 10
```

You'll need a Nerd Font for icons — install one with:

```bash
brew install --cask font-jetbrains-mono-nerd-font
```

---

## 2. Install Homebrew (if you don't have it)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then add to `~/.zprofile`:

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
```

---

## 3. Install CLI Tools

All at once:

```bash
brew install eza bat fd ripgrep zoxide fzf neovim lazygit btop starship zsh-autosuggestions zsh-syntax-highlighting
```

| Tool | Replaces | What it does |
|------|----------|-------------|
| `eza` | `ls` | Better file listing with icons & colors |
| `bat` | `cat` | Syntax-highlighted file viewer |
| `fd` | `find` | Faster, simpler file finder |
| `ripgrep` (`rg`) | `grep` | Blazing fast search |
| `zoxide` | `cd` | Smart directory jumper (learns your habits) |
| `fzf` | — | Fuzzy finder for everything |
| `neovim` | `vim` | Modern vim |
| `lazygit` | — | Terminal UI for git |
| `btop` | `top`/`htop` | Beautiful system monitor |
| `starship` | shell theme | Fast, customizable prompt |
| `zsh-autosuggestions` | — | History-based command suggestions as you type |
| `zsh-syntax-highlighting` | — | Colors valid/invalid commands in real-time |

---

## 4. Configure ~/.zshrc

Replace your `~/.zshrc` with:

```bash
# ── Aliases ──
alias n='nvim'
alias ll='eza -la --icons'
alias ls='eza --icons'
alias cat='bat'
alias find='fd'
alias grep='rg'
alias lg='lazygit'
alias top='btop'

# ── Zoxide (smart cd) ──
eval "$(zoxide init zsh)"
alias cd='z'

# ── fzf ──
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
alias ff='fzf --preview "bat --color=always {}"'

# ── Autosuggestions & Syntax Highlighting ──
source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source $(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# ── Prompt (Starship) ──
eval "$(starship init zsh)"
```

---

## 5. Configure Starship Prompt

Create `~/.config/starship.toml`. A minimal starting point:

```toml
[character]
success_symbol = "[➜](bold green)"
error_symbol = "[➜](bold red)"

[directory]
truncation_length = 3

[git_branch]
symbol = " "
```

Full options: [starship.rs/config](https://starship.rs/config/)

---

## 6. Open a New Terminal

Close and reopen Ghostty. You should now have autosuggestions (gray text as you type), syntax highlighting (green/red commands), and the Starship prompt.

---

## Cheat Sheet

| Shortcut | What it does |
|----------|-------------|
| `ll` | List files with details & icons |
| `cat file.txt` | View file with syntax highlighting |
| `cd projects` | Smart jump (learns frequent dirs) |
| `ff` | Fuzzy find files with preview |
| `lg` | Open lazygit |
| `n file.txt` | Open in neovim |
| `top` | System monitor |
| Right arrow | Accept autosuggestion |
