---
title: "memos"
layout: "memos"
markup: HTML
---
<!DOCTYPE html>
<html lang="en" dir="auto">
<head><meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<link href="/memos/assets/css/style.css" rel="stylesheet" type="text/css">
<link href="/memos/assets/css/APlayer.min.css" rel="stylesheet" type="text/css">
<link href="/memos/assets/css/highlight.github.min.css" rel="stylesheet" type="text/css">
<link href="/memos/assets/css/custom.css" rel="stylesheet" type="text/css">

<div id="memos" class=""></div>

<div class="container">
    <div id="memos">
        <!-- 嘀咕加载在这里 -->
    </div>
</div>

<script type="text/javascript">
    var memos = {
        host: "https://memo.wananaiko.com/", //修改为自己部署 Memos 的网址，末尾有 / 斜杠
        limit: "20", //默认每次显示 10条
        creatorId: "1", //默认为 101用户 https://demo.usememos.com/u/101
        domId: "#memos", //默认为 #memos
    };
</script>

<script>
    window.ViewImage && ViewImage.init('.content img');
</script>

<!-- 注意替换 JS 资源文件的路径 -->
<script type="text/javascript" src="/memos/assets/js/lazyload.min.js?v=17.8.3"></script>
<script type="text/javascript" src="/memos/assets/js/marked.min.js?v=4.2.2"></script>
<script type="text/javascript" src="/memos/assets/js/view-image.min.js"></script>
<script type="text/javascript" src="/memos/assets/js/pangu.min.js?v=4.0.7"></script>
<script type="text/javascript" src="/memos/assets/js/moment.min.js?v=2.29.4"></script>
<script type="text/javascript" src="/memos/assets/js/moment.twitter.js"></script>
<script type="text/javascript" src="/memos/assets/js/APlayer.min.js"></script>
<script type="text/javascript" src="/memos/assets/js/Meting.min.js"></script>
<script type="text/javascript" src="/memos/assets/js/highlight.min.js"></script>
<script type="text/javascript" src="/memos/assets/js/main.js"></script>
<script type="text/javascript" src="/memos/assets/js/custom.js"></script>

</html>