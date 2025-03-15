import TeamData from "./teamData";
import { DiscordUser } from "./userData";

export interface MemberUpdate {
    name: string,
    school: string,
    city: string,
    lunch: string
}

export default interface MemberData extends MemberUpdate {
    team: TeamData | null,
    valid: boolean,
    verify: boolean | null,
};

export interface MemberDataInTeam extends MemberData, DiscordUser { }

export interface MemberDataForManage extends MemberData, DiscordUser {
    encode_image: string | null,
}

export interface MemberDataWithImg extends MemberData {
    sid_image: Blob | null
};
