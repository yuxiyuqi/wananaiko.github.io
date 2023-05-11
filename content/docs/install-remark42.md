---
title: "Fly.io 部署 Remark42 评论系统"
date: 2023-04-25T11:10:49+08:00
author: "wananaiko"
tags:
  - Remark42
  - Hugo
draft: false
---

### Remark42 是什么

Remark42 是一个开源、轻量化、自托管的评论服务，支持使用 Google, Twitter, Facebook, Microsoft, GitHub, Yandex, Patreon, Telegram, Email 以及匿名方式进行评论。

之前使用的是 [Waline](https://waline.js.org/) 博客评论系统，部署在 Vercel 上。个人觉得不够简洁，于是就折腾起来换成了 Remark42。配置过程指数级增加，需要花一些时间调校测试。

---

[Fly.io](http://fly.io/) 免费计划包含：

-  共3个单核256兆内存的应用和机器

- 共3GB的持久化卷

- 160GB出站数据

计划详情：https://fly.io/docs/about/pricing/#free-allowances

安装部分参考：[Fly.io 部署 Remark42 评论系统](https://www.weizhiwen.net/flyio-deploy-remark42)

---

### 部署 Remark42

在本地建个文件夹，例如 remark42-flyio，在终端中打开这个文件夹。

1. #### 安装 flyctl

   根据自己的系统选择对应的安装方式。

   [Install flyctl · Fly Docs](https://fly.io/docs/hands-on/install-flyctl/)

   安装完，在终端里登录：`flyctl auth signup`

   会弹出 fly.io 的网页窗口，授权登录即可。

2. #### 创建 Dockerfile

   在文件夹中新建一个文件，名为 Dockerfile，无需文件名后缀。文本编辑器打开后输入以下内容并保存：

   ```
   # Dockerfile
   FROM umputun/remark42
   ```

3. #### 创建应用

   终端里执行: `flyctl launch`

   填写应用名，这个名称不能更改，并且 fly.io 会分配一个域名 <application-name>.fly.dev，所以慎重，推荐：<服务名称>-<个人名称>，示例：remark42-aiko

   选择部署区域，推荐选日本，可以在这个网站测试 [liveview-counter.fly.dev](https://liveview-counter.fly.dev/) 你点加号看下边哪个地区数字有变化

   是否立即部署，否

   文件夹下会生成 fly.toml

4. #### 设置 Docker 环境变量

   打开 fly.toml 在 env 下加入环境变量，参考 remark42 教程里给的 docker compose 环境变量。后面很多登录配置都是在 fly.toml 里设置的。

   ```toml
   [env]
     REMARK_URL = "https://remark42-aiko.fly.dev"
     SECRET = "123456"
     TZ = "Asia/Shanghai"
   ```

5. #### 增加持久卷

   终端里执行：`flyctl vol create remark42_data -s 1 -r nrt`

   地区必须和上边的地区一样，flyctl regions list 可以看到。
   注意：删除应用时会一并删除持久卷。

   fly.toml 加入 mounts 部分的代码：

   ```toml
   [env]
   ...
   
   [mounts]
     destination = "/srv/var"
     source = "remark42_data"
   ```

   最终配置大概是这样的：

   ```toml
   # fly.toml file generated for remark42-aiko on 2023-04-24T14:24:20+08:00
   
   app = "remark42-alamiao"
   kill_signal = "SIGINT"
   kill_timeout = 5
   processes = []
   
   [env]
     REMARK_URL = "https://remark42-aiko.fly.dev"
     SECRET = "123456"
     TZ = "Asia/Shanghai"
   
   [mounts]
     destination = "/srv/var"
     source = "remark42_data"
     
   [experimental]
     auto_rollback = true
   
   [[services]]
     http_checks = []
     internal_port = 8080
     processes = ["app"]
     protocol = "tcp"
     script_checks = []
     [services.concurrency]
       hard_limit = 25
       soft_limit = 20
       type = "connections"
   
     [[services.ports]]
       force_https = true
       handlers = ["http"]
       port = 80
   
     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443
   
     [[services.tcp_checks]]
       grace_period = "1s"
       interval = "15s"
       restart_limit = 0
       timeout = "2s"
   ```



6. #### 部署到 fly.io

   终端里输入：`flyctl deploy`

   等命令执行结束，去 fly.io 的 dashboard 上就能看到了，访问地址: https://remark42-aiko.fly.dev/web/ 
   到这里，你能打开页面但是不能登录评论系统，因为还没有配置 OAuth 授权登录。

7. #### 自定义域名（建议）

   打开 fly.io 的 [dashboard](https://fly.io/dashboard/personal)，在中间 App 一栏可以看到你刚才创建的应用，比如我这里是：remark42-aiko。

   点进去，在左侧 Certification 里 点击 “Add certification”。

   接着在 Hostname 中输入你要自定义的域名，比如我这里是：remark42.wananaiko.com。

   最后就是去你的域名服务商里设置解析了，我这里用的是 Cloudflare，如果解析后打开https://remark42-aiko.fly.dev/web/ 提示页面错误，可设置 Cloudflare 域名解析的 Proxy status 为 DNS only。

   解析完成后，建议将 fly.toml 文件中的 REMARK_UR修改为你解析后的域名，示例：

   ```
   REMARK_URL = "https://remark42.wananaiko.com"
   ```

   修改完后，在终端里执行  `flyctl deploy` 

8. #### 邮箱登录和第三方应用登录

   可参考这篇文章 [史上最全Remark42评论系统安装教程 | 奥国天空](https://matteo.eu.org/2023/20230207024855.html#421-%E5%8C%BF%E5%90%8D%E7%99%BB%E5%BD%95)

   将对应的参数添加到 fly.toml 中即可，需要注意符合 TOML 格式。

   参数示例，敏感信息部分使用了*号代替。

   ```
   AUTH_GITHUB_CID = "5cc8*********910"
     AUTH_GITHUB_CSEC = "eaa4bfe99e*********b256c0d03"
     ADMIN_SHARED_ID = "github_433*********c9a7b8e87b"
     AUTH_GOOGLE_CID = "4662*********-*********.apps.googleusercontent.com"
     AUTH_GOOGLE_CSEC = "GOCSPX-*********LDwgp0FNCMOe"
     AUTH_TWITTER_CID = "gBoJ141*********5macEsG"
     AUTH_TWITTER_CSEC = "NqlaPpVYg*********jTrHWrXxw"
     SMTP_HOST = "smtp.sendgrid.net"
     SMTP_PORT = "465"
     SMTP_TLS = true
     SMTP_USERNAME = "apikey"
     SMTP_PASSWORD = "SG.2A4mLx*********jnAIhw.xK-URxJc*********m7dY9_UTrOH*********Ubnprs"
     AUTH_EMAIL_ENABLE = true
     AUTH_EMAIL_FROM = "yourmail@gmail.com"
     AUTH_EMAIL_SUBJ= "在 wananaiko.com 留言确认"
     AUTH_EMAIL_CONTENT_TYPE = "text/html"
     NOTIFY_USERS = "email"
     NOTIFY_EMAIL_FROM = "yourmail@gmail.com"
     NOTIFY_EMAIL_VERIFICATION_SUBJ = "邮件确认"
     NOTIFY_ADMINS = "email"
     ADMIN_SHARED_EMAIL = "yourmail@gmail.com"
   ```

   添加完参数后需要执行 `flyctl deploy` 重新部署。TOML 格式错误会导致部署失败。建议每添加完一种登录授权后，就执行 flyctl deploy 部署测试一下。

9. #### 在 Hugo 中添加 Remark42

   不同的主题不同的安装方式，建议结合自己的主题添加评论功能。当然，你也可以安装 Hugo 官方的指南添加。我这里还将 Remark42 适配了 PaperModX 主题的暗黑模式切换。

   添加 Remark42 到 Hugo 可以参考 [Remark42 官方指南](https://remark42.com/docs/configuration/frontend/) 。或者参考这篇文章 [Hugo and comments with remark42 - La blog](https://blog.lasall.dev/post/hugo-and-comments-with-remark42/)，从 `9. Update Hugo’s single.html` 开始看。

   我这里在  layouts/partials/comments.html 加上了下面的代码，部分参数需要修改为自己的：

   ```html
   <head>
     <style>
       .comment-title {
         font-size: 24px;
         font-weight: bold;
         padding: 32px 6px 0px 6px;
       }
       .comment-description {
         font-size: 14px;
         color: #666;
         padding: 4px 16px 16px 6px;
       }
       p.root__copyright {
         display: none;
       }
     </style>
   </head>
   <body>
     <div class="comment-title">欢迎评论</div>
     <div class="comment-description">请通过电子邮件订阅以接收回复通知。</div>
     <div id="remark42"></div>
   
     <script>
       var remark_config = {
         host: "https://remark42.wananaiko.com",
         site_id: "wananaiko",
         locale: "zh",
         page_title: "Comments",
         theme: "auto",
       };
       (function (c) {
         /* 支持适配主题切换 */
         if (localStorage.getItem("pref-theme") === "dark") {
           remark_config.theme = "dark";
         } else if (localStorage.getItem("pref-theme") === "light") {
           remark_config.theme = "light";
         }
         /* 添加 remark42 评论控件 */
         for (var i = 0; i < c.length; i++) {
           var d = document,
             s = d.createElement("script");
           s.src = remark_config.host + "/web/" + c[i] + ".js";
           s.defer = true;
           (d.head || d.body).appendChild(s);
         }
       })(remark_config.components || ["embed"]);
     </script>
     <script>
       !(function (e, n) {
         for (var o = 0; o < e.length; o++) {
           var r = n.createElement("script"),
             c = ".js",
             d = n.head || n.body;
           "noModule" in r ? ((r.type = "module"), (c = ".mjs")) : (r.async = !0),
             (r.defer = !0),
             (r.src = remark_config.host + "/web/" + e[o] + c),
             d.appendChild(r);
         }
       })(remark_config.components || ["embed"], document);
     </script>
   </body>
   ```

   为了支持主题切换，还需要在 layouts/partials/extend_footer.html  中添加以下代码：

   ```html
   {{- if (not site.Params.disableThemeToggle) }}
   <script>
   /* Function to change theme when the toggle button is pressed */
   document.getElementById("theme-toggle").addEventListener("click", () => {
     if (typeof window.REMARK42 != "undefined") {
       if (document.body.className.includes('dark')) {
         window.REMARK42.changeTheme('light');
       } else {
         window.REMARK42.changeTheme('dark');
       }
     }
   });
   </script>
   {{- end }}
   ```

   10. #### 其他说明

       以上是对本次折腾过程的整理。如果卡在某个地方失败了，建议检索相关的文档或者借助搜索引擎。部分地方写的可能有点乱，也可能漏了什么，希望多多理解，建议部署前先看一遍 [Remark42](https://remark42.com/docs/getting-started/installation/) 官方文档。

       关于 Remark42 控件颜色适配主题颜色，还没有折腾好。查找了部分方法，还是有点麻烦的。
