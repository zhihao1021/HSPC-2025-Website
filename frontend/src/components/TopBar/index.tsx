import { ReactNode, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CacheImage from "@/utils/CacheImage";

import logo from "@/assets/logo.svg";

import userDataContext from "@/context/userData";

import style from "./index.module.scss";

export default function TopBar(): ReactNode {
    const [onTop, setOnTop] = useState<boolean>(scrollY === 0);

    const userData = useContext(userDataContext);

    useEffect(() => {
        setOnTop(scrollY === 0);
        window.addEventListener("scroll", () => {
            setOnTop(scrollY === 0);
        })
    }, []);

    return <div className={style.topBar} data-ontop={onTop}>
        <div className={style.content}>
            <Link to="/">
                <CacheImage src={logo} />
            </Link>
            <div className={style.menu}>
                <Link to="/about" >關於競賽</Link>
                <Link to="/info" >比賽說明</Link>
                <Link to="/traffic" >交通資訊</Link>
                <Link to="/tutorial" >如何報名</Link>
                <Link to="/history" >歷屆試題</Link>
            </div>
            {
                userData === null ? <Link className={style.login} to="/login">
                    <span>登入</span>
                </Link> : userData !== undefined ? <>
                    <Link to="/profile" className={style.imgBox}>
                        <img src={userData.display_avatar} />
                    </Link>
                </> : <></>
            }
        </div>
    </div>;
};
