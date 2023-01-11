---
title: "Hugo 和 PaperModX 的一些配置记录"
date: 2023-01-09T00:24:18+08:00
author: ["wananaiko"]
tags:
  - hugo
  - waline
  - PaperModX
---

### 增加空格之神

使用空格之神的浏览器插件很久了，真的是阅读强迫症患者的福音，[空格之神项目地址](https://github.com/vinta/pangu.js)

在 Hugo的 /layouts/_default/baseof.html 内增加以下代码：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pangu/4.0.7/pangu.min.js"></script>
<script>
  pangu.spacingPage();
</script>
```

用完后感觉整个世界都清爽了 🤣

---

### 增加 Waline 评论

依照官网的教程，[部署到 Vercel上](https://waline.js.org/guide/deploy/vercel.html)，适配了 Hugo 的暗黑模式。

最新的配置文件在：[UNPKG - @waline/client](https://unpkg.com/browse/@waline/client@2.14.6/dist/)

在 `themes/your-hugo-theme/layouts/partials/comments.html` 里添加以下代码：

```html
<head>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/@waline/client@2.14.6/dist/waline.css">
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/@waline/client@2.14.6/dist/waline-meta.css">
  </head>
  <body>
    <!-- ... -->
    <div id="waline"></div>
    <script type="module">
      import { init } from 'https://unpkg.com/@waline/client@v2.14.6/dist/waline.mjs';
  
      init({
        el: '#waline',
        lang: 'zh-CN',
        reaction: true, // 开启反应
        serverURL: 'https://chat.wananaiko.design',
        dark: 'body.dark',
        copyright: false,
        
      // 设置 emoji 为贴吧与哔哩哔哩
      emoji: [
        '//cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/tieba',
        '//cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/bilibili',
      ],
      });
    </script>
  </body>
```

另外，在 `config.toml` 中的 params 下设置 `comments = true`

---

### 增加鼠标彩虹效果

没有什么意义的效果，纯属好玩，不代表 LGBT。

在 Hugo 的 /layouts/_default/baseof.html 内增加以下代码：

```html
<!-- 增加鼠标滑动时的彩虹效果 -->
<script async src="/memos/assets/js/browser.js"></script>
<script>window.addEventListener('load',(event)=>{new cursoreffects.rainbowCursor();});</script>
```

---

### 增加友情链接页面

打开 `/themes/PaperModX/layouts/blogroll/section.html`，修改为以下代码：

```html
{{/* section is AKA list */}}

{{- define "main" }}
<header class="page-header">
  <h1>{{ .Title }}</h1>
</header>

<article class="links-container">
  <blockquote>
    <p>{{ .Description }}</p>
  </blockquote>

  <div class="links">
    {{ range .Site.Data.blogroll }}
    {{ range sort . "weight" }}
    <div class="item">
        <div class="title">
          {{- $url := urls.Parse .url }}
          <span class="favicon" style="background-image: url({{ .favicon | default (printf "%s/favicon.ico" .url ) }});"></span
            ><a href="{{ .url }}" target="_blank">{{ .name }}</a>
        </div>
        <div class="description">
          {{- .domain | default $url.Host }}
          {{- with .description }}<span class="delimiter"></span>{{ . }}{{- end }}
        </div>
      </div>
    {{ end }}
{{ end }}
  </div>
</article>

{{- end }}
```

在博客根目录或者themes目录下的`data文件夹下`新建 `blogroll.toml` 文件，然后在该文件中添加友链的各项基本信息，比如：

```toml
[[blogroll]]
  name = "wananaiko"
  url = "https://wananaiko.com"
  favicon = "https://images.wananaiko.com/2023/01/Ug1QAR.png"
  description = "Design loser,slack off champion."
  weight = 1

[[blogroll]]
  name = "wananaiko"
  url = "https://wananaiko.com"
  favicon = "https://images.wananaiko.com/2023/01/Ug1QAR.png"
  description = "Design loser,slack off champion."
  weight = 2
```

其中，`weight` 表示该友链的权重，用来排序。然后当然是需要新建一个友链页面，运行命令 `hugo new links/_index.md`。修改 `_index.md` 中的代码为：

```markdown
---
title: Blog Roll
description: Links to the other blogs I recommend.
layout: "blogroll"
type: 'blogroll'
---
```

接着运行 `Hugo server -D` 检查友链是否显示出来。

---

### 增加页面下雪效果

可为雪花自定义配置：[Falling snowflakes](https://hcodes.github.io/demo-snowflakes/)，修改 `/themes/PaperModX/layouts/_default/baseof.html`，加入以下代码：

```html
<!-- 增加页面下雪效果 -->
<script src="https://unpkg.com/magic-snowflakes/dist/snowflakes.min.js"></script>
<script>
  var sf = new Snowflakes({
    color: "#cccccc",
    count: 30,
    speed: 0.8
  })
</script>
```

---

### 搜索页展示标签列表

编辑搜索页面模板 `./layouts/_default/search.html`，修改代码为：

```html
{{- define "main" }}

<header class="page-header">
    <h1>{{- (printf "%s&nbsp;" .Title ) | htmlUnescape -}}
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    </h1>
    {{- if .Description }}
    <div class="post-description">
        {{ .Description }}
    </div>
    {{- end }}
    {{- if not (.Param "hideMeta") }}
    <div class="post-meta">
        
    </div>
    {{- end }}
</header>

<div id="searchbox">
    <input id="searchInput" autofocus placeholder="{{ .Params.placeholder | default (printf "%s ↵" .Title) }}"
        aria-label="search" type="search" autocomplete="off">
    <ul id="searchResults" aria-label="search results"></ul>
</div>

{{- if not (.Param "hideTags") }}
{{- $taxonomies := .Site.Taxonomies.tags }}
{{- if gt (len $taxonomies) 0 }}
<h2 style="margin-top: 32px">{{- (.Param "tagsTitle") | default "tags" }}</h2>
<ul class="terms-tags">
    {{- range $name, $value := $taxonomies }}
    {{- $count := .Count }}
    {{- with site.GetPage (printf "/tags/%s" $name) }}
    <li>
        <a href="{{ .Permalink }}">{{ .Name }} <sup><strong><sup>{{ $count }}</sup></strong></sup> </a>
    </li>
    {{- end }}
    {{- end }}
</ul>
{{- end }}
{{- end }}

{{- end }}{{/* end main */}}
```

