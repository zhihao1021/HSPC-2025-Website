import { AxiosError } from "axios";
import {
    ChangeEvent,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import {
    Link,
    Navigate,
    Route,
    Routes,
    useLocation
} from "react-router-dom";

import MemberData, { MemberUpdate } from "@/schemas/memberData";

import { getMemberData, updateMember } from "@/api/member";

import PersonalData from "./PersonalData";

import style from "./index.module.scss";
import TeamData from "./TeamData";

const tabs = {
    "個人資料": "/profile/personal",
    "隊伍管理": "/profile/team",
}

export default function ProfilePage(): ReactNode {
    const [memberData, setMemberData] = useState<MemberData>({
        city: "",
        lunch: "",
        name: "",
        school: "",
        team: null,
        valid: false,
        verify: false,
    });
    const [updateSidImage, setUpdateSidImage] = useState<File | null>(null);
    const [sidImageSrc, setSidImageSrc] = useState<string | null>(null);

    const routeLocation = useLocation();

    const updateData: MemberUpdate = useMemo(() => ({
        city: memberData.city,
        name: memberData.name,
        lunch: memberData.lunch,
        school: memberData.school,
    }), [memberData]);

    const updateValue = useCallback((key: keyof MemberUpdate) => (
        v: ChangeEvent<HTMLInputElement> | string
    ) => setMemberData(data => {
        const newData = Object.assign({}, data);
        if (typeof v === "string") newData[key] = v;
        else newData[key] = v.target.value;
        return newData;
    }), []);

    const generateDataImg = useCallback((data: ArrayBuffer | null) => {
        if (data === null) return setSidImageSrc(null);
        try {
            const blob = new Blob([data], { type: "image" });
            const fileReader = new FileReader();
            fileReader.onload = () => setSidImageSrc(fileReader.result as string);
            fileReader.readAsDataURL(blob);
        }
        catch { setSidImageSrc(null) }
    }, []);

    const submit = useCallback(() => new Promise<void>((resolve, reject) => {
        if (updateData === null) return;
        updateMember(updateData, updateSidImage).then(newData => {
            setMemberData(newData);
            resolve();
        }
        ).catch((error: AxiosError) => {
            const status = error.response?.status;
            switch (status) {
                case 422: return reject("更新失敗，請檢察是否填寫正確");
                case 400: return reject("請取消隊伍驗證請求再進行更改");
                default: return reject("未知的錯誤")
            }
        })
    }), [updateData, updateSidImage]);

    const updateMemberData = useCallback(() => getMemberData().then(data => {
        setMemberData(data);
        generateDataImg(data.sid_image)
    }), [generateDataImg]);

    useEffect(() => {
        updateMemberData()
    }, [updateMemberData]);

    useEffect(() => {
        if (updateSidImage instanceof File) updateSidImage.arrayBuffer().then(generateDataImg);
    }, [updateSidImage, generateDataImg]);

    return <div className={style.registerPage}>
        <h1>資料維護</h1>
        <div className={style.tabBar}>
            {
                Object.entries(tabs).map(([key, value]) => <Link
                    key={key}
                    to={value}
                    data-selected={routeLocation.pathname.startsWith(value)}
                >{key}</Link>)
            }
        </div>
        <Routes>
            <Route path="personal" element={<PersonalData
                memberData={memberData}
                sidImageSrc={sidImageSrc}
                updateValue={updateValue}
                updateSidImage={setUpdateSidImage}
                update={submit}
            />} />
            <Route path="team" element={<TeamData
                memberData={memberData}
                updateData={updateMemberData}
            />} />
            <Route path="*" element={<Navigate to="/profile/personal" replace />} />
        </Routes>
    </div >;
}