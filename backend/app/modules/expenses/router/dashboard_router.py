from fastapi import APIRouter, Depends, Query
from app.modules.auth.dependencies import get_current_user
from ..service import ExpenseService
from ..dependencies import get_expense_service
from ..schemas import TotalExpenses
from ..schemas import TotalExpenses, DashboardSummary, PeriodFilter

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/total", response_model=TotalExpenses)
def get_total_expenses(service: ExpenseService = Depends(get_expense_service)):
    return {
        "total": service.get_total_expenses() or 0
    }

@router.get("/summary", response_model=DashboardSummary)
def get_summary(
    period: PeriodFilter = Query(default=PeriodFilter.month),
    service: ExpenseService = Depends(get_expense_service),
):
    return service.get_summary(period)

@router.get("/summary/{period}", response_model=DashboardSummary)
def get_summary_path(
    period: PeriodFilter,
    service: ExpenseService = Depends(get_expense_service),
):
    return service.get_summary(period)