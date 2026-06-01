from typing import Type, TypeVar, Generic, Sequence, Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import Base
from app.core.mixin import SoftDeleteMixin

ModelT = TypeVar("ModelT", bound=Base)

class BaseRepository(Generic[ModelT]):
    """Generic repository providing common CRUD operations for SQLAlchemy models.

    This base repository assumes models inherit from app.core.database.Base and
    optionally from SoftDeleteMixin to support soft deletion semantics.
    """

    def __init__(self, model: Type, session: Session) -> None:
        """Initialize the repository for a specific model and database session.

        Args:
            model: The SQLAlchemy model class this repository will manage.
            session: The SQLAlchemy Session used for database operations.
        """
        self.model = model
        self.session = session
        
    def get_by_id(self, record_id: UUID, include_deleted: bool = False) -> ModelT | None:
        """Retrieve a single record by its primary key.

        Args:
            record_id: UUID of the record to fetch.
            include_deleted: If True, include records marked as deleted (when
                model implements SoftDeleteMixin). Defaults to False.

        Returns:
            The model instance if found, otherwise None.
        """
        stmt = select(self.model).where(self.model.id == record_id)
        if not include_deleted and issubclass(self.model, SoftDeleteMixin):
            stmt = stmt.where(self.model.is_deleted == False)
        return self.session.scalar(stmt)
    
    def get_by_field(self, field: str, value: Any, include_deleted: bool = False) -> ModelT | None:
        """Retrieve a single record by an arbitrary field value.

        Args:
            field: Name of the model attribute to filter by.
            value: Value to compare against the given field.
            include_deleted: If True, include soft-deleted records. Defaults to False.

        Returns:
            The matching model instance if found, otherwise None.
        """
        stmt = select(self.model).where(getattr(self.model, field) == value)
        if not include_deleted and issubclass(self.model, SoftDeleteMixin):
            stmt = stmt.where(self.model.is_deleted == False)
        return self.session.scalar(stmt)
    
    def get_all(self, limit: int, offset: int, include_deleted: bool = False) -> Sequence[ModelT]:
        """Return a paginated list of records for the model.

        Args:
            limit: Maximum number of records to return.
            offset: Number of records to skip.
            include_deleted: If True, include soft-deleted records. Defaults to False.

        Returns:
            A sequence of model instances.
        """
        stmt = select(self.model).limit(limit).offset(offset)
        if not include_deleted and issubclass(self.model, SoftDeleteMixin):
            stmt = stmt.where(self.model.is_deleted == False)
        return self.session.scalars(stmt).all()
    
    def create(self, data: dict[str, Any]) -> ModelT:
        """Create and persist a new model instance from a data dictionary.

        The instance is flushed and refreshed so returned object contains any
        database-generated defaults (e.g., primary key values).

        Args:
            data: Mapping of field names to values used to construct the instance.

        Returns:
            The newly created and refreshed model instance.
        """
        instance = self.model(**data)
        self.session.add(instance)
        self.session.flush()
        self.session.refresh(instance)
        return instance
    
    def update(self, instance: ModelT, data: dict[str, Any]) -> ModelT:
        """Update fields on an existing instance and persist changes.

        Args:
            instance: The model instance to update.
            data: Mapping of attribute names to new values.

        Returns:
            The updated model instance (refreshed from the session).
        """
        for key, value in data.items():
            setattr(instance, key, value)
        self.session.flush()
        self.session.refresh(instance)
        
        return instance
    
    def soft_delete(self, instance: ModelT) -> ModelT:
        """Mark an instance as deleted using SoftDeleteMixin.

        Raises:
            TypeError: If the provided instance does not implement SoftDeleteMixin.

        Returns:
            The instance after marking it as deleted.
        """
        if not isinstance(instance, SoftDeleteMixin):
            raise TypeError(f"{instance.__class__.__name__} doesn't have SoftDeleteMixin")
        instance.soft_delete()
        self.session.flush()
        return instance
    
    def hard_delete(self, instance: ModelT) -> None:
        """Permanently remove an instance from the database.

        This performs a DELETE using the active session and flushes the change.

        Args:
            instance: The model instance to delete.
        """
        self.session.delete(instance)
        self.session.flush()
        