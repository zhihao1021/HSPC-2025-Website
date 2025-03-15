import { ReactNode } from "react";

import style from "./index.module.scss";

type propsType = Readonly<{
    show: boolean
}>;

export default function Loading(props: propsType): ReactNode {
    const {
        show
    } = props;

    return <div className={style.loading} data-show={show}>
        <div className={style.box}>
            {
                Array.from(Array(5)).map((_, index) => <div key={index}></div>)
            }
        </div>
    </div>
}