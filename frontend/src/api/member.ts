import axios from "axios";

import MemberData, { MemberDataWithImg, MemberUpdate } from "@/schemas/memberData";

export async function getMemberData(): Promise<MemberDataWithImg> {
    const response = await axios.get("/member");
    const data = response.data;

    const imageResponse = await axios.get("/member/image", { responseType: "blob" });
    const buffer = imageResponse.data as Blob;
    return Object.assign({ sid_image: buffer.size === 0 ? null : buffer }, data);
}

export async function updateMember(data: MemberUpdate, file: Blob | null): Promise<MemberData> {
    if (file) {
        const formData = new FormData();
        formData.append("image", file);
        await axios.post("/member/image", formData);
    }
    const response = await axios.put("/member", data);

    return response.data;
}