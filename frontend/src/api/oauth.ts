import axios from "axios";

import JWT from "@/schemas/jwt";

export async function getToken(code: string): Promise<JWT> {
    const response = await axios.post("/oauth", { code: code });

    const data = response.data as JWT;
    localStorage.setItem("token_type", data.token_type);
    localStorage.setItem("access_token", data.access_token);

    return data;
}

export async function refreshToken(): Promise<JWT> {
    const response = await axios.put("/oauth");

    const data = response.data as JWT;
    localStorage.setItem("token_type", data.token_type);
    localStorage.setItem("access_token", data.access_token);

    return data;
}
