---
title: "memos"
layout: "memos"
type: 'memos'
--- 

<div class="memo-nums">
        <p class="note note-info memo-nums-text">
            <hanla></hanla>共有
            <span id="memonums">「条等待加载」</span>
            条说说<hanla></hanla>
        </p>
    </div>
    <div id="bber"></div>
    <script type="text/javascript">
        var bbMemos = {
            memos: "https://memo.wananaiko.com/",
            limit: "",
            creatorId: "1",
            domId: ""
        }
    </script>

<script type="text/javascript">
  //图片灯箱
  // baguetteBox 灯箱 Issue: #190 先销毁再初始化
  baguetteBox.destroy()
  baguetteBox.run('.gallery', {
    // Custom options
    buttons: false,
    noScrollbars: true,
    fullScreen: false,
    filter: /.*/i
  });
    window.ViewImage && ViewImage.init('.content img');
</script>

<script src="https://wananaiko.design/memos/assets/js/bibi.js"></script>
<script src="https://wananaiko.design/memos/assets/js/marked.min.js"></script>
<script src="https://fastly.jsdelivr.net/gh/Tokinx/ViewImage/view-image.min.js"></script>
<script src="https://fastly.jsdelivr.net/gh/Tokinx/Lately/lately.min.js"></script>