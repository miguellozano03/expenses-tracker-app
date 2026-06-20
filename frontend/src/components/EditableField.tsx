import React, { useState, ChangeEvent } from 'react';
import { Mail, UserIcon, Pencil } from 'lucide-react'; // Assuming Mail and UserIcon are from lucide-react

interface EditableFieldProps {
  icon: React.ElementType;
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  // You might want to pass the specific user type or a more generic value type
  // For now, assuming string for simplicity, but will adapt if needed.
}

export const EditableField: React.FC<EditableFieldProps> = ({
  icon: Icon,
  label,
  value,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  };

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(value); // Reset to original value on Escape
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 border border-spendly-100 dark:border-dark-border rounded-2xl bg-white dark:bg-dark-card transition-colors duration-200">
      <Icon size={18} className="text-spendly-600 dark:text-dark-muted" />
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-xs text-spendly-700 dark:text-dark-muted">{label}</p>
          {isEditing ? (
            <input
              type="text"
              value={currentValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleSave} // Save and exit editing when input loses focus
              autoFocus
              className="text-sm font-medium text-spendly-900 dark:text-dark-text bg-transparent focus:outline-none w-full"
            />
          ) : (
            <p className="text-sm font-medium text-spendly-900 dark:text-dark-text">
              {value}
            </p>
          )}
        </div>
        {!isEditing && (
          <button onClick={handleEditClick} className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-spendly-500">
            <Pencil size={16} className="text-spendly-600 dark:text-dark-muted" />
          </button>
        )}
      </div>
    </div>
  );
};
