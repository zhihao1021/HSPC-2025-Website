import { MemberDataInTeam } from "./memberData";

export interface TeamCreate {
    name: string,
}

export interface TeamDataWithoutId extends TeamCreate {
    members: Array<MemberDataInTeam>
}

export default interface TeamData extends TeamDataWithoutId {
    team_id: string,
};