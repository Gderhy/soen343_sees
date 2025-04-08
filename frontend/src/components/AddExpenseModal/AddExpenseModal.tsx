import React, { useState } from "react";
import "./AddExpenseModal.css";
import { addExpenseToEvent } from "../../services/backend/managers";


interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, eventId }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && description.trim()) {
      const {error } = await addExpenseToEvent(eventId, description, parsedAmount);

      if (error) {
        alert("Error adding expense: " + error);
        return;
      }
      alert("Expense added successfully!");
      
      setAmount("");
      setDescription("");
      onClose();
    } else {
      alert("Please enter a valid amount and description.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              Add Expense
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
