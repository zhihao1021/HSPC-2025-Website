from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
    UploadFile
)

from typing import Annotated, Optional

from scheams import (
    MemberDataView,
    MemberDataUpdate,
    UserData,
)

from .oauth import UserDepends as JWTUserDepends

FILE_LIMIT = 5 * 1024 * 1024

TEAM_IN_PENDING = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Can not update member data while team in pending or accepted"
)
FILE_TOO_LARGE = HTTPException(
    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
    detail="File too large"
)


async def get_user_data(user: JWTUserDepends) -> UserData:
    return await UserData.find_one(
        UserData.discord_id == user.discord_id
    )

user_depends = Depends(get_user_data)
UserDepends = Annotated[UserData, user_depends]

router = APIRouter(
    prefix="/member",
    tags=["Member"]
)


@router.get(
    path="",
    status_code=status.HTTP_200_OK,
    response_model=MemberDataView
)
async def get_member_data(user: UserDepends) -> MemberDataView:
    await user.fetch_all_links()
    return user


@router.get(
    path="/image",
    status_code=status.HTTP_200_OK,
    response_class=Response
)
async def get_member_sid_image(user: UserDepends) -> Response:
    return Response(content=user.sid_image, media_type="image")


@router.put(
    path="",
    status_code=status.HTTP_200_OK,
    response_model=MemberDataView
)
async def update_member_data(
    data: MemberDataUpdate,
    user: UserDepends
) -> MemberDataView:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    await user.fetch_all_links()
    return await user.set({"verify": None, **data.model_dump()})


@router.post(
    path="/image",
    status_code=status.HTTP_201_CREATED,
)
async def update_member_sid_image(image: UploadFile, user: UserDepends) -> None:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    if image.size > FILE_LIMIT:
        raise FILE_TOO_LARGE

    user.sid_image = await image.read()
    user.verify = None
    await user.save()
