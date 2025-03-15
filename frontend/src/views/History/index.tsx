import { ReactNode } from "react";

import style from "./index.module.scss";

const historyData = {
    "2013": ["A", "B", "C", "D", "E", "F", "G", "H"],
    "2014": ["A", "B", "C", "D", "E", "F", "G", "H"],
    "2015": ["A", "B", "C", "D", "E", "F", "G", "H"],
    "2016": ["A", "B", "C", "D", "E", "F", "G", "H"],
    "2017": ["A", "B", "C", "D", "E", "F", "G", "H"],
    "2022": ["A", "B", "C", "D", "E", "F", "G", "H"],
}

export default function HistoryPage(): ReactNode {
    return <div className={style.historyPage}>
        {
            Object.entries(historyData).map(([key, value]) => <div
                key={key}
                className={style.row}
            >
                <div className={style.key}>
                    <span>{key}</span>
                </div>
                <div className={style.mask}>
                    <div className={style.box}>
                        {
                            value.map(v => <a
                                key={v}
                                href={`${import.meta.env.BASE_URL}history/${key}/${v}.pdf`}
                                target="_blank"
                            >
                                <span className="ms">description</span>
                                <span>{`${v}.pdf`}</span>
                            </a>)
                        }
                    </div>
                </div>
            </div>)
        }
    </div>;
}