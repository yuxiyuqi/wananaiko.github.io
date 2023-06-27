---
title: "Hugo 和 PaperModX 的一些配置记录"
date: 2023-01-09T00:24:18+08:00
author: ["wananaiko"]
tags:
  - hugo
  - waline
  - PaperModX
ai: 这是一篇关于使用 Hugo 和 PaperModX 进行配置的文章，介绍了如何添加空格之神、增加 Waline 评论、添加鼠标彩虹效果和友情链接页面等功能的具体操作方法和代码。
---

### 增加空格之神

使用空格之神的浏览器插件很久了，真的是阅读强迫症患者的福音，[空格之神项目地址](https://github.com/vinta/pangu.js)

在 Hugo的 `themes/PaperModX/layouts/_default/baseof.html` 内增加以下代码：

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

在 `themes/PaperModX/layouts/partials/comments.html` 里添加以下代码：

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

在 Hugo 的 `themes/PaperModX/layouts/_default/baseof.html` 内增加以下代码：

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

编辑搜索页面模板 `themes/PaperModX/layouts/_default/search.html`，修改代码为：

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

---

### 引入豆瓣阅读和电影卡片

参考：[Hugo博客自定义shortcodes](https://www.sulvblog.cn/posts/blog/shortcodes/)，对部分CSS进行了调整以适配主题。

{{< douban src="https://movie.douban.com/subject/4811774/" >}}

引用方法：

```markdown
{a{< douban src="https://movie.douban.com/subject/4811774/" >}}
# 使用的时候把字母a去掉，我加上是为了防止被识别生效
```



定位到主题下的 `layouts/shortcodes` 目录，新建一个文件叫 `douban.html`，放入如下代码： 

```html
<!DOCTYPE HTML>
<html lang="en">
<head>
    <title></title>
    <style>
        .post-preview {
            max-width: 100%;
            height: 200px;
            margin: 1.5em auto;
            position: relative;
            display: flex;
            border-radius: var(--radius);
            border: 1px solid var(--border);
            background-color: #f6f8fa;
        }

        .dark .post-preview {
            /*background: #383838;*/
            background: var(--entry);
            box-shadow: 0 2px 4px rgba(0, 0, 0, .5), 0 0 2px rgba(0, 0, 0, .5);
        }

        .post-preview--meta {
            width: 80%;
            padding: 23px;
            overflow: hidden;
        }

        .post-preview--middle {
            line-height: 28px;
        }

        .post-preview--title {
            font-size: 22px;
            margin: 0 !important;
            padding-bottom: 0.25em;
        }

        .post-preview--title a {
            text-decoration: none;
        }

        .post-preview--date {
            font-size: 14px;
            color: #999;
        }

        .post-preview--excerpt {
            font-size: 14px;
            line-height: 1.825;
        }

        .post-preview--excerpt p {
            display: inline;
            margin: 0;
        }

        .post-preview--image {
            height: 200px !important;
            width: 25%;
            float: right;
            border-radius: 0 15px 15px 0;
        }

        .post-preview img {
            margin: unset;
            width: 20%;
            border-radius: 0 8px 8px 0;
        }

        @media (max-width: 550px) {
            .post-preview {
                width: 95%;
            }

            .post-preview--excerpt {
                /*display: none;*/
            }

            .post-preview--middle {
                line-height: 19px;
            }

            .post-preview--meta {
                width: 60%;
                padding: 23px;
                overflow: hidden;
            }

            .post-preview img {
                margin: unset;
                width: 40%;
                border-radius: 0 15px 15px 0;
            }
        }

        .rating {
            display: block;
            line-height: 15px;
        }

        .rating-star {
            display: inline-block;
            width: 75px;
            height: 15px;
            background-repeat: no-repeat;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAAClCAYAAAAUAAAYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA5xJREFUeNrs3T9rFEEcxvG7qEQIglaCICKkin9AUEtBKxU7wS61VlYivgWj70TtNFj5BqzE7qxEWwsxKIoYn4UtluFmbm8nczvzm+/BjxyuDwNzu3uXD0+46f7LC5PA45Hm+WTYw1x2LRDc0jzTXB+wqMlsaLPutz8fDFjYZHYauAz3NBvt83XNnyUWNpn1nVm3OsHmsb3EomazzZnVXKMPNcc0xzUnNKc0Rzv/77fms+Z7O3vt9b1eU7bZrNN68l5zcolX4ofmsuZXTdnmMvyi2dR86Bmcac62P6vKrnVubpc0bxYE32nOab45N8YqsvPeDfcD4SOav4HjprPuu+H5BTt9LXDMfNbdLPfT678Fx6vKupt1o/O8+R3pkOaJ5/iktqx7z/qp+aq5q/nY+fczmheaK03Gs7D5rLtZdzSvA6/Ebc2u55j57HQB0TzW7AzkjiKzny6+2hlKNE8juMNcFqKBaIZndRlCNBBNgmx7ZkE0fbLtZkE0EA1EM17WuQwhGogGooFoss6296y52cNO+J6HLJoPaFdbsvA9zGerIxrPh85eWYgGooFoDiQbuAxp0UA0EVmdWbRo+ma1WbRoIBqIZtzsnHdDWjQQDUQD0WSbde5ZS2UhmtqJJtSEiVkXooFoIJre2VATJmZdiKZ2ogk1YSb8oVMvDeUPnSAaiCaPJkzMuhANRAPRQDQpsqEmTMy6EI11oolpwkA0EA1EcyDZmCYMRAPR+LMxTZjqiCamCQPRQDQQzehNGIgGooFoIJpVZ2OaMBBN7USTqgkD0UA0EE3vbKomDERTO9GkasKYJJpUTRiIBqKBaEZvwkA0EA1EA9GkyKZqwkA01olmrCYMRAPRQDR9LkO+0QmiKbAJUyTRjNWEgWggGohm9CYMRAPRQDQQzZDsWE0YiMYC0eTYhIFoIJrKiCbHJgxEY4FocmzCZEs0OTZhIBqIpjKiybEJA9FANBANROPL5tiEgWhKIJoSmzAQDURjjGhKbMJANCUQTYlNmNGIpsQmDEQD0RgjmhKbMBANRAPR1Es0JTZhIJpciMZaEwaigWgKJBprTRiIJheisdaESUo01powEA1EUyDRWGvCQDQQDURjm2isNWEgmlURzWw2q4pZIBqIJkOiCVyGJpkFolkV0ejMMvel28mIRptl7ku3IRqIpjCimfNuaJpZIBqIBqIpm2ice5Z5ZonJupvVkMRu4JW4qXnrOWY++1+AAQBw9BJSCTeN9wAAAABJRU5ErkJggg==);
            overflow: hidden;
        }

        .allstar10 {
            background-position: 0px 0px;
        }

        .allstar9 {
            background-position: 0px -15px;
        }

        .allstar8 {
            background-position: 0px -30px;
        }

        .allstar7 {
            background-position: 0px -45px;
        }

        .allstar6 {
            background-position: 0px -60px;
        }

        .allstar5 {
            background-position: 0px -75px;
        }

        .allstar4 {
            background-position: 0px -90px;
        }

        .allstar3 {
            background-position: 0px -105px;
        }

        .allstar2 {
            background-position: 0px -120px;
        }

        .allstar1 {
            background-position: 0px -135px;
        }

        .allstar0 {
            background-position: 0px -150px;
        }


        .rating-average {
            color: #777;
            display: inline-block;
            font-size: 13px;
            margin-left: 10px;
        }
    </style>
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            $('.douban_item').each(function () {
                var _this = $(this);
                var strs = _this.attr('urlstring').toString();
                var db_reg = /^https\:\/\/(movie|book)\.douban\.com\/subject\/([0-9]+)\/?/;
                if (db_reg.test(strs)) {
                    var db_type = strs.replace(db_reg, "$1");
                    var db_id = strs.replace(db_reg, "$2").toString();
                    var db_api = "https://douban.edui.fun/";
                    if (db_type === 'movie') {
                        var ls_item = 'movie' + db_id;
                        var url = db_api + "movies/" + db_id;
                        if (localStorage.getItem(ls_item) == null || localStorage.getItem(ls_item) === 'undefined') {
                            $.ajax({
                                url: url, type: 'GET', dataType: "json", success: function (data) {
                                    localStorage.setItem(ls_item, JSON.stringify(data));
                                    movieShow(_this, ls_item, strs)
                                }
                            })
                        } else {
                            movieShow(_this, ls_item, strs)
                        }
                    } else if (db_type === 'book') {
                        var ls_item = 'book' + db_id;
                        var url = db_api + "v2/book/id/" + db_id;
                        if (localStorage.getItem(ls_item) == null || localStorage.getItem(ls_item) === 'undefined') {
                            $.ajax({
                                url: url, type: 'GET', dataType: 'json', success: function (data) {
                                    localStorage.setItem('book' + db_id, JSON.stringify(data));
                                    bookShow(_this, ls_item, strs)
                                }
                            })
                        } else {
                            bookShow(_this, ls_item, strs)
                        }
                    }
                }
            });
        });

        function movieShow(_this, ls_item, str) {
            var storage = localStorage.getItem(ls_item);
            var data = JSON.parse(storage);
            var db_star = Math.ceil(data.rating);
            $("<div class='post-preview'><div class='post-preview--meta'><div class='post-preview--middle'><div class='post-preview--title'><a target='_blank' style='box-shadow: none; font-weight: bolder;' href='" + str + "'>" + data.name + "</a></div><div class='rating'><div class='rating-star allstar" + db_star + "'></div><div class='rating-average'>" + data.rating + "</div></div><time class='post-preview--date'>导演：" + data.director + " / 类型：" + data.genre + " / " + data.year + "</time><section style='max-height:75px;overflow:hidden;' class='post-preview--excerpt'>" + data.intro.replace(/\s*/g, "") + "</section></div></div><img referrerpolicy='no-referrer' loading='lazy' class='post-preview--image' src=" + data.img + "></div>").replaceAll(_this)
        }

        function bookShow(_this, ls_item, str) {
            var storage = localStorage.getItem(ls_item);
            var data = JSON.parse(storage);
            var db_star = Math.ceil(data.rating.average);
            $("<div class='post-preview'><div class='post-preview--meta'><div class='post-preview--middle'><div class='post-preview--title'><a target='_blank' style='box-shadow: none; font-weight: bolder;' href='" + str + "'>" + data.title + "</a></div><div class='rating'><div class='rating-star allstar" + db_star + "'></div><div class='rating-average'>" + data.rating.average + "</div></div><time class='post-preview--date'>作者：" + data.author + " / 出版："+ data.pubdate +" / "+ data.publisher +" </time><section style='max-height:75px;overflow:hidden;' class='post-preview--excerpt'>" + data.summary.replace(/\s*/g, "") + "</section></div></div><img referrerpolicy='no-referrer' loading='lazy' class='post-preview--image' src=" + data.images.medium + "></div>").replaceAll(_this)
        }
    </script>
</head>
<body>
<div class="douban_show">
    <div id="db{{ .Get "src" }}" urlstring="{{ .Get "src" }}" class="douban_item post-preview"></div>
</div>
</body>
</html>
```

