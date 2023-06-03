var bbMemo = {
  memos: "https://memo.wananaiko.com/",
  limit: "15",
  creatorId: "1",
  domId: "#bber",
};
if ("undefined" != typeof bbMemos)
  for (var key in bbMemos) bbMemos[key] && (bbMemo[key] = bbMemos[key]);
function loadCssCode(e) {
  var t = document.createElement("style");
  (t.type = "text/css"),
    (t.rel = "stylesheet"),
    t.appendChild(document.createTextNode(e)),
    document.getElementsByTagName("head")[0].appendChild(t);
}
var btn,
  allCSS = `
img {
    max-height: 70vh !important;
    max-width: 100% !important;
}
.memo-container {
    position: relative;
    margin-bottom: var(--gap);
    padding: calc(var(--gap) * 0.9) var(--gap) calc(var(--gap) * 0.7);
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    border-radius: var(--radius);
    background: var(--code-bg);
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: box-shadow,transform;
    transition-property: box-shadow,transform;
}
.memo-container img {
    padding-top: 1em;
    max-height: 40vh !important;
    padding-bottom: 0.5em;
}
.memo-container > .memo-header {
    margin-top: 0.5em;
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.875rem;
    --tw-text-opacity: 1;
    color: var(--tertiary);
}
.memo-content-text > p:last-child {
    margin-bottom: 0;
}
.memo-content-text > p {
    margin-bottom: 0.25rem;
    height: auto;
    min-height: 24px;
    width: 100%;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    font-size: 16px;
    line-height: 1.8rem;
}
.memo-content-text a.link {
    color: var(--content);
    transition: .5s;
}
.memo-content-text a.link:hover {
    color: var(--content);
    box-shadow: 0 1px 0 var(--content);
}
.memo-content-text .img {
    padding-top: 1rem !important;
    display: block;
    max-width: 100%;
    cursor: pointer;
    border-radius: 0.25rem;
    height: auto;
    vertical-align: middle;
    webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    background-color: transparent;
    outline: 2px solid transparent;
    outline-offset: 2px;
    -webkit-tap-highlight-color: transparent;
}
.memo-content-text pre {
    background-color: var(--border)!important;
    padding: 1em 1em;
    font-size: 85%;
    border-radius: 6px;
    color: var(--secondary);
    white-space: pre-wrap;
    overflow-wrap: break-word;
}

.memo-content-text code {
    // background-color: var(--code-bg);
    padding: 0.2em 0.4em;
    font-size: 85%;
    border-radius: 3px;
    color: var(--secondary);
    white-space: pre-wrap;
    overflow-wrap: break-word;

}
.memo-content-text pre p {
    display: inline-block;
}
.memo-content-text pre p:empty {
    display: none;
}
button.load-btn.button-load {
    background-color: #ffffff;
    color: rgb(150,150,150);
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: box-shadow,transform;
    transition-property: box-shadow,transform;
    padding: 10px 24px;
}
button.load-btn.button-load:active,
button.load-btn.button-load:focus,
button.load-btn.button-load:hover {
    -webkit-transform: scale(1.01);
    transform: scale(1.01);
}
.memo-content-text a {
    color: var(--content);
    padding-bottom: 2px;
    box-shadow: var(--link-underline-shadow);
    transition: .5s !important;
}
ul.bb-list-ul {
    padding-left: 0;
}
span.tag-span {
    background-color: rgb(198 239 239 / 90%);
    padding: 2.5px 5px;
    border-radius: 3px;
    font-size: small;
    line-height: 1.5;
    color: #0e7e9d;
    margin-right: 4px;
}
.memo-nums {
    font-size: 1rem;
}
.meta-item {
    display: inline-block;
    color: var(--tertiary);
}
.meta-item * {
    color: var(--tertiary);
}
.memo-content-text a:hover {
    color: var(--content);
    box-shadow: 0 1px 0 var(--content);
    padding-bottom: 2px;
}
.bb-load {
    display: flex;
    flex-direction: column;
}
`,
  limit = (loadCssCode(allCSS), bbMemo.limit),
  memos = bbMemo.memos,
  page = 1,
  offset = 0,
  nextLength = 0,
  nextDom = "",
  bbDom = document.querySelector(bbMemo.domId),
  load =
    '<div class="bb-load"><button class="load-btn button-load">加载中……</button></div>';
