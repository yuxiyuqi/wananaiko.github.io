---
title: "memos"
layout: "memos"
type: 'memos'
comment: false
aliases:
    - /talk
    - /talks
---

<meta name="referrer" content="no-referrer">
<link rel="stylesheet" href="/memos/assets/css/APlayer.min.css?v=1.10.1">
<div class="count">
    <blockquote>共嘀咕了 <span id="memosCount"><i class="fas fa-spinner fa-pulse"></i></span> 条 Memos <span class="emoji">🎉</span></blockquote>
</div>
<div id="memos">
    <!-- 嘀咕加载在这里 -->
</div>

<script type="text/javascript">
    var memos = {
        host: 'https://memo.wananaiko.com/', //修改为自己部署 Memos 的网址，末尾有 / 斜杠
        limit: '10', //默认每次显示 10条
        creatorId: '1', //默认为 101用户 https://demo.usememos.com/u/101
        domId: '#memos', //默认为 #memos
    }
</script>

<script type="text/javascript" src="/memos/assets/js/marked.min.js?v=4.2.2"></script>
<script type="text/javascript" src="/memos/assets/js/pangu.min.js?v=4.0.7"></script>
<script type="text/javascript" src="/memos/assets/js/moment.min.js?v=2.29.4"></script>
<script type="text/javascript" src="/memos/assets/js/moment.twitter.min.js"></script>
<script type="text/javascript" src="/memos/assets/js/APlayer.min.js?v=1.10.1"></script>
<script type="text/javascript" src="/memos/assets/js/Meting.min.js?v=1.2"></script>
<script type="text/javascript" src="/memos/assets/js/memos.min.js"></script>
<script type="text/javascript" src="/memos/assets/js/highlight.min.js?v=11.7.0"></script>
<script type="text/javascript" src="/memos/assets/js/view-image.min.js?v=2.0.2"></script>
<script>
    window.ViewImage && ViewImage.init('.content img');
</script>
<script>
    // Meting API self-hosted
    var meting_api='https://api.eallion.com/meting/?server=:server&type=:type&id=:id&auth=:auth&r=:r';
</script>