import {
    ChangeEvent,
    CSSProperties,
    HTMLInputTypeAttribute,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import CopyBox from "@/components/CopyBox";
import InputBox from "@/components/InputBox";

import style from "./components.module.scss";

type defaultType = Readonly<{
    name: string,
    value: string,
    className?: string
    smallest?: boolean
}>;

function BaseField(props: {
    name: string,
    className?: string,
    children: ReactNode,
    smallest?: boolean
}): ReactNode {
    const {
        name,
        className,
        children,
        smallest
    } = props

    return <div className={`${style.field} ${className}`} >
        <div className={style.name} data-small={name.length > 5} data-smallest={smallest ?? false}>{name}</div>
        {children}
    </div >;
}

export function TextInputField(props: {
    setValue: (value: string) => void,
    type?: HTMLInputTypeAttribute,
    placeholder?: string,
} & defaultType): ReactNode {
    const {
        name,
        value,
        setValue,
        type,
        placeholder,
        className
    } = props;

    return <BaseField name={name} className={className}>
        <InputBox
            className={style.value}
            placeholder={placeholder}
            value={value}
            setValue={setValue}
            type={type}
        />
    </BaseField>;
}

export function CopyField(props: defaultType): ReactNode {
    const {
        name,
        value,
        className
    } = props;

    return <BaseField name={name} className={className}>
        <CopyBox
            value={value}
            className={`${style.value} ${style.copy}`}
        />
    </BaseField>;
}

export function StatusField(props: {
    status: boolean | null,
} & defaultType): ReactNode {
    const {
        status,
        name,
        value,
        className,
        smallest
    } = props;

    return <BaseField name={name} className={className} smallest={smallest}>
        <div
            className={style.value}
            data-status={status ?? "null"}
        >{value}</div>
    </BaseField>;
}

export function RadioField(props: {
    name: string,
    className?: string,
    options: Array<string>,
    selectOption: number | string,
    setOption: (index: number) => void
}): ReactNode {
    const {
        name,
        className,
        options,
        selectOption,
        setOption
    } = props;

    return <BaseField name={name} className={className}>
        <div
            className={`${style.value} ${style.radioOptions}`}
            style={{
                "--options": options.length
            } as CSSProperties}
        >
            {
                options.map((value, index) => <button
                    key={value}
                    className={style.radioOption}
                    data-selected={selectOption === (typeof selectOption === "number" ? index : value)}
                    onClick={() => setOption(index)}
                >{value}</button>)
            }
        </div>
    </BaseField>;
}

export function DropdownListField(props: {
    name: string,
    className?: string,
    defaultOption: string,
    options: Array<string>,
    selectOption: number | string,
    setOption: (index: number) => void
}): ReactNode {
    const {
        name,
        className,
        defaultOption,
        options,
        selectOption,
        setOption
    } = props;

    const ref = useRef<HTMLLabelElement>(null);
    const [open, setOpen] = useState<boolean>(false);

    const autoClose = useCallback((event: MouseEvent) => {
        const root = ref.current;
        if (root === null || event.target === null) return;
        if (root.contains(event.target as HTMLElement)) return;

        setOpen(false);
    }, []);

    useEffect(() => document.addEventListener("click", autoClose), []);
    useEffect(() => () => document.removeEventListener("click", autoClose), []);

    return <BaseField name={name} className={className}>
        <label ref={ref} className={`${style.dropDown} ${style.value} ms-p`}>
            <input
                type="checkbox"
                checked={open}
                onChange={e => setOpen(e.target.checked)}
            />
            <div
                className={style.dropDownDisplay}
            >{selectOption || defaultOption}</div>
            <div className={style.mask}>
                <div className={style.dropDownOptions}>
                    {
                        options.map((value, index) => <div
                            key={value}
                            className={style.dropDownOption}
                            onClick={() => setOption(index)}
                        >{value}</div>)
                    }
                </div>
            </div>
        </label>
    </BaseField>
}

export function ImageField(props: {
    name: string,
    className?: string
    defaultString: string,
    changeString: string,
    image: Blob | null,
    setImage: (file: Blob) => void
}): ReactNode {
    const {
        name,
        className,
        defaultString,
        changeString,
        image,
        setImage
    } = props;

    const ref = useRef<HTMLInputElement>(null);

    const [dataSrc, setDataSrc] = useState<string | null>(null);

    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files === null || files.length === 0) return;

        const file = files[0];
        setImage(file);
        if (ref.current) ref.current.value = "";
    }, []);

    useEffect(() => {
        if (image === null) return setDataSrc(null);
        const fileReader = new FileReader();
        fileReader.onload = () => setDataSrc(fileReader.result as string);
        fileReader.readAsDataURL(image);
    }, [image]);

    return <BaseField name={name} className={className}>
        <label className={`${style.uploadImage} ${style.value}`}>
            <input
                ref={ref} type="file"
                accept="image/*" onChange={onChange}
            />
            {
                dataSrc ? <>
                    <img src={dataSrc} />
                    <div className={style.uploadCover}>
                        <span className="ms">refresh</span>
                        <span>{changeString}</span>
                    </div>
                </> : <div className={style.noUploadImage}>{defaultString}</div>
            }
        </label>
    </BaseField>;
}

export function ToolBar(props: {
    result?: { success: boolean, message: string },
    canSubmit: boolean,
    submit: () => void,
    className?: string
}): ReactNode {
    const {
        result,
        canSubmit,
        submit,
        className
    } = props;

    return <div className={`${style.toolBar} ${className}`}>
        <div
            className={style.message}
            data-status={result?.success}
        >{result?.message}</div>
        <button
            className={style.submit}
            onClick={submit}
            disabled={!canSubmit}
        ><span>儲存資料</span></button>
    </div>;
}