function getFirstList() {
  bbDom.insertAdjacentHTML("afterend", load);
  var e =
    memos +
    "api/memo?creatorId=" +
    bbMemo.creatorId +
    "&rowStatus=NORMAL&l" +
    "imit=" +
    limit;
  fetch(e)
    .then((e) => e.json())
    .then((e) => {
      updateHTMl(e.data),
        e.data.length < limit
          ? document.querySelector("button.button-load").remove()
          : ((offset = limit * (++page - 1)), getNextList());
    });
}

// 获取下一页
function getNextList() {
  var e =
    memos +
    "api/memo?creatorId=" +
    bbMemo.creatorId +
    "&rowStatus=NORMAL&l" +
    "imit=" +
    limit +
    "&offset=" +
    offset;
  fetch(e)
    .then((e) => e.json())
    .then((e) => {
      (nextDom = e.data),
        (nextLength = nextDom.length),
        (offset = limit * (++page - 1)),
        nextLength < 1 && document.querySelector("button.button-load").remove();
    });
}
// 加载下一页
function meNums() {
  var e = memos + "api/memo/stats?creatorId=" + bbMemo.creatorId;
  fetch(e)
    .then((e) => e.json())
    .then((e) => {
      e.data && (document.getElementById("memonums").innerHTML = e.data.length);
    });
}

// 生成HTML
function updateHTMl(e) {
  var t = "",
    o = /#([^\s#]+?) /g,
    r =
      /<a\shref="https:\/\/www\.bilibili\.com\/video\/((av[\d]{1,10})|(BV([\w]{10})))\/?">.*<\/a>/g;
  marked.setOptions({
    breaks: !0,
    smartypants: !0,
    langPrefix: "language-",
  });
  for (var a = 0; a < e.length; a++) {
    var i = e[a].content.replace(o, "<span class='tag-span'>#$1</span> "),
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
        var n = e[a].resourceList, s = "", l = "", m = 0, d = 0;
        d < n.length;
        d++
      ) {
        var c = n[d].type.slice(0, 5);
        "image" == c &&
          ((s +=
            '<figure class="gallery-thumbnail"><img class="img thumbnail-image" src="' +
            memos +
            "o/r/" +
            n[d].id +
            "/" +
            n[d].filename +
            '"/></figure>'),
          (m += 1)),
          "image" !== c &&
            (l +=
              '<a target="_blank" rel="noreferrer" href="' +
              memos +
              "o/r/" +
              n[d].id +
              "/" +
              n[d].filename +
              '">' +
              n[d].filename +
              "</a>");
      }
      s &&
        (i +=
          '<div class="resimg ' +
          (1 !== m ? "grid grid-" + m : "") +
          '">' +
          s +
          "</div></div>"),
        l && (i += '<p class="datasource">' + l + "</p>");
    }
    t +=
      '<div class="memo-container">' +
      '<div class="memo-content-wrapper memo-content"><div class="memo-content-text">' +
      i +
      "</div>" +
      "</div>" +
      '<div class="memo-header"><span>Aiko&nbsp;发布于&nbsp;</span><span class="date">' +
        moment(1e3 * e[a].updatedTs).format('YYYY-MM-DD HH:mm:ss') +

      "</span></div>" +
      "</div>";
  }

  // 生成内容
  bbDom.insertAdjacentHTML(
    "beforeend",
    "<section class='bb-timeline'><ul class='bb-list-ul'>" +
      t +
      "</ul></section>"
  ),
    fetchDB(),
    (document.querySelector("button.button-load").textContent = "加载更多");
}

// 从数据库中加载更多的内容
function fetchDB() {}

bbDom &&
  (getFirstList(),
  meNums(),
  (btn = document.querySelector("button.button-load")).addEventListener(
    "click",
    function () {
      (btn.textContent = "加载中……"),
        updateHTMl(nextDom),
        nextLength < limit
          ? document.querySelector("button.button-load").remove()
          : getNextList();
    }
  ));
// 自动加载更多的内容
window.addEventListener("scroll", function () {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  var scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight;
  var clientHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    var btn = document.querySelector("button.button-load");
    btn && btn.click();
  }
});

// 如何修改上面的代码，将lately.js修改为使用moment.js显示时间。
// 1. 将lately.js中的Lately.format(1e3 * e[a].updatedTs)修改为moment(1e3 * e[a].updatedTs).format('YYYY-MM-DD HH:mm:ss')
// 2. 在index.html中引入moment.js
