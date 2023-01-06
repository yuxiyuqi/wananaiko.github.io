var bbMemo = {
    memos: "https://memo.wananaiko.com/",
    limit: "15",
    creatorId: "1",
    domId: "#bber"
};
if ("undefined" != typeof bbMemos) 
    for (var key in bbMemos) 
        bbMemos[key] && (bbMemo[key] = bbMemos[key]);
function loadCssCode(e) {
    var t = document.createElement("style");
    t.type = "text/css",
    t.rel = "stylesheet",
    t.appendChild(document.createTextNode(e)),
    document
        .getElementsByTagName("head")[0]
        .appendChild(t)
}
var btn,
    allCSS = "img{padding-top:1rem;max-height:70vh !important;}.memo-container {position: relative;margin-bottom: var(--gap);padding: var(--gap);display: flex;width: 100%;flex-direction: column;align-items: flex-start;justify-content: flex-start;border-radius: var(--radius);border: 1px solid var(--border);background: var(--entry);-webkit-transform: perspective(1px) translateZ(0);transform: perspective(1px) translateZ(0);-webkit-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-transition-property: box-shadow,transform;transition-property: box-shadow,transform;}.memo-container>.memo-header{margin-bottom:0.5rem;display:fle" +
            "x;width:100%;flex-direction:row;align-items:center;justify-content:flex-start;" +
            "font-size:.875rem;--tw-text-opacity:1;color:rgb(156 163 175 / var(--tw-text-op" +
            "acity));}.memo-content-text>p:last-child{margin-bottom:0;}.memo-content-text>p" +
            "{margin-bottom:0.25rem;height:auto;min-height:24px;width:100%;white-space:pre-" +
            "wrap;overflow-wrap:break-word;font-size:1rem;line-height:1.8rem;}.memo-content" +
            "-text a.link{color:var(--post-link-color);}.memo-content-text a.link:hover{col" +
            "or:var(--link-hover-color);}.memo-content-text .img{padding-top:1rem !important;display:block;max-width:10" +
            "0%;cursor:pointer;border-radius:0.25rem;height:auto;vertical-align:middle;webk" +
            "it-user-select:none;-moz-user-select:none;user-select:none;background-color:tr" +
            "ansparent;outline:2px solid transparent;outline-offset:2px;-webkit-tap-highlig" +
            "ht-color:transparent;}code{color:rgb(170,170,170);}.memo-content-text pre p{di" +
            "splay:inline-block;}.memo-content-text pre p:empty{display:none;}button.load-b" +
            "tn.button-load{background-color:#ffffff;color:rgb(150,150,150);border:1px soli" +
            "d #f0f0f0;border-radius:10px;-webkit-transform:perspective(1px) translateZ(0);" +
            "transform:perspective(1px) translateZ(0);-webkit-transition-duration:0.3s;tran" +
            "sition-duration:0.3s;-webkit-transition-property:box-shadow,transform;transiti" +
            "on-property:box-shadow,transform;padding:10px 24px;}button.load-btn.button-loa" +
            "d:hover,button.load-btn.button-load:focus,button.load-btn.button-load:active{-" +
            "webkit-transform:scale(1.01);transform:scale(1.01);}.memo-content-text a {colo" +
            "r: var(--primary);padding-bottom:2px;box-shadow: var(--link-underline-shadow);transition: var(--link-transition);}ul.bb-list-ul{padding-left: 0px;}span.tag-span {background-color: #876fd626;padding: 2.5px 5px;border-radius: 3px;font-size: small;line-height: 1.5;color: #876fd6;}code{direction:ltr;font-size:1rem;}.memo-nums{font-size: 1rem;}.memo-content-text a:hover{color: var(--link-hover-color);box-shadow: var(--link-hover-underline-shadow);padding-bottom: 2px;}",
    limit = (loadCssCode(allCSS), bbMemo.limit),
    memos = bbMemo.memos,
    page = 1,
    offset = 0,
    nextLength = 0,
    nextDom = "",
    bbDom = document.querySelector(bbMemo.domId),
    load = '<div class="bb-load"><button class="load-btn button-load">加载中……</button></div>';
