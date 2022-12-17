---
title: "memos"
layout: "memos"
markup: HTML
--- 

<!DOCTYPE html>
<body>
    <header>
        <div class="menu">
            <div class="title">Memos</a>
        </div>
    </header>
<!-- 修改自己的 Memos 设置 -->
<script type="text/javascript">
    var memos = {
        host: 'https://memo.wananaiko.com/', //修改为自己部署 Memos 的网址，末尾有 / 斜杠
        limit: '20', //默认每次显示 10条
        creatorId: '1', //默认为 101用户 https://memo.wananaiko.com/u/1
        domId: '', //默认为 #memos
        username: 'wananaiko', //发布者 ID 自定义
        name: 'Aiko', //发布者全称自定义
    }
</script>

<script src="/memos/assets/js/view-image.min.js"></script>
<script>
    window.ViewImage && ViewImage.init('.content img');
</script>
</body>