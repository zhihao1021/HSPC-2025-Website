import { ChangeEvent, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

import userDataContext from "@/context/userData";

import style from "./index.module.scss";
import MemberData, { MemberUpdate } from "@/schemas/memberData";

const CityList = [
    "臺北市",
    "新北市",
    "桃園市",
    "臺中市",
    "臺南市",
    "高雄市",
    "新竹縣",
    "苗栗縣",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "屏東縣",
    "宜蘭縣",
    "花蓮縣",
    "臺東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
    "基隆市",
    "新竹市",
    "嘉義市"
];
const LunchList = ["葷", "素"];

type propsType = Readonly<{
    memberData: MemberData,
    sidImageSrc: string | null,
    updateValue: (key: keyof MemberUpdate) => (
        v: ChangeEvent<HTMLInputElement> | string
    ) => void,
    updateSidImage: (file: File) => void,
    update: () => Promise<void>,
}>;

export default function PersonalData(props: propsType): ReactNode {
    const {
        memberData,
        sidImageSrc,
        updateValue,
        updateSidImage,
        update,
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const [lastCopy, setLastCopy] = useState<number>(0);
    const [updateResult, setUpdateResult] = useState<{
        success: boolean,
        message: string
    } | undefined>()

    const userData = useContext(userDataContext);

    const copyDiscordId = useCallback(() => {
        if (!userData) return;
        navigator.clipboard.writeText(userData.discord_id).then(() => {
            setLastCopy(Date.now())
        }).catch(() => {
            setLastCopy(-1);
        }).finally(() => {
            setTimeout(() => setLastCopy(v => v - 1), 1500);
        })
    }, [userData]);

    const submit = useCallback(() => {
        update().then(() => setUpdateResult({
            success: true,
            message: "更新成功"
        })).catch((message: string) => setUpdateResult({
            success: false,
            message: message
        }));
    }, [update]);

    useEffect(() => {
        const element = inputRef.current;
        if (element) element.value = "";
    }, [sidImageSrc]);

    return <div className={style.personalData}>
        <div className={style.info}>
            <div className={`${style.key} ${style.did}`}>Discord ID</div>
            <div
                className={`${style.value} ${style.copy} ms-p`}
                onClick={copyDiscordId}
                data-copy={Date.now() - lastCopy < 1500}
            >{userData?.discord_id}</div>
        </div>
        <div className={style.info}>
            <div className={style.key}>驗證狀態</div>
            <div
                className={style.value}
                data-verify={memberData.verify}
            >{memberData.verify ? "已驗證" : "未驗證"}</div>
        </div>
        <div className={style.field}>
            <div className={style.key}>姓名</div>
            <div className={style.inputBox}><input
                value={memberData.name} placeholder="姓名"
                onChange={updateValue("name")}
            /></div>
        </div>
        <div className={style.field}>
            <div className={style.key}>學校</div>
            <div className={style.inputBox}><input
                value={memberData.school} placeholder="學校"
                onChange={updateValue("school")}
            /></div>
        </div>
        <div className={style.field}>
            <div className={style.key}>午餐</div>
            <div className={style.buttons}>
                {
                    LunchList.map(lunch => <button
                        key={lunch}
                        onClick={() => updateValue("lunch")(lunch)}
                        data-selected={lunch === memberData.lunch}
                    >{lunch}</button>)
                }
            </div>
        </div>
        <div className={style.field}>
            <div className={style.key}>縣市</div>
            <label className={`${style.dropDown} ms-p`}>
                <input type="checkbox" />
                <div className={style.value}>{memberData.city || "請選擇縣市"}</div>
                <div className={style.mask}>
                    <div className={style.options}>
                        {
                            CityList.map(city => <div
                                key={city}
                                className={style.option}
                                onClick={() => updateValue("city")(city)}
                            >{city}</div>)
                        }
                    </div>
                </div>
            </label>
        </div>
        <div className={style.field}>
            <div className={style.key}>學生證</div>
            {
                sidImageSrc ? <img
                    src={sidImageSrc}
                /> : <div>尚未上傳</div>
            }
        </div>
        <div className={style.toolBar}>
            <div
                className={style.message}
                data-status={updateResult?.success}
            >{updateResult?.message}</div>
            <label className={style.uploadSid}>
                <span>變更學生證</span>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={ev => {
                        const files = ev.target.files;
                        if (files === null) return;
                        if (files[0]) updateSidImage(files[0]);
                    }}
                />
            </label>
            <button
                className={style.submit}
                onClick={submit}
                disabled={!memberData || Object.values(memberData).reduce(
                    (v, v2) => v || v2 === "", false
                )}
            ><span>更新資料</span></button>
        </div>
    </div >
}