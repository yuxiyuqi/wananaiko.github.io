---
title: "Hugo 添加相册单页"
date: 2023-01-10T15:08:47+08:00
author: "wananaiko"
tags:
  - Hugo
  - 相册
draft: false
---

参考：[Hugo 添加相册页面：：木木木木木](https://immmmm.com/hugo-readdir-photos/)，本文仅用于备份折腾的记录。

文件目录结构：

<img src="https://images.wananaiko.com/2023/01/image-20230117151058386.png" alt="image-20230117151058386" style="zoom:50%;" />

其中 `photos.html`代码如下，调整了部分CSS：

```html
{{- define "main" }}
<header class="page-header">
  <h1>{{ .Title }}</h1>
</header>
<style>
  .main {max-width: 1008px !important;}
  
  .page-photos{width:100% !important;overflow:hidden; position:relative;}
  .page-photo{width:24.9%;position: relative;visibility: hidden;}
  .page-photo.visible{visibility: visible;animation: fadeIn 2s;}
  .page-photo img{display: block;width:100%;border-radius:0;padding:0px;}
  .page-photo span.photo-title,.page-photo span.photo-time{background: rgba(0, 0, 0, 0.3);padding:0px 8px;font-size:0.8rem;color: #ffffffb8;}
  .page-photo span.photo-title{position:absolute;bottom:0px;left:0px;}
  .page-photo span.photo-time{position:absolute;top:0px;left:0px;font-size:0.8rem;}
  @media screen and (max-width: 1280px) {
    .page-photo{width:33.3%;}
  }
  @media screen and (max-width: 860px) {
    .page-photo{width:49.9%;}
  }
  @media (max-width: 683px){
    .photo-time{display: none;}
    .page-photos{margin-top:4px;}
  }
  @keyframes fadeIn{
    0% {opacity: 0;}
    100% {opacity: 1;}
  }
</style>

<section>
<div class="page-photos">
  {{ range (sort (readDir "/static/photos/") "Name" "desc")}}
    {{ if (findRE "^[0-9 -]+(.*)[.].*" .Name) }}
    <div class="page-photo">
      <img class="photo-img" loading='lazy' decoding="async" src="/photos/{{ .Name }}" alt="{{ .Name }}" />
      <span class="photo-title">{{ .Name | replaceRE "^[0-9 -]+(.*)[.].*" "$1"}}</span>
      
      <!-- 左上角时间隐藏，可自主开启 -->
      <!-- <span class="photo-time">{{ .Name | replaceRE "^([0-9-]+).*[.].*" "$1" }}</span> -->

    </div>
    {{ end }}
  {{ end }}
</div>
</section>

<script type="text/javascript" src="/js/waterfall.min.js"></script>
<script type="text/javascript" src="/js/imgStatus.min.js"></script>
<script type="text/javascript" src="/js/view-image.js"></script>
<script type="text/javascript" src="/js/lately.min.js"></script>
<script>
imgStatus.watch('.photo-img', function(imgs) {
  if(imgs.isDone()){
    waterfall('.page-photos');
    let pagePhoto = document.querySelectorAll('.page-photo');
    for(var i=0;i < pagePhoto.length;i++){pagePhoto[i].className += " visible"};
  }
});
window.addEventListener('resize', function () {
  waterfall('.page-photos');
});
//相对时间
window.Lately && Lately.init({ target: '.photo-time'});
//图片灯箱
window.ViewImage && ViewImage.init('.page-photo img')
</script>

{{/* end main */}}
{{- end }}
```

如果要调整页面的宽度请修改 `.main {max-width: 1008px !important;}`样式。

![xT4X11](https://images.wananaiko.com/2023/01/xT4X11.png)

线上效果已经移除啦~
