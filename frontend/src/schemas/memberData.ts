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
    verify: boolean,
};

export interface MemberDataInTeam extends MemberData, DiscordUser { }

export interface MemberDataWithImg extends MemberData {
    sid_image: Blob | null
};