function getFirstList() {
    bbDom.insertAdjacentHTML("afterend", load);
    var e = memos + "api/memo?creatorId=" + bbMemo.creatorId + "&rowStatus=NORMAL&l" +
            "imit=" + limit;
    fetch(e)
        .then(e => e.json())
        .then(e => {
            updateHTMl(e.data),
            e.data.length < limit
                ? document
                    .querySelector("button.button-load")
                    .remove()
                : (offset = limit * (++page - 1), getNextList())
        })
}
function getNextList() {
    var e = memos + "api/memo?creatorId=" + bbMemo.creatorId + "&rowStatus=NORMAL&l" +
            "imit=" + limit + "&offset=" + offset;
    fetch(e)
        .then(e => e.json())
        .then(e => {
            nextDom = e.data,
            nextLength = nextDom.length,
            offset = limit * (++page - 1),
            nextLength < 1 && document
                .querySelector("button.button-load")
                .remove()
        })
}
function meNums() {
    var e = memos + "api/memo/amount?creatorId=" + bbMemo.creatorId;
    fetch(e)
        .then(e => e.json())
        .then(e => {
            e.data && (document.getElementById("memonums").innerHTML = e.data)
        })
}
function updateHTMl(e) {
    var t = "",
        o = /#([^\s#]+?) /g,
        r = /<a\shref="https:\/\/www\.bilibili\.com\/video\/((av[\d]{1,10})|(BV([\w]{10})))\/?">.*<\/a>/g;
    marked.setOptions({
        breaks: !0,
        smartypants: !0,
        langPrefix: "language-"
    });
    for (var a = 0; a < e.length; a++) {
        var i = e[a]
                .content
                .replace(o, "<span class='tag-span'>#$1</span> "),
            i = marked
                .parse(i)
                .replace(
                    r,
                    "<div class='video-wrapper'><iframe src='//player.bilibili.com/player.html?bvid" +
                            "=$1&as_wide=1&high_quality=1&danmaku=0' scrolling='no' border='0' frameborder=" +
                            "'no' framespacing='0' allowfullscreen='true' style='position:absolute;height:1" +
                            "00%;width:100%;'></iframe></div>"
                );
        if (e[a].resourceList && 0 < e[a].resourceList.length) {
            for (
                var n = e[a].resourceList,
                s = "",
                l = "",
                m = 0,
                d = 0;
                d < n.length;
                d++
            ) {
                var c = n[d]
                    .type
                    .slice(0, 5);
                "image" == c && (
                    s += '<figure class="gallery-thumbnail"><img class="img thumbnail-image" src="' +
                                memos + "o/r/" + n[d].id + "/" + n[d].filename + '"/></figure>',
                    m += 1
                ),
                "image" !== c && (
                    l += '<a target="_blank" rel="noreferrer" href="' + memos + "o/r/" + n[d].id + "/" +
                        n[d].filename + '">' + n[d].filename + "</a>"
                )
            }
            s && (i += '<div class="resimg ' + (
                1 !== m
                    ? "grid grid-" + m
                    : ""
            ) + '">' + s + "</div></div>"),
            l && (i += '<p class="datasource">' + l + "</p>")
        }
        t += '<div class="memo-container"><div class="memo-header"><span class="date">' +
                new Date(1e3 * e[a].updatedTs).toLocaleString() + '</span></div><div class="mem' +
                'o-content-wrapper memo-content"><div class="memo-content-text">' + i + "</div>" +
                "</div></div>"
    }
    bbDom.insertAdjacentHTML(
        "beforeend",
        "<section class='bb-timeline'><ul class='bb-list-ul'>" + t +
                "</ul></section>"
    ),
    fetchDB(),
    document
        .querySelector("button.button-load")
        .textContent = "加载更多"
}
function fetchDB() {
    var e = "https://douban.edui.fun/",
        t = document.querySelectorAll(".bb-timeline a[href*='douban.com/subject/']") || "";
    if (t) 
        for (var o = 0; o < t.length; o++) {
            var r,
                a,
                i = (_this = t[o]).href,
                n = /^https\:\/\/(movie|book)\.douban\.com\/subject\/([0-9]+)\/?/,
                s = i.replace(n, "$1"),
                n = i
                    .replace(n, "$2")
                    .toString();
            "movie" == s
                ? (
                    r = "movie" + n,
                    a = e + "movies/" + n,
                    null == localStorage.getItem(r) || "undefined" == localStorage.getItem(r)
                        ? fetch(a).then(e => e.json()).then(e => {
                            var t = "movies" + e.sid,
                                o = "https://movie.douban.com/subject/" + e.sid + "/";
                            localStorage.setItem(t, JSON.stringify(e)),
                            movieShow(o, t)
                        })
                        : movieShow(i, r)
                )
                : "book" == s && (
                    r = "book" + n,
                    a = e + "v2/book/id/" + n,
                    null == localStorage.getItem(r) || "undefined" == localStorage.getItem(r)
                        ? fetch(a).then(e => e.json()).then(e => {
                            var t = "book" + e.id,
                                o = "https://book.douban.com/subject/" + e.id + "/";
                            localStorage.setItem(t, JSON.stringify(e)),
                            bookShow(o, t)
                        })
                        : bookShow(i, r)
                )
        }
    }
