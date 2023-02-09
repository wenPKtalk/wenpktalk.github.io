---
title: 团队如何用好git
date: 2023-02-09 09:25:38
tags: Git
categories: Git
---

1. 常用团队规范，包含Git 使用原则、分支设计、单线分支原则、开发规范
   https://blog.meathill.com/git/git-1-team-sop.html

2. 常见问题解决，包含处理 hotfix、git rebase dev -i、git reset –hard COMMIT
   https://blog.meathill.com/git/2023-git-2-faq.html

3. Git推荐配置与小技巧，包含
   https://blog.meathill.com/git/2023-git-3-tips.html

4. Mac用户使用Item2+zsh中的主题自带了Git的常见alias，可以使用 alias |grep git进行查看：

   常用的有：

   ```sh
   gup = git  pull --rebase
   gp = git push
   gl = git pull
   gcam = git commit -a -m
   gca! = git commit -v -a --amend
   ```

   
