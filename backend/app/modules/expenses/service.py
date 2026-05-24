from uuid import UUID
from fastapi import HTTPException, status

from .repository import CategoryRepository, ExpenseRepository
from .models import Category, Expense
from .schemas import CategoryCreate, CategoryUpdate, ExpenseCreate, ExpenseUpdate

class CategoryService:
    def __init__(self, category_repository: CategoryRepository) -> None:
        self.repo = category_repository
        
    def create(self, data: CategoryCreate):
        existing_category = self.repo.get_by_name(data.name)
        
        if existing_category:
            raise HTTPException(status.HTTP_409_CONFLICT, "Category already exists")
        
        return self.repo.create(data.model_dump())
    
    def get_all(self, limit: int, offset: int):
        return self.repo.get_all(limit, offset)
    
    def get_by_id(self, category_id: UUID) -> Category:
        category = self.repo.get_by_id(category_id)
        
        if not category:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
        
        return category
    
    def update(self, category: Category, data: CategoryUpdate):
        return self.repo.update(category, data.model_dump(exclude_unset=True))
    
    def delete(self, category: Category):
        return self.repo.soft_delete(category)
    
    def hard_delete(self, category: Category):
        return self.repo.hard_delete(category)


class ExpenseService:
    def __init__(self, expense_repository: ExpenseRepository, category_repository: CategoryRepository):
        self.repo = expense_repository
        self.category_repo = category_repository
        
    def create(self, data: ExpenseCreate):
        if data.category_id:
            category = self.category_repo.get_by_id(data.category_id)
            if not category:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
            
        return self.repo.create(data.model_dump())
    
    def get_all(self, limit: int, offset: int):
        return self.repo.get_all(limit, offset)
    
    def get_by_id(self, expense_id: UUID):
        expense = self.repo.get_by_id(expense_id)
        if not expense:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Expense not found")
        
        return expense
    
    def update(self, expense: Expense, data: ExpenseUpdate):
        return self.repo.update(expense, data.model_dump(exclude_unset=True))
    
    def delete(self, expense: Expense):
        return self.repo.soft_delete(expense)
    
    def hard_delete(self, expense: Expense):
        return self.repo.hard_delete(expense)