function movieShow(e, t) {
    var t = localStorage.getItem(t),
        t = JSON.parse(t),
        o = Math.ceil(t.rating),
        o = "<div class='post-preview'><div class='post-preview--meta'><div class='post-pre" +
                "view--middle'><h4 class='post-preview--title'><a target='_blank' href='" + e +
                "'>《" + t.name +
                "》</a></h4><div class='rating'><div class='rating-star allstar" + o + "'></div>" +
                "<div class='rating-average'>" + t.rating + "</div></div><time class='post-prev" +
                "iew--date'>导演：" + t.director + " / 类型：" + t.genre + " / " + t.year + "</time><" +
                "section style='max-height:75px;overflow:hidden;' class='post-preview--excerpt'" +
                ">" + t
            .intro
            .replace(/\s*/g, "") + "</section></div></div><img referrer-policy='no-referrer" +
                    "' loading='lazy' class='post-preview--image' src=" + t.img + "></div>",
        t = document.createElement("div"),
        e = document.querySelector(".bb-timeline a[href='" + e + "']");
    e
        .parentNode
        .replaceChild(t, e),
    t.innerHTML = o
}
function bookShow(e, t) {
    var t = localStorage.getItem(t),
        t = JSON.parse(t),
        o = Math.ceil(t.rating.average),
        o = "<div class='post-preview'><div class='post-preview--meta'><div class='post-pre" +
                "view--middle'><h4 class='post-preview--title'><a target='_blank' href='" + e +
                "'>《" + t.title +
                "》</a></h4><div class='rating'><div class='rating-star allstar" + o + "'></div>" +
                "<div class='rating-average'>" + t.rating.average + "</div></div><time class='p" +
                "ost-preview--date'>作者：" + t.author + " </time><section style='max-height:75px;" +
                "overflow:hidden;' class='post-preview--excerpt'>" + t
            .summary
            .replace(/\s*/g, "") + "</section></div></div><img referrer-policy='no-referrer" +
                    "' loading='lazy' class='post-preview--image' src=" + t.images.medium +
                    "></div>",
        t = document.createElement("div"),
        e = document.querySelector(".bb-timeline a[href='" + e + "']");
    e
        .parentNode
        .replaceChild(t, e),
    t.innerHTML = o
}
bbDom && (
    getFirstList(),
    meNums(),
    (btn = document.querySelector("button.button-load")).addEventListener("click", function () {
        btn.textContent = "加载中……",
        updateHTMl(nextDom),
        nextLength < limit
            ? document
                .querySelector("button.button-load")
                .remove()
            : getNextList()
    })
);
// Images lightbox
window.ViewImage && ViewImage.init('.container img');

