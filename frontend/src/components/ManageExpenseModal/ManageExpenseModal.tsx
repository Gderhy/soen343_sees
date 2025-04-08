import React, { useEffect, useState } from "react";
import "./ManageExpenseModal.css";
import { fetchEventExpenses } from "../../services/backend/managers";
import AddExpenseModal from "../AddExpenseModal/AddExpenseModal";

interface Expense {
  description: string;
  amount: number;
}

interface ManageExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

const ManageExpenseModal: React.FC<ManageExpenseModalProps> = ({ isOpen, onClose, eventId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [viewExpenseModal, setViewExpenseModal] = useState<boolean>(false);

  useEffect(() => {
    if (!eventId || !isOpen) return;

    async function getExpenses() {
      setLoading(true);
      setError("");

      const { data, error } = await fetchEventExpenses(eventId);

      if (error) {
        setError("Failed to fetch expenses.");
        setLoading(false);
        return;
      }

      setExpenses(data);
      setLoading(false);
    }

    getExpenses();
  }, [eventId, isOpen, viewExpenseModal]); // Added viewExpenseModal to refresh when new expense is added

  const handleAddExpense = () => {
    setViewExpenseModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="manage-expense-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Manage Expenses</h2>
          </div>

          <div className="modal-content">
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && (
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense, index) => (
                    <tr key={index}>
                      <td>{expense.description}</td>
                      <td>${expense.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={2} className="no-expenses">
                        No expenses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="modal-footer">
            <button className="add-expense-button" onClick={handleAddExpense}>
              Add Expense
            </button>
            <button className="close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Add Expense Modal - outside the manage expense modal overlay */}
      {viewExpenseModal && (
        <AddExpenseModal
          isOpen={viewExpenseModal}
          onClose={() => setViewExpenseModal(false)}
          eventId={eventId}
        />
      )}
    </>
  );
};

export default ManageExpenseModal;
