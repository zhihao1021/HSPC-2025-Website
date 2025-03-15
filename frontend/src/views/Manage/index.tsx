import { ReactNode, useEffect, useMemo, useState } from "react";

import MemberCard from "@/components/MemberCard";

import { get_all_participator, set_participator_verify } from "@/api/manage";

import { MemberDataForManage } from "@/schemas/memberData";

import style from "./index.module.scss";

const filterMap = [
    "已驗證",
    "未驗證",
    "驗證不通過"
]

export default function ManagePage(): ReactNode {
    const [members, setMembers] = useState<{ [key: string]: MemberDataForManage }>({});
    const [filter, setFilter] = useState<Array<boolean>>([true, true, true]);

    useEffect(() => {
        get_all_participator().then(
            data => setMembers(Object.fromEntries(data.map(d => [d.discord_id, d])))
        );
    }, []);

    const showMembers: { [key: string]: MemberDataForManage } = useMemo(() => {
        let result = Object.values(members);
        if (filter[0] === false) result = result.filter(d => d.verify !== true);
        if (filter[1] === false) result = result.filter(d => d.verify !== null);
        if (filter[2] === false) result = result.filter(d => d.verify !== false);

        return Object.fromEntries(result.map(d => [d.discord_id, d]));
    }, [members, filter]);

    return <div className={style.managePage}>
        <h1>管理頁面</h1>
        <div className={style.filterList}>
            {
                filterMap.map((str, index) => <label
                    key={str}
                    className={`${style.filter} ms-p`}
                    data-status={filter[index]}
                >
                    <input type="checkbox" onChange={e => setFilter(v => {
                        const nv = Array.from(v);
                        nv[index] = e.target.checked;
                        return nv
                    })} checked={filter[index]} />
                    <span>{str}</span>
                </label>)
            }
        </div>
        <div className={style.list}>
            {
                Object.entries(showMembers).map(([discordId, data]) => <MemberCard
                    key={discordId}
                    data={data}
                    verify={(verify) => set_participator_verify(discordId, verify).then(data => {
                        setMembers(v => {
                            const nv = Object.assign({}, v);
                            nv[discordId] = data;
                            return nv;
                        })
                    })}
                />)
            }
        </div>
    </div>;
}