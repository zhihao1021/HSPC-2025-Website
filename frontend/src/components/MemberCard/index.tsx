import { ReactNode } from "react";

import { MemberDataInTeam } from "@/schemas/memberData";

import style from "./index.module.scss";

type propsType = Readonly<{
    data: MemberDataInTeam
}>;

export default function MemberCard(props: propsType): ReactNode {
    const { data } = props;

    return <div className={style.memberCard}>
        <div className={style.avatarBar}>
            <img src={data.display_avatar} />
            <div className={style.displayName}>{data.display_name}</div>
        </div>
        <div className={style.field}>
            <div className={style.key}>姓名</div>
            <div className={style.value}>{data.name || "尚未填寫"}</div>
        </div>
        <div className={style.field}>
            <div className={style.key}>學校</div>
            <div className={style.value}>{data.school || "尚未填寫"}</div>
        </div>
        <div className={style.field}>
            <div className={style.key}>縣市</div>
            <div className={style.value}>{data.city || "尚未填寫"}</div>
        </div>
        <div className={style.field}>
            <div className={style.key}>午餐</div>
            <div className={style.value}>{data.lunch || "尚未填寫"}</div>
        </div>
        <div className={style.field}>
            <div className={style.key}>Discord 驗證</div>
            <div
                className={style.value}
                data-status={data.valid}
            >{data.valid ? "已驗證" : "未驗證"}</div>
        </div>
        <div className={style.field}>
            <div className={style.key}>資格驗證</div>
            <div
                className={style.value}
                data-status={data.verify}
            >{data.verify ? "已驗證" : "驗證中"}</div>
        </div>
    </ div>
}