from beanie import Link, Document, Indexed
from pydantic import BaseModel, Field, model_validator

from typing import Annotated, Literal, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .team import TeamData, TeamDataView

CityType = Literal[
    "臺北市",
    "新北市",
    "桃園市",
    "臺中市",
    "臺南市",
    "高雄市",
    "新竹縣",
    "苗栗縣",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "屏東縣",
    "宜蘭縣",
    "花蓮縣",
    "臺東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
    "基隆市",
    "新竹市",
    "嘉義市"
]
LunchType = Literal["葷", "素"]


class DiscordTokenData(BaseModel):
    access_token: str = ""
    token_type: str = "Bearer"
    expires_in: int = 604800
    refresh_token: str = ""
    scope: str = "identify"


class DiscordUserData(BaseModel):
    discord_id: Annotated[str, Indexed(unique=True)] = Field(
        title="UserID",
        description="Discord user id.",
    )
    username: str = Field(
        title="UserName",
        description="Discord username."
    )
    email: str = Field(
        title="Email",
        description="Discord email"
    )
    global_name: Optional[str] = Field(
        default=None,
        title="UserDisplayName",
        description="Discord user's global name."
    )
    avatar: Optional[str] = Field(
        default=None,
        title="UserAvatar",
        description="URL of discord user's avatar."
    )
    display_name: str = Field(
        default="",
        title="UserDisplayName",
        description="User's display name."
    )
    display_avatar: str = Field(
        default="",
        title="UserAvatar",
        description="URL of user's avatar."
    )

    @model_validator(mode="after")
    def update_display_field(self):
        self.display_name = self.global_name or self.username
        if self.avatar:
            self.display_avatar = f"https://cdn.discordapp.com/avatars/{self.discord_id}/{self.avatar}.png"
        else:
            self.display_avatar = "https://cdn.discordapp.com/embed/avatars/0.png"

        return self


class MemberField:
    name = Field(
        default="",
        title="Name",
        description="Real name"
    )
    school = Field(
        default="",
        title="School",
        description="School"
    )
    city = Field(
        default="",
        title="City",
        description="City",
        validate_default=False
    )
    lunch = Field(
        default="",
        title="Lunch",
        description="Lunch type",
        validate_default=False
    )
    team = Field(
        default=None,
        title="Team",
        description="User's team",
        original_field="members"
    )


class MemberDataUpdate(BaseModel):
    name: str = MemberField.name
    school: str = MemberField.school
    city: CityType = MemberField.city
    lunch: LunchType = MemberField.lunch


class MemberDataBase(MemberDataUpdate):
    name: str = MemberField.name
    school: str = MemberField.school
    city: str = MemberField.city
    lunch: str = MemberField.lunch
    valid: bool = Field(
        default=False,
        title="Valid",
        description="Whether user is validated."
    )
    verify: bool = Field(
        default=False,
        title="Verify",
        description="Weter user is verify by sid."
    )


class MemberDataInTeam(MemberDataBase, DiscordUserData):
    pass


class MemberData(MemberDataBase):
    team: Optional[Link["TeamData"]] = MemberField.team
    sid_image: Optional[bytes] = Field(
        default=None,
        title="SIDImage",
        description="Image data of SID card"
    )


class MemberDataView(MemberDataBase):
    team: Optional["TeamDataView"] = MemberField.team


class UserData(Document, DiscordTokenData, DiscordUserData, MemberData):
    class Settings:
        name = "UserData"
        max_nesting_depth = 2
