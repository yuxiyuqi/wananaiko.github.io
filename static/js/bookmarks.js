const PER_PAGE = 50;
const RAINDROP_TOKEN = "d7e078a0-3f49-4419-981a-8695c399b0d8"; // 替换为您的实际访问令牌
const RAINDROP_COLLECTION = "34199304"; // 替换为您的实际集合 ID

async function fetchBookmarks(page = 0) {
  const req = await fetch(
    `https://api.raindrop.io/rest/v1/raindrops/${RAINDROP_COLLECTION}?sort=-created&search=type:link&perpage=${PER_PAGE}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${RAINDROP_TOKEN}`,
      },
    }
  );

  if (!req.ok) {
    console.error("Failed to fetch bookmarks:", req.statusText);
    return [];
  }

  const data = await req.json();

  return data?.items.map((item) => ({
    _id: item._id,
    title: item.title,
    link: item.link,
    cover: item.cover,
    tags: item.tags,
    created: new Date(item.created * 1000).toLocaleDateString(),
    lastUpdate: new Date(item.lastUpdate * 1000).toLocaleDateString(),
  }));
}

async function displayBookmarks() {
  const bookmarksContainer = document.getElementById("bookmarks-container");
  const bookmarks = await fetchBookmarks();

  bookmarks.forEach((bookmark) => {
    const bookmarkElem = document.createElement("div");
    bookmarkElem.innerHTML = `
        <h3>${bookmark.title}</h3>
        <a href="${bookmark.link}">${bookmark.link}</a>
        <p>Created: ${bookmark.created}</p>
        <p>Last Update: ${bookmark.lastUpdate}</p>
      `;
    bookmarksContainer.appendChild(bookmarkElem);
  });
}

displayBookmarks();
