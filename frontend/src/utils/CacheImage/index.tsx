import localforage from "localforage";
import {
    DetailedHTMLProps,
    ImgHTMLAttributes,
    ReactNode,
    useEffect,
    useMemo,
    useState
} from "react";

import { cachedList, loading, fullLoading } from "../cacheAll";

import style from "./index.module.scss";

const createdImage: { [key: string]: string } = {};

type propsType = {
    blurImage?: string,
} & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

function getCacheSrc(src: string, callback?: (v: string) => void, isSrc?: boolean) {
    if (loading || (isSrc && fullLoading)) return setTimeout(() => getCacheSrc(src, callback, isSrc), 100);

    if (!cachedList.includes(src)) createdImage[src] = src;
    if (createdImage[src] !== undefined) {
        if (callback) callback(createdImage[src]);
        return;
    }

    localforage.getItem<Blob>(src).then(value => {
        if (value) {
            const objectUrl = URL.createObjectURL(value);
            createdImage[src] = objectUrl
            if (callback) callback(objectUrl);
        }
        else setTimeout(() => getCacheSrc(src, callback, isSrc), 100);
    })
}

export default function CacheImage(props: propsType): ReactNode {
    const {
        src,
        blurImage,
    } = props;

    const [dataSrc, setDataSrc] = useState<string | undefined>();
    const [dataBlurSrc, setDataBlurSrc] = useState<string | undefined>();

    const newProps = useMemo(() => {
        const replaceSrc = createdImage[props.src ?? ""] ?? dataSrc ?? dataBlurSrc ?? undefined;
        const result = Object.assign(
            Object.fromEntries(Object.entries(props)),
            {
                className: [props.className, style.cacheImage].join(" ").trim(),
                src: cachedList.includes(props.src ?? "") ? replaceSrc : fullLoading ? "" : props.src,
            }
        );
        delete result["blurImage"];

        return result;
    }, [props, dataSrc, dataBlurSrc]);

    useEffect(() => {
        if (src) getCacheSrc(src.split("?")[0], setDataSrc, true);
    }, [src]);

    useEffect(() => {
        if (blurImage) getCacheSrc(blurImage.split("?")[0], setDataBlurSrc);
    }, [blurImage]);

    if (props.blurImage) return <img
        {...newProps}
        data-loaded={dataSrc?.startsWith("blob:") || dataSrc?.startsWith("data:") || dataSrc !== undefined}
        loading="lazy"
        style={dataBlurSrc ? {
            backgroundImage: `url(${dataBlurSrc})`,
        } : undefined}
    />
    return <img {...newProps} />
}