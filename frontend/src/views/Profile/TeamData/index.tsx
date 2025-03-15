import {
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import MemberCard from "@/components/MemberCard";

import { joinTeam, updateTeam } from "@/api/team";

import MemberData from "@/schemas/memberData";

import { CopyField, StatusField, TextInputField, ToolBar } from "../components";

import style from "./index.module.scss";

type propsType = Readonly<{
    memberData: MemberData,
    updateData: () => void,
    setLoading: Dispatch<SetStateAction<boolean>>
}>;

export default function TeamData(props: propsType): ReactNode {
    const {
        memberData,
        updateData,
        setLoading
    } = props;

    const [teamName, setTeamName] = useState<string>(memberData.team?.name ?? "");
    const [joinTeamId, setJoinTeamId] = useState<string>("");
    const [updateResult, setUpdateResult] = useState<{
        success: boolean,
        message: string
    } | undefined>()

    const joinTeamById = useCallback(() => {
        if (joinTeamId === "") return;
        setLoading(true)
        joinTeam(joinTeamId).then(() => {
            setUpdateResult({ success: true, message: "加入成功" })
        }).catch(() => {
            setUpdateResult({ success: false, message: "加入失敗" })
        }).finally(() => {
            updateData();
            setTimeout(() => setUpdateResult(undefined), 5000)
        });
    }, [joinTeamId]);

    const updateTeamInfo = useCallback(() => {
        if (teamName === "") return;
        setLoading(true);
        updateTeam(
            { name: teamName }
        ).then(() => {
            setUpdateResult({ success: true, message: "更新成功" })
        }).catch(() => {
            setUpdateResult({ success: false, message: "更新失敗" })
        }).finally(() => {
            updateData();
            setTimeout(() => setUpdateResult(undefined), 5000)
        });
    }, [teamName, setLoading]);

    const verifyStatus = useMemo(() => {
        if (!memberData.team) return false;
        if (memberData.team.members.length < 2) return false;
        if (memberData.team.members.length > 3) return false;

        return memberData.team.members.reduce((v, v2) => v && v2.valid === true && v2.verify === true, true)
    }, [memberData]);

    useEffect(() => {
        if (!memberData.team) return setTeamName("");
        setTeamName(memberData.team.name)
    }, [memberData]);

    if (!memberData.team) return <div className={style.teamData}>
        <div className={style.row}>
            <TextInputField
                name="創建隊伍" setValue={setTeamName}
                value={teamName} placeholder="隊伍名稱"
                className={style.noTeamInput}
            />
            <div className={style.mask}>
                <button onClick={updateTeamInfo} disabled={teamName === ""}>
                    <span className="ms">add</span>
                    <span>創建</span>
                </button>
            </div>
        </div>
        <div className={style.or}>或是</div>
        <div className={style.row}>
            <TextInputField
                name="加入隊伍" setValue={setJoinTeamId}
                value={joinTeamId} placeholder="Team ID"
                className={style.noTeamInput}
            />
            <div className={style.mask}>
                <button onClick={joinTeamById} disabled={joinTeamId === ""}>
                    <span className="ms">group_add</span>
                    <span>加入</span>
                </button>
            </div>
        </div>
        {
            updateResult ? <div
                className={style.errorMessage}
                data-status={updateResult.success}
            >{updateResult?.message}</div> : undefined
        }
    </div>;

    return <div className={style.teamData}>
        <CopyField name="Team ID" value={memberData.team.team_id} />
        <StatusField
            name="資格狀態" status={verifyStatus}
            value={verifyStatus ? "符合資格" : "不符資格"}
        />
        <TextInputField
            name="隊伍名稱" setValue={setTeamName}
            value={teamName} placeholder="隊伍名稱"
        />
        <ToolBar
            submit={updateTeamInfo}
            canSubmit={teamName !== ""}
            result={updateResult}
            className={style.toolBar}
        />
        <h2>隊伍成員</h2>
        <div className={style.members}>{
            memberData.team.members.map(data => <MemberCard key={data.discord_id} data={data} />)
        }</div>
    </div>;
}