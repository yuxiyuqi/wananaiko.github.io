---
title: "Hugo 的一些配置记录"
date: 2023-01-09T00:24:18+08:00
author: "wananaiko"
tags:
  - hugo
  - waline
draft: false
---

**Hugo 增加空格之神**

使用空格之神的浏览器插件很久了，真的是阅读强迫症患者的福音，[空格之神项目地址](https://github.com/vinta/pangu.js)

在 Hugo的 /layouts/_default/baseof.html 内增加以下代码：

```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/pangu/4.0.7/pangu.min.js"></script>
<script>
  pangu.spacingPage();
</script>
```

用完后感觉整个世界都清爽了 🤣

---

**Hugo 使用 Waline 评论系统**

依照官网的教程，[部署到 Vercel上](https://waline.js.org/guide/deploy/vercel.html)，适配了 Hugo 的暗黑模式。

---

下一步：

- [ ] 给Hugo增加相册功能和单页

参考：[添加相册功能](https://baohengtao.com/tech/add-gallery-to-hugo/)
