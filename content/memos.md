---
title: "memos"
layout: "memos"
type: 'memos'
--- 
<meta name="referrer" content="no-referrer">
<link href="/memos/assets/css/highlight.github.min.css" rel="stylesheet" type="text/css">
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

<!-- 设置memos部分的所有链接在新标签页打开 -->
<script type="text/javascript">
    window.onload = function() {
  var links = document.querySelectorAll("#bber a");
  for (var i = 0; i < links.length; i++) {
    links[i].target = "_blank";
  }
};
</script>


<script type="text/javascript">
  // Custom parser function
  function parseCode(code) {
    // Do something with the code
    return code;
  }

  var preElements = document.getElementsByTagName("pre");
  for (var i = 0; i < preElements.length; i++) {
    var code = preElements[i].textContent;
    var parsedCode = parseCode(code);
    preElements[i].innerHTML = parsedCode;
    highlightElement(preElements[i]);
  }
</script>


<script type="text/javascript" src="/memos/assets/js/view-image.min.js"></script>
<script type="text/javascript" src="/memos/assets/js/bibi.js"></script>
<script type="text/javascript" src="/memos/assets/js/marked.min.js"></script>
<script type="text/javascript" src="/memos/assets/js/highlight.min.js"></script>
<script type="text/javascript" src="https://fastly.jsdelivr.net/gh/Tokinx/Lately/lately.min.js"></script>