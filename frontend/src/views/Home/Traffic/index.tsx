import { ReactNode } from "react";

import style from "./index.module.scss";

export default function Traffic(): ReactNode {
    return <div className={style.traffic}>
        <h2>交通資訊</h2>
        <h3>自行開車</h3>
        <h4>南下</h4>
        <div>走中山高速公路南下 → 於永康交流道下高速公路 → 走中正南路(西向)往台南市區 → 轉中華東路 → 達小東路口右轉(西向)直走便可抵成大校區。</div>
        <h4>北上</h4>
        <div>走中山高速公路北上 → 於仁德交流道下高速公路 → 走東門路(西向)往台南市區 → 直走遇長榮路右轉(北向)可抵成功校區</div>
        <h3>大眾交通</h3>
        <div>
            台南火車站下車後，往後站方向，出口正對面即為大學路，大學路直走左手邊可見光復校門口。<br />
            搭乘客運在台南火車站前站下車者， 可經由火車站天橋前往後站，後站出口左手側即為成大光復校區。
        </div>
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7345.443950583078!2d120.220603!3d22.997249!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e769337a9d2a5%3A0x908f765e123a6d7!2z5ZyL56uL5oiQ5Yqf5aSn5a246LOH6KiK5bel56iL5a2457O7!5e0!3m2!1szh-TW!2stw!4v1741660824764!5m2!1szh-TW!2stw"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        />
    </div>
}