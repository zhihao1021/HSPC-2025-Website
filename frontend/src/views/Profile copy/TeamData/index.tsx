import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import MemberData from "@/schemas/memberData";

import style from "./index.module.scss";
import { joinTeam, updateTeam } from "@/api/team";

type propsType = Readonly<{
    memberData: MemberData,
    updateData: () => void
}>;

export default function TeamData(props: propsType): ReactNode {
    const {
        memberData,
        updateData,
    } = props;

    const joinTeamRef = useRef<HTMLInputElement>(null);
    const teamNameRef = useRef<HTMLInputElement>(null);
    const [joinTeamId, setJoinTeamId] = useState<string>("");
    const [teamName, setTeamName] = useState<string>(memberData.team?.name ?? "");
    const [lastCopy, setLastCopy] = useState<number>(0);

    const createTeam = useCallback(() => {
        updateTeam({ name: teamName }).then(updateData);
        setTeamName("")
    }, [teamName]);

    const updateTeamInfo = useCallback(() => {
        updateTeam({ name: teamName }).then(updateData);
    }, [teamName]);

    const joinTeamById = useCallback(() => {
        joinTeam(joinTeamId).then(updateData);
    }, [joinTeamId]);

    const copyTeamId = useCallback(() => {
        if (!memberData.team) return;
        navigator.clipboard.writeText(memberData.team.team_id).then(() => {
            setLastCopy(Date.now())
        }).catch(() => {
            setLastCopy(-1);
        }).finally(() => {
            setTimeout(() => setLastCopy(v => v - 1), 1500);
        })
    }, [memberData]);

    const verifyStatus = useMemo(() => {
        if (!memberData.team) return false;
        if (memberData.team.members.length < 2) return false;

        return memberData.team.members.reduce((v, v2) => v && v2.valid && v2.verify, true)
    }, [memberData]);

    useEffect(() => {
        if (!memberData.team) return;
        setTeamName(memberData.team.name)
    }, [memberData]);

    return <div className={style.teamData}>
        {
            memberData.team ? <>
                <div className={style.info}>
                    <div className={`${style.key} ${style.tid}`}>Team ID</div>
                    <div
                        className={`${style.value} ${style.copy} ms-p`}
                        onClick={copyTeamId}
                        data-copy={Date.now() - lastCopy < 1500}
                    >{memberData.team.team_id}</div>
                </div>
                <div className={style.info}>
                    <div className={style.key}>資格狀態</div>
                    <div
                        className={style.value}
                        data-valid={verifyStatus}
                    >{verifyStatus ? "符合資格" : "不符資格"}</div>
                </div>
                <div className={style.info}>
                    <div className={style.key}>隊伍名稱</div>
                    <div className={style.inputBox}><input
                        ref={teamNameRef}
                        value={teamName} placeholder="隊伍名稱"
                        onChange={e => setTeamName(e.target.value)}
                    /></div>
                </div>
                <div className={style.members}>
                    <div className={style.key}>組員列表</div>
                    <div className={style.list}>
                        {
                            memberData.team.members.map(value => <div
                                key={value.name}
                                className={style.memberInfo}
                            >
                                <div className={style.memberField}>
                                    <div className={style.memberKey}>姓名</div>
                                    <div className={style.memberValue}>{value.name}</div>
                                </div>
                                <div className={style.memberField}>
                                    <div className={style.memberKey}>Discord 驗證</div>
                                    <div
                                        className={style.memberValue}
                                        data-valid={value.valid}
                                    >{value.valid ? "已驗證" : "未驗證"}</div>
                                </div>
                                <div className={style.memberField}>
                                    <div className={style.memberKey}>學生證驗證</div>
                                    <div
                                        className={style.memberValue}
                                        data-valid={value.verify}
                                    >{value.verify ? "已驗證" : "未驗證"}</div>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
                <div className={style.toolBar}>
                    <button onClick={updateTeamInfo} disabled={teamName === ""}>儲存</button>
                </div>
            </> : <>
                <div className={style.box}>
                    <div className={style.inputBox}><input
                        ref={teamNameRef}
                        value={teamName} placeholder="隊伍名稱"
                        onChange={e => setTeamName(e.target.value)}
                    /></div>
                    <div className={style.buttonBox} onClick={() => {
                        if (teamName === "") teamNameRef.current?.focus();
                    }}>
                        <div className={style.mask}>
                            <button onClick={createTeam} disabled={teamName === ""}>
                                <span className="ms">add</span>
                                <span>創建隊伍</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={style.or}>OR</div>
                <div className={style.box}>
                    <div className={style.inputBox}><input
                        ref={joinTeamRef}
                        value={joinTeamId} placeholder="隊伍 ID"
                        onChange={e => setJoinTeamId(e.target.value)}
                    /></div>
                    <div className={style.buttonBox} onClick={() => {
                        if (joinTeamId === "") joinTeamRef.current?.focus();
                    }}>
                        <div className={style.mask}>
                            <button onClick={joinTeamById} disabled={joinTeamId === ""}>
                                <span className="ms">person_add</span>
                                <span>加入隊伍</span>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        }
    </div>;
}