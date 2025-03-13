export interface DiscordUser {
    discord_id: string,
    username: string,
    email: string,
    global_name: string,
    avatar: string,
    display_name: string,
    display_avatar: string,
}

export default interface UserData extends DiscordUser {
    iat: number,
    exp: number,
}