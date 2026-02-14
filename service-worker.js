self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("iman-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/renungan.html",
        "/kesaksian.html",
        "/lagu.html",
        "/style.css"
      ]);
    })
  );
});
