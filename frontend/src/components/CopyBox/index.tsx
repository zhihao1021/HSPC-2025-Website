import { ReactNode, useCallback, useState } from "react";

import style from "./index.module.scss";

type propsType = Readonly<{
    value: string,
    className?: string
}>;

export default function CopyBox(props: propsType): ReactNode {
    const {
        value,
        className
    } = props;

    const [lastCopy, setLastCopy] = useState<number>(0);

    const copyValue = useCallback(() => {
        navigator.clipboard.writeText(value).then(
            () => setLastCopy(Date.now())
        ).catch(
            () => setLastCopy(-1)
        ).finally(
            () => setTimeout(() => setLastCopy(v => v - 1), 1500)
        )
    }, [value]);

    return <div
        className={`${style.copy} ${className}`}
        onClick={copyValue}
        data-success={Date.now() - lastCopy < 1500}
        data-fail={lastCopy === -1}
    >
        {value}
        <div className={`${style.icon} ms`}>
            <div className={`${style.copyIcon} ms`}>content_copy</div>
            <div className={`${style.doneIcon} ms`}>done</div>
            <div className={`${style.errorIcon} ms`}>warning</div>
        </div>
    </div>;
}