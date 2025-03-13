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
import TeamData from "./TeamData";
import Others from "./Others";

import style from "./index.module.scss";

const tabs = {
    "個人資料": "/profile/personal",
    "隊伍管理": "/profile/team",
    "其他": "/profile/others",
}

const defaultMemberData: MemberData = {
    city: "",
    lunch: "",
    name: "",
    school: "",
    team: null,
    valid: false,
    verify: false
}

export default function ProfilePage(): ReactNode {
    const [loading, setLoading] = useState<boolean>(false);
    const [memberData, setMemberData] = useState<MemberData | null>(null);
    const [updateSidImage, setUpdateSidImage] = useState<Blob | null>(null);

    const routeLocation = useLocation();

    const updateData: MemberUpdate | null = useMemo(() => memberData ? ({
        city: memberData.city,
        name: memberData.name,
        lunch: memberData.lunch,
        school: memberData.school,
    }) : null, [memberData]);

    const updateValue = useCallback((key: keyof MemberUpdate) => (
        v: ChangeEvent<HTMLInputElement> | string
    ) => setMemberData(data => {
        const newData = Object.assign({}, data);
        newData[key] = typeof v === "string" ? v : v.target.value;
        return newData;
    }), []);

    const submit = useCallback(() => new Promise<void>((
        resolve: () => void,
        reject: (reason: string) => void
    ) => {
        if (updateData === null) return resolve();
        updateMember(updateData, updateSidImage).then(newData => {
            setMemberData(newData);
            resolve();
        }).catch((error: AxiosError) => {
            const status = error.response?.status;
            switch (status) {
                case 422: return reject("更新失敗，請檢察是否填寫正確");
                case 400: return reject("請取消隊伍驗證請求再進行更改");
                default: return reject("未知的錯誤")
            }
        })
    }), [updateData, updateSidImage]);

    const updateMemberData = useCallback(() => {
        setLoading(true);
        getMemberData().then(data => {
            setMemberData(data);
            setUpdateSidImage(data.sid_image)
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        updateMemberData()
    }, [updateMemberData]);

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
        <div className={style.loading} data-show={loading || memberData === null}>{
            Array.from(Array(5)).map((_, index) => <div key={index} />)
        }</div>
        <Routes>
            <Route path="personal" element={<PersonalData
                memberData={memberData ?? defaultMemberData}
                sidImage={updateSidImage}
                updateValue={updateValue}
                updateSidImage={setUpdateSidImage}
                update={submit}
                setLoading={setLoading}
            />} />
            <Route path="team" element={<TeamData
                memberData={memberData ?? defaultMemberData}
                updateData={updateMemberData}
                setLoading={setLoading}
            />} />
            <Route
                path="others"
                element={<Others
                    setLoading={setLoading}
                    updateData={updateMemberData}
                />}
            />
            <Route path="*" element={<Navigate to="/profile/personal" replace />} />
        </Routes>
    </div >;
}