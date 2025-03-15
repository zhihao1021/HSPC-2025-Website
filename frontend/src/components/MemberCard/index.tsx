import { ReactNode, useCallback, useMemo, useState } from "react";

import { MemberDataInTeam } from "@/schemas/memberData";

import style from "./index.module.scss";
import CopyBox from "../CopyBox";
import LoadingBox from "../LoadingBox";

interface DataType extends MemberDataInTeam {
    encode_image?: string | null
}

type propsType = Readonly<{
    data: DataType,
    verify?: (status: boolean) => Promise<void>,
}>;

export default function MemberCard(props: propsType): ReactNode {
    const {
        data,
        verify,
    } = props;

    const [loading, setLoading] = useState<boolean>(false);

    const isManage = useMemo(() => {
        return data.encode_image !== undefined;
    }, [data]);

    const action = useCallback((target: boolean) => () => {
        if (verify === undefined) return;
        setLoading(true);
        verify(target).finally(() => setLoading(false));
    }, [verify]);

    return <div className={style.memberCard} data-manage={isManage || undefined}>
        {
            verify ? <div className={style.loading}>
                <LoadingBox show={loading} />
            </div> : undefined
        }
        <div className={style.avatarBar}>
            <img src={data.display_avatar} />
            <div className={style.displayName}>{data.display_name}</div>
            {
                verify ? <>
                    <button onClick={action(false)} data-verify={false}>
                        <span>認證不通過</span>
                    </button>
                    <button onClick={action(true)} data-verify={true}>
                        <span>認證通過</span>
                    </button>
                </> : undefined
            }
        </div>
        {
            isManage ? <div className={style.imgBox}>
                <div className={style.key}>學生證</div>
                {
                    data.encode_image ? <img
                        src={`data:image;base64,${data.encode_image}`}
                    /> : <div>尚未上傳</div>
                }
            </div> : undefined
        }
        <div className={style.box}>
            <div className={style.field}>
                <div className={style.key}>姓名</div>
                <div className={style.value}>{data.name || "尚未填寫"}</div>
            </div>
            {
                isManage ? <>
                    <div className={style.field}>
                        <div className={style.key}>Email</div>
                        <CopyBox className={style.value} value={data.email} />
                    </div>
                    <div className={style.field}>
                        <div className={style.key}>Discord ID</div>
                        <CopyBox className={style.value} value={data.discord_id} />
                    </div>
                </> : undefined
            }
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
                    data-status={data.verify ?? "null"}
                >{data.verify === null ? "驗證中" : data.verify ? "已驗證" : "驗證失敗"}</div>
            </div>
        </div>
    </ div>
}