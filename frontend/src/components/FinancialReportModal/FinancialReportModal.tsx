import React from "react";
import "./FinancialReportModal.css";

interface FinancialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  financialData: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    attendees: number;
  };
}

const FinancialReportModal: React.FC<FinancialReportModalProps> = ({
  isOpen,
  onClose,
  financialData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Financial Insights</h2>
        <div className="financial-details">
          <p>
            <strong>Total Revenue:</strong> ${financialData.totalRevenue.toFixed(2)}
          </p>
          <p>
            <strong>Total Expenses:</strong> ${financialData.totalExpenses.toFixed(2)}
          </p>
          <p>
            <strong>Net Profit:</strong> ${financialData.netProfit.toFixed(2)}
          </p>
          <p>
            <strong>Attendees:</strong> {financialData.attendees}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportModal;
