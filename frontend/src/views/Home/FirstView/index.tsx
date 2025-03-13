import { ReactNode, useEffect, useState } from "react";

import CacheImage from "@/utils/CacheImage";

import landingImage from "@/assets/home/landing.defer.webp";
import LandingImageBlur from "@/assets/home/landing.blur.webp";

import style from "./index.module.scss";
import { Link } from "react-router-dom";

export default function FirstView(): ReactNode {
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setOpen(true);
    }, []);

    return <div className={style.firstView}>
        <CacheImage src={landingImage} blurImage={LandingImageBlur} />
        <div className={style.title} data-open={open}>
            <div className={style.border} />
            <div className={style.titleBox}>
                <h1>HSPC 2025</h1>
                <h2>國立成功大學暑期高中生程式設計邀請賽</h2>
                <div className={style.info}>
                    <div>初賽：2024-04-14</div>
                    <div>決賽：2024-07-26</div>
                    <div>地點：國立成功大學 資訊工程學系</div>
                </div>
            </div>
        </div>
        <Link
            to="/about"
            className={`ms ${style.scrollDown}`}
            onClick={() => window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth"
            })}
            replace
        >stat_minus_2</Link>
    </div>
}