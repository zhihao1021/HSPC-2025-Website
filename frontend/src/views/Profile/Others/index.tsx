import { Dispatch, ReactNode, SetStateAction, useCallback } from "react";

import style from "./index.module.scss";
import { leaveTeam } from "@/api/team";
import { useNavigate } from "react-router-dom";

type propsType = Readonly<{
    setLoading: Dispatch<SetStateAction<boolean>>,
    updateData: () => void,
}>;

export default function Others(props: propsType): ReactNode {
    const {
        setLoading,
        updateData
    } = props;

    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem("access_token");
        location.reload();
    }, []);

    const leaveGroup = useCallback(() => {
        console.log(123);
        setLoading(true);
        leaveTeam().finally(() => {
            navigate("/profile/team");
            updateData();
        })
    }, [setLoading, navigate]);

    return <div className={style.others}>
        <div className={style.field}>
            <div className={style.key}>登出</div>
            <button onClick={logout}>
                <span className="ms">logout</span>
                <span>登出</span>
            </button>
        </div>
        <div className={style.field}>
            <div className={style.key}>離開隊伍</div>
            <button onClick={leaveGroup}>
                <span className="ms">group_remove</span>
                <span>離開隊伍</span>
            </button>
        </div>
    </div>;
}