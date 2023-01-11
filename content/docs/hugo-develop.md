---
title: "Hugo 的一些配置记录"
date: 2023-01-09T00:24:18+08:00
author: "wananaiko"
tags:
  - hugo
  - waline
draft: false
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

### 使用 Waline 评论系统

依照官网的教程，[部署到 Vercel上](https://waline.js.org/guide/deploy/vercel.html)，适配了 Hugo 的暗黑模式。

---

### 增加鼠标滑动时的彩虹效果

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
  avatar = "https://images.wananaiko.com/2023/01/Ug1QAR.png"
  description = "Design loser,slack off champion."
  weight = 1

[[blogroll]]
  name = "wananaiko"
  url = "https://wananaiko.com"
  avatar = "https://images.wananaiko.com/2023/01/Ug1QAR.png"
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