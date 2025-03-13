import { ReactNode } from "react";

import style from "./index.module.scss";

const pdfLink = "https://hspc.csie.ncku.edu.tw/static/pdf/2024第十屆國立成功大學暑期高中生程式設計邀請賽.pdf";

export default function Info(): ReactNode {
    return <div className={style.info}>
        <div className={style.box}>
            <h2>比賽說明</h2>
            <object
                data={pdfLink}
                type="application/pdf"
            >
                <a
                    href={pdfLink}
                    target="_blank"
                    referrerPolicy="no-referrer"
                >PDF Link</a>
            </object>
        </div>
    </div>;
};
