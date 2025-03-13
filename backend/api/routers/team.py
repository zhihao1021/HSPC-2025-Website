from fastapi import (
    APIRouter,
    Body,
    HTTPException,
    status
)

from typing import Annotated

from scheams import (
    TeamData,
    TeamDataCreate,
    TeamDataView,
    UserData
)

from .member import UserDepends

ALREADY_IN_TEAM = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="You are already in a team"
)
TEAM_NOT_EXIST = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Team not exist"
)
TEAM_IS_FULL = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="The team is full"
)

router = APIRouter(
    prefix="/team",
    tags=["Team"]
)


@router.get(
    path="/count",
    status_code=status.HTTP_200_OK
)
async def get_team_count() -> int:
    return await TeamData.count()


@router.post(
    path="",
    status_code=status.HTTP_200_OK,
    response_model=TeamDataView
)
async def join_team(
    team_id: Annotated[str, Body(embed=True)],
    user: UserDepends
) -> TeamDataView:
    await user.fetch_all_links()

    if user.team:
        raise ALREADY_IN_TEAM

    team = await TeamData.get(team_id, fetch_links=True)
    if team is None:
        raise TEAM_NOT_EXIST

    if len(team.members) >= 3:
        raise TEAM_IS_FULL

    user.team = team
    team.members.append(user)

    await user.save()
    return await team.save()


@router.put(
    path="",
    status_code=status.HTTP_201_CREATED,
    response_model=TeamDataView
)
async def create_team(
    data: TeamDataCreate,
    user: UserDepends
) -> TeamDataView:
    await user.fetch_all_links()

    team: TeamData = user.team or TeamData(
        name=data.name,
        members=[user]
    )
    team.name = data.name
    team = await team.save()

    user.team = team
    await user.save()

    return team


@router.delete(
    path="",
    status_code=status.HTTP_204_NO_CONTENT
)
async def leave_team(
    user: UserDepends
):
    await user.fetch_all_links()

    if user.team is None:
        return

    team: TeamData = user.team
    user.team = None
    await user.save()

    if len(team.members) == 1:
        await team.delete()
        return

    members: list[UserData] = team.members
    team.members = list(filter(
        lambda data: data.discord_id != user.discord_id,
        members
    ))

    await team.save()
