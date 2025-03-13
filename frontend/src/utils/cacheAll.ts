import axios from "axios";
import localforage from "localforage";

import aboutData from "@/data/about.json";

interface Module {
    default: string,
};

const request = axios.create();
request.interceptors.request.use(config => {
    const bsaeUrl = import.meta.env.BASE_URL;
    if (!config.url?.startsWith(bsaeUrl)) config.baseURL = bsaeUrl;

    return config;
})

const includeList: Array<string> = [];
includeList.push(...aboutData.map(d => [
    d.imageUrl.replace("webp", "defer.webp"),
    d.imageUrl.replace("webp", "blur.webp"),
]).reduce((v, v2) => [...v, ...v2]));

const cachedList: Array<string> = [];
var loading = true;
var fullLoading = true;

export default async function cacheAll(setProgress?: (v: number) => void) {
    const buildTime = await localforage.getItem<string>("BUILD_TIME");
    const fullLoaded = await localforage.getItem<boolean>("LOADED");
    const newRelease = buildTime !== BUILD_TIME || import.meta.env.DEV;
    const needUpdate = newRelease || !fullLoaded;

    if (newRelease) {
        await localforage.clear();
        await localforage.setItem("BUILD_TIME", BUILD_TIME);
        await localforage.setItem("BASE_URL", import.meta.env.BASE_URL);
        await localforage.setItem("ORIGIN", window.location.origin);
    }
    const urls = Object.values(import.meta.glob("../assets/**/*"));

    const progressValue = Array.from(Array(urls.length + includeList.length)).map(() => 0);
    const updateProgress = () => {
        if (!setProgress) return;
        const value = progressValue.reduce((v, v2) => v + v2) / (urls.length + includeList.length);
        if (value < 1) setTimeout(updateProgress, 100);
        setProgress(value);
    }
    updateProgress();

    const deferUrls: Array<string> = [];
    async function job(index: number, importFunc?: () => Promise<Module>, url?: string) {
        const src = importFunc ? (await importFunc()).default.split("?")[0] : url;
        const requestSrc = src?.includes("?") ? src : `${src}?${BUILD_TIME}`;

        if (src !== undefined && !src.startsWith("data:")) {
            cachedList.push(src);

            if (needUpdate) {
                if (src.includes(".defer")) deferUrls.push(src);
                else {
                    try {
                        const response = await request.get(requestSrc, {
                            responseType: "blob",
                            onDownloadProgress: event => progressValue[index] = event.progress ?? 0,
                        });
                        await localforage.setItem(src, response.data);
                    }
                    catch { }
                }
            }
        }

        progressValue[index] = 1;
    }

    if (urls.length > 0 || includeList.length > 0) await Promise.all([
        ...urls.map((v, index) => job(index, v as () => Promise<Module>)),
        ...includeList.map((v, index) => job(urls.length + index, undefined, v)),
    ])

    Promise.all(deferUrls.map(src => request.get(
        src?.includes("?") ? src : `${src}?${BUILD_TIME}`,
        { responseType: "blob" }
    ).then(response => localforage.setItem(src, response.data)))).then(() => {
        localforage.setItem("LOADED", true);
        fullLoading = false;
    }).then(() => {
        if (window.navigator.serviceWorker) {
            const BASE_URL = `${import.meta.env.BASE_URL}${import.meta.env.BASE_URL.endsWith("/") ? "" : "/"}`;
            window.navigator.serviceWorker.register(
                `${BASE_URL}sw.js?${BUILD_TIME}`,
                { scope: BASE_URL }
            );
        }

    });

    loading = false;
}

export { cachedList, loading, fullLoading };