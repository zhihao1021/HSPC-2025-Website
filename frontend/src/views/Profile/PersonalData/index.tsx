import {
    ChangeEvent,
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useState
} from "react";

import userDataContext from "@/context/userData";

import MemberData, { MemberUpdate } from "@/schemas/memberData";

import {
    CopyField,
    DropdownListField,
    ImageField,
    RadioField,
    StatusField,
    TextInputField,
    ToolBar
} from "../components";

import style from "./index.module.scss";

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
    sidImage: Blob | null,
    updateValue: (key: keyof MemberUpdate) => (
        v: ChangeEvent<HTMLInputElement> | string
    ) => void,
    updateSidImage: (file: Blob) => void,
    update: () => Promise<void>,
    updateData: () => void,
    setLoading: Dispatch<SetStateAction<boolean>>
}>;

export default function PersonalData(props: propsType): ReactNode {
    const {
        memberData,
        sidImage,
        updateValue,
        updateSidImage,
        update,
        updateData,
        setLoading
    } = props;

    const [updateResult, setUpdateResult] = useState<{
        success: boolean,
        message: string
    } | undefined>()

    const userData = useContext(userDataContext);

    const submit = useCallback(() => {
        setLoading(true);

        update().then(() => setUpdateResult({
            success: true,
            message: "更新成功"
        })).catch((message: string) => setUpdateResult({
            success: false,
            message: message
        })).finally(() => {
            updateData()
            setTimeout(() => setUpdateResult(undefined), 5000)
        });
    }, [update]);

    return <div className={style.personalData}>
        <CopyField name="Discord ID" value={userData?.discord_id ?? ""} />
        <StatusField
            status={memberData.verify}
            name="驗證狀態"
            value={memberData.verify === null ? "驗證中" : memberData.verify ? "已驗證" : "驗證失敗"}
        />
        <TextInputField
            name="姓名"
            placeholder="姓名"
            value={memberData.name}
            setValue={updateValue("name")}
        />
        <TextInputField
            name="學校"
            placeholder="學校"
            value={memberData.school}
            setValue={updateValue("school")}
        />
        <RadioField
            name="午餐"
            options={LunchList}
            selectOption={memberData.lunch}
            setOption={index => updateValue("lunch")(LunchList[index])}
        />
        <DropdownListField
            defaultOption="請選擇縣市"
            name="縣市"
            options={CityList}
            selectOption={memberData.city}
            setOption={index => updateValue("city")(CityList[index])}
        />
        <ImageField
            name="學生證"
            image={sidImage}
            setImage={updateSidImage}
            defaultString="尚未上傳"
            changeString="變更照片"
        />
        {
            memberData.verify === true ? <div className={style.mention}>注意：你已經驗證完成，在按下"儲存資料"以後，將會需要重新等待驗證。</div> : undefined
        }
        <ToolBar
            result={updateResult}
            canSubmit={memberData && Object.values(memberData).reduce((v, v2) => v && v2 !== "", true)}
            submit={submit}
            className={style.toolBar}
        />
    </div >
}