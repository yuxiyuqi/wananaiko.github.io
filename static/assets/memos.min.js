// Memos Start
var memo = {
  host: "https://memo.wananaiko.com/",
  limit: "10",
  creatorId: "1",
  domId: "#memos",
  username: "Aiko",
  name: "Administrator",
};
if (typeof memos !== "undefined") {
  for (var key in memos) {
    if (memos[key]) {
      memo[key] = memos[key];
    }
  }
}

var limit = memo.limit;
var memos = memo.host;
var memoUrl =
  memos + "api/memo?creatorId=" + memo.creatorId + "&rowStatus=NORMAL";
var page = 1,
  offset = 0,
  nextLength = 0,
  nextDom = "";
var memoDom = document.querySelector(memo.domId);
var load = '<button class="load-btn button-load">努力加载中……</button>';
if (memoDom) {
  memoDom.insertAdjacentHTML("afterend", load);
  getFirstList(); // 首次加载数据
  var btn = document.querySelector("button.button-load");
  btn.addEventListener("click", function () {
    btn.textContent = "努力加载中……";
    updateHTMl(nextDom);
    if (nextLength < limit) {
      // 返回数据条数小于限制条数，隐藏
      document.querySelector("button.button-load").remove();
      return;
    }
    getNextList();
  });
}

