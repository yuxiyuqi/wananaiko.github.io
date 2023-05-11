---
title: "书签"
date: 2021-12-25T10:33:08+08:00
draft: false
layout: single
---

<div id="bookmarks_container"></div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const PER_PAGE = 50;

    async function fetchBookmarks(page = 0) {
      const raindropUrl = `https://api.raindrop.io/v1/raindrops/34199304?sort=-created&search=type:link&perpage=${PER_PAGE}&page=${page}&Authorization=Bearer%20d7e078a0-3f49-4419-981a-8695c399b0d8`;
      const req = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(raindropUrl)}`
      );

      if (!req.ok) {
        console.error("Failed to fetch bookmarks:", req.statusText);
        return [];
      }

      const data = await req.json();
      const parsedData = JSON.parse(data.contents);

      return parsedData?.items.map((item) => ({
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
      const bookmarksContainer = document.getElementById("bookmarks_container");
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
  });
</script>
