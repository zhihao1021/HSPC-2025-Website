import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FirstView from "./FirstView";
import About from "./About";
import Info from "./Info";
import Traffic from "./Traffic";

import style from "./index.module.scss";

const pages = [
    "/", "/about", "/info", "/traffic"
];

export default function HomePage(): ReactNode {
    const [scrollEvent, setScrollEvent] = useState<undefined | (() => void)>();

    const routeLocation = useLocation();
    const navigator = useNavigate();

    useEffect(() => {
        const path = routeLocation.pathname;
        if (pages.includes(path))
            scroll({ top: innerHeight * pages.indexOf(path), behavior: "smooth" });
        else navigator("/");
    }, [routeLocation, navigator]);

    useEffect(() => {
        setScrollEvent(() => {
            const event = () => {
                let prefix = import.meta.env.BASE_URL;
                if (prefix.endsWith("/")) prefix = prefix.slice(0, prefix.length - 1);

                const targetPageIndex = Math.floor((scrollY + 0.4 * innerHeight) / innerHeight);
                const targetPath = pages[targetPageIndex] ?? pages[targetPageIndex - 1];
                if (targetPath === undefined || location.pathname === `${prefix}${targetPath}`) return;
                history.replaceState({}, "", `${prefix}${targetPath}`);
            };
            window.addEventListener("scrollend", event);
        });

    }, []);

    useEffect(() => () => {
        if (scrollEvent) window.removeEventListener("scrollend", scrollEvent);
    }, [scrollEvent]);

    return <div className={style.homePage}>
        <FirstView />
        <About />
        <Info />
        <Traffic />
    </div>
}