from fastapi import APIRouter, HTTPException, Security
from services import AuthorizationService as AuthService
from repositories import SettingRepository as Settings


router = APIRouter(prefix="/users")

@router.get("/me/")
async def read_users_me(
        current_user: Annotated[User, Depends(AuthService.get_current_user)]
):
    return current_user


@router.get("/me/items/")
async def read_own_items(
        current_user: User = Security(AuthService.get_current_user, scopes=["items"]),
):
    return [{"item_id": "Foo", "owner": current_user.username}]
