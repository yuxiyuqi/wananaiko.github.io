---
title: "Hugo Shortcode 汇总页面"
date: 2023-07-13T21:37:48+08:00
author: "wananaiko"
tags:
  - Hugo
  - Shortcode
draft: false
ai: 该文章是一个关于Hugo短代码汇总页面的介绍，页面提供了各种Hugo短代码，并且点击卡片即可复制对应的短代码。
---

为了方便调用 Hugo Shortcode ，做了个命令汇总页面，点击卡片即可复制对应的短代码，[预览地址](https://wananaiko.com/quickshort/)

#### 页面模板：

新建页面模板文件：themes/yourtheme/layouts/_default/quickshort.html

```html
{{ define "main" }} {{ $quickshort := getJSON "data/quickshort.json" }}

<style>
  .main.post {
    position: relative !important;
    min-height: calc(
      100vh - var(--header-height) - var(--footer-height)
    ) !important;
    max-width: calc(var(--main-width) + var(--gap) * 2) !important;
    margin-top: 5rem 0;
  }

  .shortcode-view {
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(3, 1fr);
  }

  .code-container {
    position: relative;
    display: flex;
    padding: 16px 12px;
    border-radius: var(--radius);
    --list-opacity: 1;
    background-color: rgb(250 250 250 / var(--list-opacity));
    min-height: 120px;
  }

  .copy-success-tip {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, 0);
    opacity: 0;
    background-color: #000000e8;
    color: var(--theme);
    font-size: 12px;
    padding: 2px 12px;
    border-radius: 5px;
    z-index: 1;
    transition: all 0.3s ease-out;
    pointer-events: none;
  }

  .copy-success-show {
    top: 30%;
    opacity: 1;
    transition: top 0.5s ease, opacity 0.5s ease;
  }

  .dark .copy-success-tip {
    background-color: #ffffffe8;
  }

  .dark .code-container {
    background: var(--code-bg);
  }

  .dark .code-container:hover {
    --list-opacity: 0.1;
    background-color: rgb(0 0 0 / var(--list-opacity));
  }

  .shortcode-content {
    margin-left: 8px;
    width: -webkit-fill-available;
  }

  .code-container:hover svg.iconpark-icon {
    color: ;
  }

  .shortcode-header {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .shortcode-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary);
    line-height: 24px;
  }

  .shortcode-tag {
    margin-left: auto;
  }

  .shortcode-tag-soon {
    display: flex;
    padding: 2px 8px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--tertiary);
    color: var(--entry);
    font-size: 10px !important;
    font-weight: 400;
    line-height: 18px;
  }

  .shortcode-tag-update {
    display: flex;
    padding: 2px 8px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--link-hover-color);
    color: var(--entry);
    font-size: 10px !important;
    font-weight: 400;
    line-height: 18px;
    opacity: 0.8;
  }

  .shortcode-description {
    font-size: 14px;
    line-height: 1.4;
    margin-top: 8px;
    color: var(--secondary);
  }

  .code-container:hover {
    background-color: var(--code-bg);
  }

  .shortcode-markdown {
    display: none;
  }

  svg.iconpark-icon {
    width: 24px;
    height: 24px;
  }

  @media screen and (max-width: 768px) {
    .shortcode-view {
      grid-template-columns: repeat(2, 1fr);
    }
    .shortcode-tag-soon {
      display: none;
    }
  }
</style>

<header class="page-header">
  <h1>{{ .Title }}</h1>
  {{- if .Description }}
  <div class="post-description">{{ .Description }}</div>
  {{- end }}
</header>

<div class="shortcode-view slide-enter-content">
  {{ range $quickshort.quickshort}}
  <div class="code-container" data-color="{{ .color }}">
    <div class="shortcode-icon">
      <svg class="iconpark-icon">
        <use href="{{ .icon | safeHTML }}"></use>
      </svg>
    </div>
    <div class="shortcode-content">
      <div class="shortcode-header">
        <div class="shortcode-title">{{ .title }}</div>
        <div class="shortcode-tag">
          <!-- 从JSON中的"tag-soon"或者"tag-update"获取数据 -->
          {{ $tag := index . "tag-soon" }} {{ $tag2 := index . "tag-update" }}
          {{ if $tag }}
          <div class="shortcode-tag-soon">{{ $tag }}</div>
          {{ end }} {{ if $tag2 }}
          <div class="shortcode-tag-update">{{ $tag2 }}</div>
          {{ end }}
        </div>
      </div>
      <div class="shortcode-description">{{ .description }}</div>
      <div class="shortcode-markdown">
        <pre><code>{{ .markdown | safeHTML }}</code></pre>
      </div>
    </div>
  </div>
  {{ end }}
</div>

<script>
  // 以下为图标颜色切换动画
  const containers = document.querySelectorAll(".code-container");
  const defaultColor = "var(--content)"; // 默认颜色

  containers.forEach((container) => {
    const icon = container.querySelector("svg.iconpark-icon");

    container.addEventListener("mouseover", function () {
      let hoverColor = this.getAttribute("data-color");
      icon.style.color = hoverColor;
    });

    container.addEventListener("mouseout", function () {
      icon.style.color = defaultColor;
    });
  });

  // 复制到剪贴板功能
  containers.forEach((container) => {
    container.addEventListener("click", function () {
      const markdown = this.querySelector(".shortcode-markdown code").innerText;

      navigator.clipboard.writeText(markdown).then(() => {
        // 复制成功的操作
        const tip = document.createElement("div");
        tip.textContent = "复制成功";
        tip.className = "copy-success-tip";
        this.appendChild(tip); // 将提示框添加为 .code-container 的子元素

        // 让提示框逐渐显示出来
        setTimeout(() => {
          tip.classList.add("copy-success-show");
        }, 100);

        // 3 秒后让提示框逐渐消失并最终移除它
        setTimeout(() => {
          tip.classList.remove("copy-success-show");
          setTimeout(() => {
            tip.remove();
          }, 500);
        }, 1500);
      });
    });
  });
</script>

{{ end }}
```



#### 短代码内容维护

新建更新短代码内容的数据文件：/data/quickshort.json，数据格式参考：[点击查看](https://images.wananaiko.com/2023/07/quickshort.json)

