---
title: "memos"
layout: "memos"
markup: HTML
---
<!DOCTYPE html>
<div id="memos" class=""></div>

<div class="container">
    <h2 class="title">Memos</h2>
    <p>共嘀咕了 <span id="memosCount">0</span> 条 Memos 🎉</p>
    <div id="memos">
        <!-- 嘀咕加载在这里 -->
    </div>
</div>

<script type="text/javascript">
    var memos = {
        host: "http://memo.wananaiko.com/", //修改为自己部署 Memos 的网址，末尾有 / 斜杠
        limit: "20", //默认每次显示 10条
        creatorId: "1", //默认为 101用户 https://demo.usememos.com/u/101
        domId: "#memos", //默认为 #memos
    };
</script>

<!-- 注意替换 JS 资源文件的路径 -->
<script type="text/javascript" src="/memos/assets/marked.min.js?v=4.2.2"></script>
<script type="text/javascript" src="/memos/assets/pangu.min.js?v=4.0.7"></script>
<script type="text/javascript" src="/memos/assets/moment.min.js?v=2.29.4"></script>
<script type="text/javascript" src="/memos/assets/moment.twitter.min.js"></script>
<script type="text/javascript" src="/memos/assets/memos.js"></script>
