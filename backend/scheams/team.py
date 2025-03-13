from bson import ObjectId
from beanie import Document, Link
from pydantic import BaseModel, Field, model_validator

from typing import Union, TYPE_CHECKING

if TYPE_CHECKING:
    from .user import UserData, MemberDataInTeam


class TeamField:
    members = Field(
        title="Members",
        description="Team members.",
        min_length=1,
        max_length=3,
        original_field="team"
    )


class TeamDataCreate(BaseModel):
    name: str = Field(
        title="Name",
        description="Team name.",
        min_length=1,
        max_length=30
    )


class TeamDataBase(TeamDataCreate):
    members: list[Link["UserData"]] = TeamField.members


class TeamDataViewWithoutId(TeamDataBase):
    members: list["MemberDataInTeam"] = TeamField.members


class TeamDataView(TeamDataViewWithoutId):
    team_id: str

    @model_validator(mode="before")
    def generate_team_id(cls, data: Union[dict, BaseModel]):
        try:
            if hasattr(data, "id"):
                object_id: ObjectId = data.id
                data = data.model_dump()
            else:
                object_id: ObjectId = data.get("id") or data.get("_id")
            data["team_id"] = object_id.binary.hex()
        except:
            pass
        return data


class TeamData(Document, TeamDataBase):
    class Settings:
        name = "TeamData"
        max_nesting_depth = 1
