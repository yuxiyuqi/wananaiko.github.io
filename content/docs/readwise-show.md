---
title: "关于 Thread 页面的制作分享"
date: 2023-06-16T23:47:51+08:00
author: "wananaiko"
tags:
  - hugo
draft: false
---

在逛 🐦 ( 小蓝鸟，你知道我在说什么 ) 时，经常会看到不错的 tweet 和 thread，除了默默的点赞，我更喜欢用第三方工具来收集这些内容，方便随时搜索查看内容。

最初，我使用的服务是 [Mem](https://mem.ai/) 和 [Readwise](https://readwise.io/)，通过 Raycast 的 Snippet “mem” 来触发快捷输入：`@memdotai mem it @readwise save thread`，这样就可以快速的把内容保存到上面 2 个平台中了。

因为 Notion 的生态更好一些，现在已经改为使用 [SavaToNotion]() 和 Readwise。

介于 Notion 的 API 我还没研究明白，目前只实现了使用 Readwise 的 API 来展示 🐦 上的有趣内容。期待有对 Notion API 的调用比较懂的大神指点一二。

我始终还是想基于 Notion来实现这个页面，Notion 更方便为内容设置标签。Readwise 虽然也可以设置，但是太麻烦了，实在是懒得操作了。

初略研究了一下 Readwise 的 API，发现有 [V2](https://readwise.io/api_deets) 和 [V3](https://readwise.io/reader_api) 两个版本，而 V3 多了 `summary`字段对内容的总结。V2是没有的，只有截断的内容，阅读体验不是很好。

因为开完发完 Thread 页面后，发现官方还没修复同步 🐦 的问题，暂时还没法更新Thread 页面的内容，等官方修复后再更新。

简单分享一下实现的过程，其实也是很简单的……

#### 1、申请 Readwise API

[Access Token | Readwise](https://readwise.io/access_token)

#### 2、新建单页模板文件

themes/your_theme/layouts/_default/readwise.html

#### 3、代码实现

```html
{{ define "main" }}
<style>
  .main.post {
    position: relative !important;
    min-height: calc(
      100vh - var(--header-height) - var(--footer-height)
    ) !important;
    max-width: calc(var(--main-width) + var(--gap) * 2) !important;
    margin-top: 5rem;
  }

  .readwise-container {
    width: 100%;
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding: 1rem 0.5rem;
  }

  .readwise {
    border-top: var(--border-top);
  }

  .readwise:hover {
    --bookmark-list-opacity: 1;
    background-color: rgb(250 250 250 / var(--bookmark-list-opacity));
    border-radius: var(--radius);
    border-top: 0.5px solid var(--code-bg);
  }

  .dark .readwise:hover {
    --bookmark-list-opacity: 0.1;
    background-color: rgb(0 0 0 / var(--bookmark-list-opacity));
  }

  .readwise:hover + .readwise {
    border-top: 0.5px solid var(--code-bg);
  }

  .readwise-content {
    flex-grow: 1;
  }

  .readwise-avatar {
  }

  .readwise-avatar img {
    max-width: unset;
    min-width: unset;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-top: 4px;
  }
  .readwise-head {
    display: flex;
    align-items: center;
  }

  .readwise-author {
    font-size: 15px;
    line-height: 22px;
    font-weight: 500;
    color: var(--primary);
  }

  .readwise-time {
    font-size: 12px;
    color: var(--secondary);
    visibility: hidden;
    margin-left: 4px;
    line-height: 18px;
  }
  
  .dark .readwise-time {
    color: var(--signature-bg);
  }

  .readwise-summary {
    font-size: 14px;
    color: var(--primary);
    line-height: 22px;
  }

  .dark .readwise-summary {
    color: var(--secondary);
  }

  span.dot {
    color: var(--secondary);
    margin-left: 4px;
    line-height: 22px;
  }
  
  @media (max-width: 767px) {
    .readwise-container {
      width: 100%;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 1rem 0.5rem;
    }
    .readwise-author {
      font-size: 14px;
    }
  }
</style>

<header class="page-header">
  <h1>{{ .Title }}</h1>
  {{- if .Description }}
  <div class="post-description">{{ .Description }}</div>
  {{- end }}
</header>

{{ $url := "https://readwise.io/api/v3/list/" }} {{ $token :=
"这里替换为你的token" }} {{ $headers := dict
"Authorization" (printf "Token %s" $token) }} {{ $response := getJSON $url
$headers }} {{ $books := $response.results }}

{{ range $books }}

<div class="readwise">
  <a href="{{ .source_url }}" target="_blank" rel="noopener noreferrer">
    <div class="readwise-container">
      <div class="readwise-avatar">
        <img src="{{.image_url}}" alt="" srcset="" />
      </div>
      <div class="readwise-content">
        <div class="readwise-head">
          <div class="readwise-author">{{.author}}</div>
          <span class="dot">·</span>
          <div class="readwise-time">{{.created_at}}</div>
        </div>
        <div class="readwise-summary">{{.summary}}</div>
      </div>
    </div>
  </a>
</div>

{{ end}}

<script type="text/javascript" src="/assets/moment.min.js?v=2.29.4"></script>
<script type="text/javascript" src="/assets/moment.twitter.min.js"></script>

<script>
  // 检测当.source_url没有值时，隐藏整个div.
  var source_url = document.querySelector(".source_url");
  if (source_url == null) {
    document.querySelector(".readwise-container").style.display = "none";
  }
  // 使用 moment 来解析并格式化时间
  window.onload = function () {
    var readwiseTimes = document.querySelectorAll(".readwise-time");
    readwiseTimes.forEach(function (timeElement) {
      var time = timeElement.textContent;
      var formattedTime = moment(time, "YYYY-MM-DDTHH:mm:ss.SSSSZ").twitter();
      timeElement.textContent = formattedTime;
      timeElement.style.visibility = "visible";
    });
  };

  //隐藏页面上第一个div class="readwise"的整体div.
  var readwise = document.querySelector(".readwise");
  readwise.style.display = "none";
</script>

{{end}}

```

注意将上面代码中的`moment.min.js` 和 `moment.twitter.min.js` 保存到你自己的网站目录中并调用。

#### 4、新建md文件

在根目录下的 content 文件夹中新建md文件并调用。

```markdown
---
title: "Thread"
layout: "readwise"
description: 展示 🐦 上不错的 🧵 ,等 Reawise 同步问题修复后，这里会自动更新。
---
```

<mark>到此结束，颜色样式需要你结合自己的主题作调整，应该不难。</mark>

本站文章归档页暂时先隐藏了，文章太少，暂时没什么展示的价值。另外，菜单栏页面越来越多，要开始考虑下拉菜单了……

