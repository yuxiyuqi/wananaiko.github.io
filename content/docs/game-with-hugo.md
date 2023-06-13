---
title: "Hugo 和 PaperModX 的折腾记录"
date: 2023-05-21T21:06:57+08:00
author: "wananaiko"
tags:
  - Hugo
draft: false
---

最近又折腾了一下博客，起因是上周和 [空白生活](https://koobai.com/) 要了他的好物页面源码，后来研究了一番，发现用 shortcode
来实现一个页面真的太方便了。这里，再次表达一下感谢。

于是一顿操作，增加了 Gallery，Goods，Stack，Bookmark 页面，都是基于 Hugo shortcode 开发的。CSS样式也比较简单，基本都写在了
shortcode 页面中。

还修改了 PaperModX 主题自带的一些样式，比如切换暗黑/日间模式时的微弱动态效果，顶部菜单的模糊和固定，全站页面滑动进入的效果，代码高亮颜色等等。

Gallery 的实现方法来自文章 [《基于memos实现动态相册》](https://blog.leonus.cn/2023/photos.html)，和当前站点中的 Memos
页面一样，都是基于开源程序 usememos[^1] 实现的，发布更新内容非常方便，小程序和 App 都有。

Bookmark 页面基于 Raindrop.io 官方的 API[^2]，调用了最近收藏的书签，并且增了标签筛选，方便查看对应的内容。书签图标使用了
unavatar.io [^3]的免费服务。目前只加载最新的50条书签，加载更多没写…

目前这个版本基本上已经可以养老了 😅 后面有时间再继续折腾。

### Timeline

这不隔天我又写了一个 timeline 的 shortcode，来记录折腾的记录…以后也可以用在别的地方…
内容发布格式：

```
{/{< timeline time="2022-05-22" title="修改顶部菜单栏为像素风格，增加timeline 短代码" tags="美化,shortcode" >}/}
调整了顶部菜单栏的样式，增加了像素模糊效果，灵感来自 Framer Motion 介绍页面。调整了顶部菜单栏的样式，增加了像素模糊效果，灵感来自 Framer Motion 介绍页面。
{/{< /timeline >}/}
{/{< timeline time="2022-05-21" title="Gally, Goods, Stacks, Bookmark 页面上线" >}/}
基于 shortcode 实现的页面，初步上线。
{/{< /timeline >}/}
```

{{< timeline time="2022-06-14" title="修改了主页、文章页、顶部菜单栏样式" tags="样式更新" >}}
去掉了一些多余的元素，布局上作了较多的调整。
{{< /timeline >}}
{{< timeline time="2022-06-05" title="调整了 Todolist 的 light 和 dark 样式" tags="样式更新" >}}
配色灵感来自 waffle。
{{< /timeline >}}
{{< timeline time="2022-05-24" title="链接下划线样式调整，Bookmark 页面增加了很赞标识" tags="样式更新" >}}
优化了链接的可读性，取消了原来 hover 时的主题色。Bookmark 页面给“最喜欢的”书签增加了很赞标识。
{{< /timeline >}}
{{< timeline time="2022-05-23" title="增加 todolist 短代码" tags="shortcode" >}}
使用 timeline 来简单记录本站的折腾的过程。
{{< /timeline >}}
{{< timeline time="2022-05-22" title="增加 timeline 短代码" tags="shortcode" >}}
使用 timeline 来简单记录本站的折腾的过程。
{{< /timeline >}}
{{< timeline time="2022-05-21" title="Gallery, Goods, Stacks, Bookmark 页面上线" >}}
基于 shortcode 实现的页面，初步上线。
{{< /timeline >}}

### Todolist 清单

根据 [《基于Memos实现说说和清单功能》](https://blog.leonus.cn/2023/memeos.html) 这篇文章完成了清单功能，简单修改了一下样式。

{{< todolist >}}

&nbsp;

[^1]: usememos 官方介绍：https://github.com/usememos/memos
[^2]: Raindrop API 官方文档：https://developer.raindrop.io/
[^3]: Unavatar.io 官方介绍：https://unavatar.io/
