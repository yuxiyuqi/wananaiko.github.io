---
title: "Hugo增加相册功能"
date: 2023-01-12T22:54:52+08:00
author: "wananaiko"
tags:
  - Hugo
  - 相册
---

Github仓库地址:
https://github.com/liwenyip/hugo-easy-gallery

按教程操作后,需要注意在文章中引用时,按下面的类似格式 (需去掉下方所有的 \ ):

```markdown
{{\< load-photoswipe >\}}
{{\< gallery >\}}
  {{\< figure src="docs/hugo-easy-gallery/image1.jpg" >\}}
  {{\< figure src="docs/hugo-easy-gallery/image2.jpg" >\}}
  {{\< figure src="docs/hugo-easy-gallery/image3.jpg" >\}}
{{\< /gallery >\}}
```
并对 CSS 样式进行了微调,修改根目录 `/assets/css/core/reset.css`,加入以下代码:
```css
.pswp__item {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    background-color: #000000 !important;
}

.pswp img {
    max-width: none;
    max-height: 85vh;
}

.pswp__caption {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    min-height: 80px !important;
}
```

{{< load-photoswipe >}}
{{< gallery >}}
  {{< figure src="https://images.wananaiko.com/2023/01/jaeYun.jpg" alt="法师桥">}}
  {{< figure src="https://images.wananaiko.com/2023/01/OuL560.jpg" alt="龙美术馆" >}}
  {{< figure src="https://images.wananaiko.com/2023/01/4cxcoH.jpg" alt="前滩太古里,Leica M10 + 50 2aa">}}
{{< /gallery >}}