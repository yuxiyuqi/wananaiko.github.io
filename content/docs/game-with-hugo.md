---
title: "Hugo PaperModX 的折腾记录"
date: 2023-05-21T21:06:57+08:00
author: "wananaiko"
tags:
  - Hugo
draft: false
---

最近又折腾了一下博客，起因是上周和 [空白生活](https://koobai.com/) 要了他的 [好物](https://koobai.com/hardware/) 页面源码，后来研究了一番，发现用 shortcode 来实现一个页面真的太方便了。

于是一顿操作，增加了 Gallery，Goods，Stack，Bookmark 页面，都是基于 Hugo shortcode 开发的。CSS样式也比较简单，基本都写在了 shortcode 页面中。

还修改了 PaperModX 主题自带的一些样式，比如切换暗黑/日间模式时的微弱动态效果，顶部菜单的模糊和固定，全站页面滑动进入的效果，代码高亮颜色等等。

Gallery 的实现方法来自文章 [《基于memos实现动态相册》](https://blog.leonus.cn/2023/photos.html)，和当前站点中的 Memos 页面一样，都是基于开源程序 [usememos](https://github.com/usememos/memos) 实现的，发布更新内容非常方便，小程序和 App 都有。

Bookmark 页面基于 Raindrop.io 官方的 API，调用了最新收藏的书签，并且增了标签筛选，方便查看对应的内容。书签图标使用了 [unavatar.io](https://unavatar.io/) 的免费服务。目前只加载最新的50条书签，加载更多没写…

目前这个版本基本上已经可以养老了 😅 后面有时间再继续折腾。
