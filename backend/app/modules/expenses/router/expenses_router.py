from uuid import UUID
from fastapi import APIRouter, dependencies, Depends
from app.modules.auth.dependencies import get_current_user
from ..schemas import ExpenseResponse, ExpenseCreate, ExpenseUpdate
from ..service import ExpenseService
from ..dependencies import get_expense_service

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/", response_model=list[ExpenseResponse])
def get_all_expenses(
    limit: int = 10,
    offset: int = 0,
    service: ExpenseService = Depends(get_expense_service)
):
    return service.get_all(limit, offset)

@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense_by_id(expense_id: UUID, service: ExpenseService = Depends(get_expense_service)):
    return service.get_by_id(expense_id)

@router.post("/", response_model=ExpenseResponse)
def create_expense(data: ExpenseCreate, service: ExpenseService = Depends(get_expense_service)):
    return service.create(data)

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: UUID, data: ExpenseUpdate, service: ExpenseService = Depends(get_expense_service)):
    expense = service.get_by_id(expense_id)
    return service.update(expense, data)


@router.delete("/{expense_id}")
def delete_expense(expense_id: UUID, service: ExpenseService = Depends(get_expense_service)):
    expense = service.get_by_id(expense_id)
    service.delete(expense)
