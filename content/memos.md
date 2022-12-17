-- -title: "memos"
layout: "memos"
markup: HTML
-- - 

<!DOCTYPE html>
<body>
    <header>
        <div class="menu">
            <div class="title">Memos</a>
        </div>

    <div class='theme-toggle'>🌓</div>

</header>

<section id="main" class="container">
    <h1>Memos Top</h1>

    <blockquote>
        <p>Je
            <del>memos</del>, donc je suis -
            <em>René Descartes fans</em>
        </p>
    </blockquote>

    <div class="total">Total
        <span id="total">0</span>
        Memos 🎉
    </div>

    <div id="memos" class="memos">
        <!-- Memos Container -->
    </div>

</section>

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