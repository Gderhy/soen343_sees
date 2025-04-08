import React, { useState, useEffect } from "react";
import "./FinancialReportModal.css";
import { fetchFinancialReport } from "../../services/backend/managers";
import { Revenue, Expense } from "../../types";

interface FinancialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  numberOfAttendees: number;
  eventId: string;
  eventBasePrice: number;
}

const FinancialReportModal: React.FC<FinancialReportModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventBasePrice,
  numberOfAttendees,
}) => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  useEffect(() => {
    if (!eventId) return; // Ensure eventId is valid before fetching data
    if (!isOpen) return; // Only fetch data if the modal is open

    async function fetchFinancialData() {
      const { data, error } = await fetchFinancialReport(eventId);
      if (error) {
        console.error("Error fetching financial report:", error);
        return;
      }

      const totRev = data.eventRevenue.reduce((acc: number, item: Revenue) => acc + item.amount, 0);
      const totExp = data.eventExpenses.reduce((acc: number, item: Expense) => acc + item.amount, 0);

      setTotalRevenue(totRev || 0);
      setTotalExpenses(totExp || 0);
    }

    fetchFinancialData();
  }, [eventId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Financial Insights</h2>
        <div className="financial-details">
          <p>
            <strong>Event ID:</strong> {eventId}
          </p>
          <p>
            <strong>Base Price:</strong> ${eventBasePrice.toFixed(2)}
          </p>
          <p>
            <strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}
          </p>
          <p>
            <strong>Total Expenses:</strong> ${totalExpenses.toFixed(2)}
          </p>
          <p>
            <strong>Net Profit:</strong> ${(totalRevenue - totalExpenses).toFixed(2)}
          </p>
          <p>
            <strong>Attendees:</strong> {numberOfAttendees}
          </p>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default FinancialReportModal;
