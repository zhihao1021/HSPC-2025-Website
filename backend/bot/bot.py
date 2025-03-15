from beanie.operators import And, In
from discord import (
    ApplicationContext,
    Bot,
    ComponentType,
    Guild,
    Interaction,
    InteractionType,
    TextChannel,
    Permissions,
    SelectOption
)
from discord.ui import Button, Select, View

from datetime import datetime
from hashlib import md5
from os import urandom


from config import DISCORD_BOT_TOKEN, DISCORD_CUSTOM_ID
from scheams import UserData

LANGUAGE_MAP = {
    "ch": "請選擇 %value。",
}

bot = Bot()
permission = Permissions.none()
permission.administrator = True


@bot.slash_command(
    default_member_permissions=permission,
    name="init",
)
async def init_message(ctx: ApplicationContext):
    view = View(
        Button(
            custom_id=f"{DISCORD_CUSTOM_ID}_ch",
            label="點我進行驗證"
        ),
        timeout=None
    )

    channel: TextChannel = ctx.channel
    await channel.send(view=view)
    await ctx.respond("Message send.", ephemeral=True)


@bot.slash_command(
    default_member_permissions=permission,
    name="auto_verify",
)
async def auto_verify(ctx: ApplicationContext):
    guild: Guild = ctx.guild
    members = guild.members
    id_list = list(map(lambda member: str(member.id), members))

    before_count = await UserData.find_many(UserData.valid == False).count()
    await UserData.find_many(
        And(UserData.valid == False, In(UserData.discord_id, id_list))
    ).set({"valid": True})
    after_count = await UserData.find_many(UserData.valid == False).count()

    await ctx.respond(f"Auto verify finished, member count: {len(members)}\nBefore count: {before_count}\nAfter count: {after_count}", ephemeral=True)


@bot.event
async def on_interaction(interaction: Interaction):
    if interaction.type != InteractionType.component:
        return await Bot.on_interaction(bot, interaction)

    try:
        cid, data = interaction.custom_id.split("_", 1)
        if cid != DISCORD_CUSTOM_ID:
            raise ValueError
    except:
        return await Bot.on_interaction(bot, interaction)

    user_data = await UserData.find_one(UserData.discord_id == str(interaction.user.id))
    if user_data is None:
        await interaction.respond(
            "請先前往官方網站進行報名: https://hspc.csie.ncku.edu.tw/register",
            ephemeral=True
        )
        return

    timestamp = data.removeprefix("ans_") if data.startswith("ans") \
        else datetime.now().timestamp()
    answer = md5(f"{interaction.user.id}-{timestamp}".encode()).hexdigest()[:6]

    if data.startswith("ans_"):
        _, timestamp = data.split("_")

        values = interaction.data.get("values")
        if isinstance(values, list) and answer in values:
            result = "驗證成功。\nVerify success."

            user_data.valid = True
            await user_data.save()
        else:
            result = "驗證失敗。\nVerify failed."

        try:
            await interaction.response.send_message(result, ephemeral=True)
        except:
            pass
        return

    option_strings = [answer] + [urandom(3).hex() for _ in range(3)]
    option_strings.sort(key=lambda _: urandom(4))

    select_options = Select(
        select_type=ComponentType.string_select,
        options=list(map(
            lambda s: SelectOption(
                label=s.upper(),
                value=s,
            ),
            option_strings,
        )),
        custom_id=f"{DISCORD_CUSTOM_ID}_ans_{timestamp}"
    )

    try:
        await interaction.respond(
            f"請選擇 {answer.upper()}",
            view=View(select_options, timeout=None),
            ephemeral=True
        )
    except:
        pass


async def run_bot():
    await bot.start(token=DISCORD_BOT_TOKEN)