function getFirstList() {
  var memoUrl_first = memoUrl + "&limit=" + limit;
  fetch(memoUrl_first)
    .then((res) => res.json())
    .then((resdata) => {
      updateHTMl(resdata.data);
      var nowLength = resdata.data.length;
      if (nowLength < limit) {
        // 返回数据条数小于 limit 则直接移除“加载更多”按钮，中断预加载
        document.querySelector("button.button-load").remove();
        return;
      }
      page++;
      offset = limit * (page - 1);
      getNextList();
    });
}
// 预加载下一页数据
function getNextList() {
  var memoUrl_next = memoUrl + "&limit=" + limit + "&offset=" + offset;
  fetch(memoUrl_next)
    .then((res) => res.json())
    .then((resdata) => {
      nextDom = resdata.data;
      nextLength = nextDom.length;
      page++;
      offset = limit * (page - 1);
      if (nextLength < 1) {
        // 返回数据条数为 0 ，隐藏
        document.querySelector("button.button-load").remove();
        return;
      }
    });
}
// 插入 html
function updateHTMl(data) {
  var memoResult = "",
    resultAll = "";

  // 解析 TAG 标签，添加样式
  const TAG_REG = /#([^\s#]+?) /g;

  // 解析 BiliBili
  const BILIBILI_REG =
    /<a\shref="https:\/\/www\.bilibili\.com\/video\/((av[\d]{1,10})|(BV([\w]{10})))\/?">.*<\/a>/g;
  // 解析网易云音乐
  const NETEASE_MUSIC_REG =
    /<a\shref="https:\/\/music\.163\.com\/.*id=([0-9]+)".*?>.*<\/a>/g;
  // 解析 QQ 音乐
  const QQMUSIC_REG =
    /<a\shref="https\:\/\/y\.qq\.com\/.*(\/[0-9a-zA-Z]+)(\.html)?".*?>.*?<\/a>/g;
  // 解析腾讯视频
  const QQVIDEO_REG =
    /<a\shref="https:\/\/v\.qq\.com\/.*\/([a-z|A-Z|0-9]+)\.html".*?>.*<\/a>/g;
  // 解析 Spotify
  const SPOTIFY_REG =
    /<a\shref="https:\/\/open\.spotify\.com\/(track|album)\/([\s\S]+)".*?>.*<\/a>/g;
  // 解析优酷视频
  const YOUKU_REG =
    /<a\shref="https:\/\/v\.youku\.com\/.*\/id_([a-z|A-Z|0-9|==]+)\.html".*?>.*<\/a>/g;
  //解析 Youtube
  const YOUTUBE_REG =
    /<a\shref="https:\/\/www\.youtube\.com\/watch\?v\=([a-z|A-Z|0-9]{11})\".*?>.*<\/a>/g;

  // Marked Options
  marked.setOptions({
    breaks: true,
    smartypants: true,
    langPrefix: "language-",
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  });

  // Memos Content
  for (var i = 0; i < data.length; i++) {
    var memoContREG = data[i].content.replace(
      TAG_REG,
      "<span class='tag-span'><a rel='noopener noreferrer' href='#'>#$1</a></span> "
    );

    // For CJK language users
    // 用 PanguJS 自动处理中英文混合排版
    // 在 index.html 引入 JS：<script type="text/javascript" src="assets/js/pangu.min.js?v=4.0.7"></script>
    // 把下面的 memoContREG = marked.parse(memoContREG) 改为：memoContREG = marked.parse(pangu.spacing(memoContREG))

    memoContREG = marked
      .parse(memoContREG)
      .replace(
        BILIBILI_REG,
        "<div class='video-wrapper'><iframe src='//player.bilibili.com/player.html?bvid=$1&as_wide=1&high_quality=1&danmaku=0' scrolling='no' border='0' frameborder='no' framespacing='0' allowfullscreen='true' style='position:absolute;height:100%;width:100%;'></iframe></div>"
      )
      .replace(
        YOUTUBE_REG,
        "<div class='video-wrapper'><iframe src='https://www.youtube.com/embed/$1' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='YouTube Video'></iframe></div>"
      )
      .replace(
        NETEASE_MUSIC_REG,
        "<meting-js auto='https://music.163.com/#/song?id=$1'></meting-js>"
      )
      .replace(
        QQMUSIC_REG,
        "<meting-js auto='https://y.qq.com/n/yqq/song$1.html'></meting-js>"
      )
      .replace(
        QQVIDEO_REG,
        "<div class='video-wrapper'><iframe src='//v.qq.com/iframe/player.html?vid=$1' allowFullScreen='true' frameborder='no'></iframe></div>"
      )
      .replace(
        SPOTIFY_REG,
        "<div class='spotify-wrapper'><iframe style='border-radius:12px' src='https://open.spotify.com/embed/$1/$2?utm_source=generator&theme=0' width='100%' frameBorder='0' allowfullscreen='' allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' loading='lazy'></iframe></div>"
      )
      .replace(
        YOUKU_REG,
        "<div class='video-wrapper'><iframe src='https://player.youku.com/embed/$1' frameborder=0 'allowfullscreen'></iframe></div>"
      )
      .replace(
        YOUTUBE_REG,
        "<div class='video-wrapper'><iframe src='https://www.youtube.com/embed/$1' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='YouTube Video'></iframe></div>"
      );

    // 解析内置资源文件
    if (data[i].resourceList && data[i].resourceList.length > 0) {
      var resourceList = data[i].resourceList;
      var imgUrl = "",
        resUrl = "",
        resImgLength = 0;
      for (var j = 0; j < resourceList.length; j++) {
        var resType = resourceList[j].type.slice(0, 5);
        var resexlink = resourceList[j].externalLink;
        var resLink = "";
        if (resexlink) {
          resLink = resexlink;
        } else {
          resLink =
            memos +
            "o/r/" +
            resourceList[j].id +
            "/" +
            resourceList[j].filename;
        }
        if (resType == "image") {
          imgUrl += '<img loading="lazy" src="    ' + resLink + '"/>';
          resImgLength = resImgLength + 1;
        }
        if (resType !== "image") {
          resUrl +=
            '<a target="_blank" rel="noreferrer" href="' +
            resLink +
            '">' +
            resourceList[j].filename +
            "</a>";
        }
      }
      if (imgUrl) {
        var resImgGrid = "";
        if (resImgLength !== 1) {
          var resImgGrid = "grid grid-" + resImgLength;
        }
        memoContREG +=
          '<div class="resimg ' + resImgGrid + '">' + imgUrl + "</div>";
      }
      if (resUrl) {
        memoContREG += '<p class="datasource">' + resUrl + "</p>";
      }
    }
    memoResult +=
      '<li class="timeline"><div class="memos__content"><div class="memos__text"><div class="memos__userinfo"><div>' +
      memo.name +
      '</div><div><svg viewBox="0 0 24 24" aria-label="认证账号" class="memos__verify"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg></div><div class="memos__id">@' +
      memo.username +
      "</div></div><p>" +
      memoContREG +
      '</p></div><div class="memos__meta"><small class="memos__date">' +
      moment(data[i].createdTs * 1000).twitter() +
      ' • 来自「<a href="' +
      memo.host +
      "m/" +
      data[i].id +
      '" target="_blank">Memos</a>」</small></div></div></li>';
  }
  var memoBefore = '<ul class="">';
  var memoAfter = "</ul>";
  resultAll = memoBefore + memoResult + memoAfter;
  memoDom.insertAdjacentHTML("beforeend", resultAll);
  //取消这行注释解析豆瓣电影和豆瓣阅读
  // fetchDB()
  document.querySelector("button.button-load").textContent = "加载更多";
}
// Memos End

