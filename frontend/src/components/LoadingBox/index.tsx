import { ReactNode } from "react";

import style from "./index.module.scss";

type propsType = Readonly<{
    show: boolean,
    className?: string
}>;

export default function LoadingBox(props: propsType): ReactNode {
    const { show, className } = props;

    return <div className={`${style.loading} ${className}`} data-show={show}>{
        Array.from(Array(5)).map((_, index) => <div key={index} />)
    }</div>;
}