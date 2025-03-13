import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import {
    Route,
    Routes
} from "react-router-dom";

import HomePage from "@/views/Home";
import ProfilePage from "@/views/Profile";
import LoginPage from "@/views/Login";

import TopBar from "@/components/TopBar";

import userDataContext from "@/context/userData";

import cacheAll from "@/utils/cacheAll";

import JWT from "@/schemas/jwt";
import UserData from "@/schemas/userData";
import Loading from "./components/Loading";

type propsType = Readonly<{
    setUserData: Dispatch<SetStateAction<UserData | undefined | null>>
}>;

export function App(props: propsType): ReactNode {
    const { setUserData } = props;

    const [loading, setLoading] = useState<boolean>(false);

    const userData = useContext(userDataContext);

    return <>
        <TopBar />
        <Loading show={loading} />
        <Routes>
            <Route path="/*" element={<HomePage />} />
            <Route path="login" element={<LoginPage setLoading={setLoading} setUserData={setUserData} />} />
            {userData === null ? undefined : <Route path="/profile/*" element={<ProfilePage />} />}
        </Routes>
    </>;
};

export default function AppWrap(): ReactNode {
    const [userData, setUserData] = useState<UserData | undefined | null>(undefined);

    useEffect(() => {
        try {
            const token = localStorage.getItem("access_token");
            const nowTimestamp = Date.now() / 1000;
            if (token) {
                const data = jwtDecode(token) as UserData;
                setUserData(data);
                if (data.exp - nowTimestamp > 3600 * 24 * 3) return;
            }
        }
        catch { }

        axios.put("/oauth").then(response => {
            const data = response.data as JWT;

            localStorage.setItem("token_type", data.token_type);
            localStorage.setItem("access_token", data.access_token);
            setUserData(jwtDecode(data.access_token));
        }).catch(() => {
            localStorage.removeItem("token_type");
            localStorage.removeItem("access_token");
            setUserData(null);
        });
    }, []);

    useEffect(() => {
        cacheAll();
    }, []);

    return <userDataContext.Provider value={userData}>
        <App setUserData={setUserData} />
    </userDataContext.Provider>;
}