// 解析豆瓣 Start
// 文章内显示豆瓣条目 https://immmmm.com/post-show-douban-item/
// 解析豆瓣必须要API，请找朋友要权限，或自己按 https://github.com/eallion/douban-api-rs 这个架设 API，非常简单，资源消耗很少
// 已内置样式，修改 API 即可使用
function fetchDB() {
  var dbAPI = "https://api.example.com/"; // 修改为自己的 API
  var dbA =
    document.querySelectorAll(
      ".timeline a[href*='douban.com/subject/']:not([rel='noreferrer'])"
    ) || "";
  if (dbA) {
    for (var i = 0; i < dbA.length; i++) {
      _this = dbA[i];
      var dbHref = _this.href;
      var db_reg =
        /^https\:\/\/(movie|book)\.douban\.com\/subject\/([0-9]+)\/?/;
      var db_type = dbHref.replace(db_reg, "$1");
      var db_id = dbHref.replace(db_reg, "$2").toString();
      if (db_type == "movie") {
        var this_item = "movie" + db_id;
        var url = dbAPI + "movies/" + db_id;
        if (
          localStorage.getItem(this_item) == null ||
          localStorage.getItem(this_item) == "undefined"
        ) {
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              let fetch_item = "movies" + data.sid;
              let fetch_href =
                "https://movie.douban.com/subject/" + data.sid + "/";
              localStorage.setItem(fetch_item, JSON.stringify(data));
              movieShow(fetch_href, fetch_item);
            });
        } else {
          movieShow(dbHref, this_item);
        }
      } else if (db_type == "book") {
        var this_item = "book" + db_id;
        var url = dbAPI + "v2/book/id/" + db_id;
        if (
          localStorage.getItem(this_item) == null ||
          localStorage.getItem(this_item) == "undefined"
        ) {
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              let fetch_item = "book" + data.id;
              let fetch_href =
                "https://book.douban.com/subject/" + data.id + "/";
              localStorage.setItem(fetch_item, JSON.stringify(data));
              bookShow(fetch_href, fetch_item);
            });
        } else {
          bookShow(dbHref, this_item);
        }
      }
    } // for end
  }
}

function movieShow(fetch_href, fetch_item) {
  var storage = localStorage.getItem(fetch_item);
  var data = JSON.parse(storage);
  var db_star = Math.ceil(data.rating);
  var db_html =
    "<div class='post-preview'><div class='post-preview--meta'><div class='post-preview--middle'><h4 class='post-preview--title'><a target='_blank' rel='noreferrer' href='" +
    fetch_href +
    "'>《" +
    data.name +
    "》</a></h4><div class='rating'><div class='rating-star allstar" +
    db_star +
    "'></div><div class='rating-average'>" +
    data.rating +
    "</div></div><time class='post-preview--date'>导演：" +
    data.director +
    " / 类型：" +
    data.genre +
    " / " +
    data.year +
    "</time><section class='post-preview--excerpt'>" +
    data.intro.replace(/\s*/g, "") +
    "</section></div></div><img referrer-policy='no-referrer' loading='lazy' class='post-preview--image' src=" +
    data.img +
    "></div>";
  var db_div = document.createElement("div");
  var qs_href = ".timeline a[href='" + fetch_href + "']";
  var qs_dom = document.querySelector(qs_href);
  qs_dom.parentNode.replaceChild(db_div, qs_dom);
  db_div.innerHTML = db_html;
}

function bookShow(fetch_href, fetch_item) {
  var storage = localStorage.getItem(fetch_item);
  var data = JSON.parse(storage);
  var db_star = Math.ceil(data.rating.average);
  var db_html =
    "<div class='post-preview'><div class='post-preview--meta'><div class='post-preview--middle'><h4 class='post-preview--title'><a target='_blank' rel='noreferrer' href='" +
    fetch_href +
    "'>《" +
    data.title +
    "》</a></h4><div class='rating'><div class='rating-star allstar" +
    db_star +
    "'></div><div class='rating-average'>" +
    data.rating.average +
    "</div></div><time class='post-preview--date'>作者：" +
    data.author +
    " </time><section class='post-preview--excerpt'>" +
    data.summary.replace(/\s*/g, "") +
    "</section></div></div><img referrer-policy='no-referrer' loading='lazy' class='post-preview--image' src=" +
    data.images.medium +
    "></div>";
  var db_div = document.createElement("div");
  var qs_href = ".timeline a[href='" + fetch_href + "']";
  var qs_dom = document.querySelector(qs_href);
  qs_dom.parentNode.replaceChild(db_div, qs_dom);
  db_div.innerHTML = db_html;
}
// 解析豆瓣 End

// Images lightbox
window.ViewImage && ViewImage.init(".container img");

// Memos Total Start
// Get Memos total count
function getTotal() {
  var totalUrl = memos + "api/memo/stats?creatorId=" + memo.creatorId;
  fetch(totalUrl)
    .then((res) => res.json())
    .then((resdata) => {
      if (resdata.data) {
        var allnums = resdata.data.length;
        var memosCount = document.getElementById("total");
        memosCount.innerHTML = allnums;
      }
    })
    .catch((err) => {
      // Do something for an error here
    });
}
window.onload = getTotal();
// Memos Total End
