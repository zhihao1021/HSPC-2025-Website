import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import CacheImage from "@/utils/CacheImage";

import discordLogo from "@/assets/discord-logo-white.svg";

import style from "./index.module.scss";
import { getToken } from "@/api/oauth";
import UserData from "@/schemas/userData";
import { jwtDecode } from "jwt-decode";

type propsType = Readonly<{
    setLoading: Dispatch<SetStateAction<boolean>>
    setUserData: Dispatch<SetStateAction<UserData | undefined | null>>
}>;

export default function LoginPage(props: propsType): ReactNode {
    const {
        setLoading,
        setUserData,
    } = props;

    const [message, setMessage] = useState<string>("");

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const code = searchParams.get("code");
        if (code === null) return;
        setLoading(true);
        searchParams.delete("code");
        setSearchParams(searchParams);

        getToken(code).then(data => {
            setUserData(jwtDecode(data.access_token));
            navigate("/profile");
        }).catch(
            () => setMessage("登入失敗")
        ).finally(() => setLoading(false));
    }, [setLoading, searchParams, setSearchParams, navigate]);

    return <div className={style.loginPage}>
        <div className={style.box}>
            <h1>使用 Discord 登入</h1>
            <a
                href={import.meta.env.VITE_OAUTH_URL}
                target="_self"
                referrerPolicy="no-referrer-when-downgrade"
            >
                <CacheImage src={discordLogo} />
            </a>
            {message === "" ? undefined : <div className={style.error}>
                {message}
            </div>}
        </div>
    </div>;
}