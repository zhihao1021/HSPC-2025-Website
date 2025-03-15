from fastapi import (
    APIRouter,
    Depends,
    Body,
    HTTPException,
    status
)

from typing import Annotated, Optional

from config import DISCORD_ADMIN_LIST
from scheams import (
    MemberDataForManage,
    UserData
)

from .oauth import UserDepends as JWTUserDepends


async def check_user(user: JWTUserDepends):
    if user.discord_id not in DISCORD_ADMIN_LIST:
        raise PERMISSION_DENIED

router = APIRouter(
    prefix="/manage",
    tags=["Manage"],
    dependencies=[Depends(check_user)]
)

PERMISSION_DENIED = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You are not admin"
)
USER_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="User not found"
)


@router.get(
    path="/member",
    response_model=list[MemberDataForManage]
)
async def get_user_data(
    offset: Optional[int] = None,
    limit: Optional[int] = None,
    verify: Optional[bool] = None,
) -> list[MemberDataForManage]:
    if verify is None:
        users = await UserData.all(
            skip=offset,
            limit=limit
        ).to_list()
    else:
        users = await UserData.find_many(
            UserData.verify == verify,
            skip=offset,
            limit=limit
        ).to_list()

    return users


@router.get(
    path="/member/{discord_id}",
    response_model=MemberDataForManage
)
async def get_user_data(discord_id: str) -> MemberDataForManage:
    user = await UserData.find_one(
        UserData.discord_id == discord_id,
        fetch_links=True
    ).project(MemberDataForManage)
    if user is None:
        raise USER_NOT_FOUND

    return user


@router.put(
    path="/member/{discord_id}",
    response_model=MemberDataForManage
)
async def update_user_verify(
    discord_id: str,
    verify: Annotated[bool, Body(embed=True)]
) -> MemberDataForManage:
    user = await UserData.find_one(
        UserData.discord_id == discord_id,
        fetch_links=True
    )
    if user is None:
        raise USER_NOT_FOUND

    user.verify = verify
    return await user.save()
