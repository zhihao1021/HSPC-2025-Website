import localforage from "localforage";
import {
    DetailedHTMLProps,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState,
    VideoHTMLAttributes
} from "react";

import { cachedList } from "../cacheAll";

const createdVideo: { [key: string]: string } = {};

type propsType = {
    pause?: number,
} & DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;

function getCacheSrc(src: string, callback?: (v: string) => void) {
    if (!cachedList.includes(src)) createdVideo[src] = src;
    if (createdVideo[src] !== undefined) {
        if (callback) callback(createdVideo[src]);
        return;
    }

    localforage.getItem<Blob>(src).then(value => {
        if (value) {
            const objectUrl = URL.createObjectURL(value);
            createdVideo[src] = objectUrl
            if (callback) callback(objectUrl);
        }
        else setTimeout(() => getCacheSrc(src, callback), 100);
    })
}

export default function CacheVideo(props: propsType): ReactNode {
    const {
        src,
        pause
    } = props;

    const ref = useRef<HTMLVideoElement>(null);

    const [newSrc, setNewSrc] = useState<string | undefined>();

    useEffect(() => {
        if (src) getCacheSrc(src, setNewSrc)
    }, [src]);

    useEffect(() => {
        if (pause === undefined) return;
        if (ref.current?.readyState) {
            if (pause) ref.current?.pause();
            else ref.current?.play();
        }
    }, [pause, ref]);

    const newProps = useMemo(() => {
        const result = Object.assign({}, props);
        result["src"] = newSrc ?? "";
        return result;
    }, [props, newSrc]);

    return <video
        ref={ref}
        onCanPlay={(props.autoPlay && !pause) ? () => ref.current?.play() : undefined}
        {...newProps}
    />
}