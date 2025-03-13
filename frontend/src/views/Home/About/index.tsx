import { ReactNode, useState } from "react";

import aboutData from "@/data/about.json";

import style from "./index.module.scss";
import CacheImage from "@/utils/CacheImage";

export default function About(): ReactNode {
    const [selected, setSelected] = useState<number>(1);

    return <div className={style.about}>
        <h2>關於競賽</h2>
        <div className={style.content}>
            <div className={style.turntable} data-sel={selected}>
                {
                    aboutData.map((data, index) => <div
                        key={data.name}
                        className={style.option}
                        onClick={() => setSelected(index)}
                        data-selected={index === selected}
                    >{data.name}</div>)
                }
            </div>
            <div className={style.box}>
                <div className={style.imageBox}>
                    {
                        aboutData.map((data, index) => <CacheImage
                            key={data.name}
                            src={data.imageUrl.replace("webp", "defer.webp")}
                            blurImage={data.imageUrl.replace("webp", "blur.webp")}
                            data-show={index > selected ? 1 : index < selected ? -1 : 0}
                        />)
                    }
                </div>
                <div className={style.titleBox}>
                    {aboutData.map((data, index) => <h3
                        key={data.name}
                        data-show={index > selected ? 1 : index < selected ? -1 : 0}
                    >{data.name}</h3>)}
                </div>
                <div className={style.contextBox}>
                    {aboutData.map((data, index) => <div
                        key={data.name}
                        data-show={index > selected ? 1 : index < selected ? -1 : 0}
                    >{data.description}</div>)}
                </div>
            </div>
        </div>
    </div>;
};