// 插入 html
function updateHTMl(data) {
    var memoResult = "", resultAll = "";

    // 解析 TAG 标签，添加样式
    const TAG_REG = /#([^\s#]+?) /g;

    // 解析 BiliBili
    const BILIBILI_REG = /<a\shref="https:\/\/www\.bilibili\.com\/video\/((av[\d]{1,10})|(BV([\w]{10})))\/?">.*<\/a>/g;
    // 解析网易云音乐
    const NETEASE_MUSIC_REG = /<a\shref="https:\/\/music\.163\.com\/.*id=([0-9]+)".*?>.*<\/a>/g;
    // 解析 QQ 音乐
    const QQMUSIC_REG = /<a\shref="https\:\/\/y\.qq\.com\/.*(\/[0-9a-zA-Z]+)(\.html)?".*?>.*?<\/a>/g;
    // 解析腾讯视频
    const QQVIDEO_REG = /<a\shref="https:\/\/v\.qq\.com\/.*\/([a-z|A-Z|0-9]+)\.html".*?>.*<\/a>/g;
    // 解析 Spotify
    const SPOTIFY_REG = /<a\shref="https:\/\/open\.spotify\.com\/(track|album)\/([\s\S]+)".*?>.*<\/a>/g;
    // 解析优酷视频
    const YOUKU_REG = /<a\shref="https:\/\/v\.youku\.com\/.*\/id_([a-z|A-Z|0-9|==]+)\.html".*?>.*<\/a>/g;
    //解析 Youtube
    const YOUTUBE_REG = /<a\shref="https:\/\/www\.youtube\.com\/watch\?v\=([a-z|A-Z|0-9]{11})\".*?>.*<\/a>/g;

    // Marked Options
    marked.setOptions({
        breaks: true,
        smartypants: true,
        langPrefix: 'language-',
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
    });

    // Memos Content
    for (var i = 0; i < data.length; i++) {
        var memoContREG = data[i].content
            .replace(TAG_REG, "<span class='tag-span'><a rel='noopener noreferrer' href='#'>#$1</a></span> ")

        // For CJK language users
        // 用 PanguJS 自动处理中英文混合排版
        // 在 index.html 引入 JS：<script type="text/javascript" src="assets/js/pangu.min.js?v=4.0.7"></script>
        // 把下面的 memoContREG = marked.parse(memoContREG) 改为：memoContREG = marked.parse(pangu.spacing(memoContREG))

        memoContREG = marked.parse(memoContREG)
            .replace(BILIBILI_REG, "<div class='video-wrapper'><iframe src='//player.bilibili.com/player.html?bvid=$1&as_wide=1&high_quality=1&danmaku=0' scrolling='no' border='0' frameborder='no' framespacing='0' allowfullscreen='true' style='position:absolute;height:100%;width:100%;'></iframe></div>")
            .replace(YOUTUBE_REG, "<div class='video-wrapper'><iframe src='https://www.youtube.com/embed/$1' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='YouTube Video'></iframe></div>")
            .replace(NETEASE_MUSIC_REG, "<meting-js auto='https://music.163.com/#/song?id=$1'></meting-js>")
            .replace(QQMUSIC_REG, "<meting-js auto='https://y.qq.com/n/yqq/song$1.html'></meting-js>")
            .replace(QQVIDEO_REG, "<div class='video-wrapper'><iframe src='//v.qq.com/iframe/player.html?vid=$1' allowFullScreen='true' frameborder='no'></iframe></div>")
            .replace(SPOTIFY_REG, "<div class='spotify-wrapper'><iframe style='border-radius:12px' src='https://open.spotify.com/embed/$1/$2?utm_source=generator&theme=0' width='100%' frameBorder='0' allowfullscreen='' allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' loading='lazy'></iframe></div>")
            .replace(YOUKU_REG, "<div class='video-wrapper'><iframe src='https://player.youku.com/embed/$1' frameborder=0 'allowfullscreen'></iframe></div>")
            .replace(YOUTUBE_REG, "<div class='video-wrapper'><iframe src='https://www.youtube.com/embed/$1' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='YouTube Video'></iframe></div>")

        // 解析内置资源文件 
        if (data[i].resourceList && data[i].resourceList.length > 0) {
            var resourceList = data[i].resourceList;
            var imgUrl = '', resUrl = '', resImgLength = 0;
            for (var j = 0; j < resourceList.length; j++) {
                var resType = resourceList[j].type.slice(0, 5);
                if (resType == 'image') {
                    imgUrl += '<img loading="lazy" src="' + memos + 'o/r/' + resourceList[j].id + '/' + resourceList[j].filename + '"/>'
                    resImgLength = resImgLength + 1
                }
                if (resType !== 'image') {
                    resUrl += '<a target="_blank" rel="noreferrer" href="' + memos + 'o/r/' + resourceList[j].id + '/' + resourceList[j].filename + '">' + resourceList[j].filename + '</a>'
                }
            }
            if (imgUrl) {
                var resImgGrid = ""
                if (resImgLength !== 1) { var resImgGrid = "grid grid-" + resImgLength }
                memoContREG += '<div class="resimg ' + resImgGrid + '">' + imgUrl + '</div>'
            }
            if (resUrl) {
                memoContREG += '<p class="datasource">' + resUrl + '</p>'
            }
        }
        memoResult += '<li class="timeline"><div class="memos__content"><div class="memos__text"><div class="memos__userinfo"><div>' + memo.name + '</div><div><svg viewBox="0 0 24 24" aria-label="认证账号" class="memos__verify"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg></div><div class="memos__id">@' + memo.username + '</div></div><p>' + memoContREG + '</p></div><div class="memos__meta"><small class="memos__date">' + moment(data[i].createdTs * 1000).twitter() + ' • 来自「<a href="' + memo.host + 'm/' + data[i].id + '" target="_blank">Memos</a>」</small></div></div></li>'
    }
    var memoBefore = '<ul class="">'
    var memoAfter = '</ul>'
    resultAll = memoBefore + memoResult + memoAfter
    memoDom.insertAdjacentHTML('beforeend', resultAll);
    //取消这行注释解析豆瓣电影和豆瓣阅读
    // fetchDB()
    document.querySelector('button.button-load').textContent = '加载更多';
}
// Memos End