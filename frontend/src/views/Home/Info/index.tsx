import { ReactNode } from "react";

import style from "./index.module.scss";

export default function Info(): ReactNode {
    return <div className={style.info}>
        <div className={style.box}>
            <h2>比賽說明</h2>
            <object
                data={`${import.meta.env.BASE_URL}/2025 第 11 屆國立成功大學暑期高中生程式設計邀請賽0309.pdf`}
                type="application/pdf"
            >
                <a
                    href={`${import.meta.env.BASE_URL}/2025 第 11 屆國立成功大學暑期高中生程式設計邀請賽0309.pdf`}
                    target="_blank"
                    referrerPolicy="no-referrer"
                >PDF Link</a>
            </object>
        </div>
    </div>;
};
