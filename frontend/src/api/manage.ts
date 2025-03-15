import { MemberDataForManage } from "@/schemas/memberData";
import axios from "axios";

export async function get_all_participator(params?: {
    offset?: number,
    limit?: number,
    verifyState?: boolean
}): Promise<Array<MemberDataForManage>> {
    const response = await axios.get("/manage/member", { params: params });

    return response.data;
}

export async function get_participator_data(discordId: string): Promise<MemberDataForManage> {
    const response = await axios.get(`/manage/member/${discordId}`);

    return response.data;
}

export async function set_participator_verify(discordId: string, verify: boolean): Promise<MemberDataForManage> {
    const response = await axios.put(`/manage/member/${discordId}`, { verify: verify });

    return response.data;
}
