import axios from "axios";

import TeamData, { TeamCreate } from "@/schemas/teamData";

export async function getTeamCount(): Promise<number> {
    const response = await axios.get("/team/count");

    return response.data ?? 0;
}

export async function getTeamId(): Promise<string> {
    const response = await axios.get("/team/id");

    return response.data;
}

export async function joinTeam(teamId: string): Promise<TeamData> {
    const response = await axios.post("/team", { team_id: teamId });

    return response.data;
}

export async function updateTeam(data: TeamCreate): Promise<TeamData> {
    const response = await axios.put("/team", data);

    return response.data;
}

export async function leaveTeam(): Promise<void> {
    await axios.delete("/team");
}