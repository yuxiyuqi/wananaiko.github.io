---
title: "memos"
layout: "memos"
type: 'memos'
--- 
<meta name="referrer" content="no-referrer">
<script type="text/javascript" src="/memos/assets/js/marked.min.js"></script>

<!-- 增加卡片滑动时的放大效果 -->
<style>
.timeline img {
    display: block;
    max-height: 40vh;
    max-width: 100%;
    margin: 10px 0;
    border-radius: 16px;
    border: 1px solid var(--color-img-border);
}
.memo-container img {
    padding-top: 1rem;
    max-height: 40vh !important;
}
.memo-container{
    transition: .4s !important;
}
.memo-container:hover{
    transform: translateY(-4px) !important;
    box-shadow: 0 4px 12px #0c1f500a !important;
    transition: .4s !important;
}
</style>

<!-- 设置memos部分的所有链接在新标签页打开 -->
<script type="text/javascript">
    window.onload = function() {
  var links = document.querySelectorAll("#bber a");
  for (var i = 0; i < links.length; i++) {
    links[i].target = "_blank";
  }
};
</script>

<!-- memos内容区域 -->
<section id="main" class="container">
    <div class="memo-nums">
        <p class="note note-info memo-nums-text">
            共有
            <span id="memonums">「条等待加载」</span>
            条memos，<a href="https://memo.wananaiko.com/u/1" target="_blank" style="color:#876fd6;font-size:1rem;">查看全部</a>
        </p>
    </div>
    <div id="bber"></div>
    <script type="text/javascript">
        var bbMemos = {
            memos: "https://memo.wananaiko.com/",
            limit: "15",
            creatorId: "1",
            domId: "#bber"
        }
    </script>
</section>

<script type="text/javascript">
    window.ViewImage && ViewImage.init('.content img');
</script>

<script type="text/javascript" src="/memos/assets/js/view-image.min.js"></script>
<script type="text/javascript" src="/memos/assets/js/bibi.js"></script>
<script type="text/javascript" src="/memos/assets/js/highlight.min.js"></script>
<script type="text/javascript" src="https://fastly.jsdelivr.net/gh/Tokinx/Lately/lately.min.js"></script>