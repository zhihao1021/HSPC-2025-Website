const storeName = "HSPC2025";
let buildTime = "";
let baseURL = "";
let origin = "";
let dbCache = [];
let loaded = false;

async function getDBValue(key) {
    return new Promise((resolve,) => {
        const openDB = indexedDB.open("localforage");
        openDB.onsuccess = event => {
            try {
                const db = event.target.result;
                const store = db.transaction([storeName]).objectStore(storeName);
                const request = key ? store.get(key) : store.getAllKeys();
                request.onsuccess = event => resolve(event.target.result);
                request.onerror = () => resolve(null);
            } catch {
                resolve(null);
            }
        };
        openDB.onerror = () => resolve(null);
    })
}

self.addEventListener("install", event => {
    event.waitUntil((async () => {
        const buildTime = (await getDBValue("BUILD_TIME")).toString();
        const baseURL = await getDBValue("BASE_URL");

        const cache = await caches.open(buildTime);
        await cache.add(baseURL);
    })())
    self.skipWaiting();

    console.debug("Service Worker Installed.");
});

self.addEventListener("activate", event => {
    clients.claim();
    event.waitUntil((async () => {
        buildTime = (await getDBValue("BUILD_TIME")).toString();
        baseURL = await getDBValue("BASE_URL");
        origin = await getDBValue("ORIGIN");
        dbCache = await getDBValue();
        loaded = true;

        const keys = await caches.keys();
        await Promise.all(keys.filter(v => v !== buildTime).map(key => caches.delete(key)))

        const cache = await caches.open(buildTime);
        if (!(await cache.match(baseURL)))
            await cache.add(baseURL);
    })());

    console.debug("Service Worker Activated.");
});

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = request.url;

    console.debug("Fetch:", request);

    if (request.destination === "document") event.respondWith(fetch(request).catch(() => caches.match(baseURL)))
    else if (
        request.destination === "font" ||
        url.startsWith("https://fonts.googleapis.com") ||
        (origin && !origin.includes("localhost") &&
            url.startsWith(origin) &&
            (url.includes("index") || url.includes(".js") || url.includes(".css") || url.includes("favicon")))
    ) event.respondWith((async () => {
        try {
            caches.match(request).then(result => {
                if (buildTime && !result) caches.open(buildTime).then(cache => cache.add(url));
            })
            return await fetch(request);
        } catch {
            return await caches.match(request);
        }
    })())
    else return event
});
