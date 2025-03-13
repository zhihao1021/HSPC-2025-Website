import { HTMLInputTypeAttribute, ReactNode, RefObject } from "react";

import style from "./index.module.scss"

type propsType = Readonly<{
    ref?: RefObject<HTMLInputElement>,
    className?: string,
    placeholder?: string,
    value?: string
    type?: HTMLInputTypeAttribute,
    setValue?: (value: string) => void
}>;

export default function InputBox(props: propsType): ReactNode {
    const {
        ref,
        className,
        placeholder,
        value,
        type,
        setValue
    } = props;

    return <div className={`${style.inputBox} ${className}`}><input
        ref={ref}
        value={value} placeholder={placeholder}
        onChange={setValue ? (e => setValue(e.target.value)) : undefined}
        type={type}
    /></div>;
}