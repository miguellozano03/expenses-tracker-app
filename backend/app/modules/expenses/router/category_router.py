from uuid import UUID
from fastapi import APIRouter, Depends, status
from app.modules.auth.dependencies import get_current_user
from ..service import CategoryService
from ..dependencies import get_category_service
from ..schemas import CategoryRead, CategoryCreate, CategoryUpdate


router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/", response_model=list[CategoryRead])
def get_all_categories(
    limit: int = 10,
    offset: int = 0,
    service: CategoryService = Depends(get_category_service)
):
    return service.get_all(limit, offset)

@router.post("/", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(
    data: CategoryCreate,
    service: CategoryService = Depends(get_category_service)
):
    return service.create(data)

@router.put("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: UUID,
    data: CategoryUpdate,
    service: CategoryService = Depends(get_category_service)
):
    category = service.get_by_id(category_id)
    return service.update(category, data)

@router.delete("/{category_id}")
def delete_category(
    category_id: UUID,
    service: CategoryService = Depends(get_category_service)
):
    category = service.get_by_id(category_id)
    service.delete(category)