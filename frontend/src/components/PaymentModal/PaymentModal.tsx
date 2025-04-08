import React from "react";
import "./PaymentModal.css";
import { PaymentDetails } from "../../types";
import { rsvpToPaidEvent } from "../../services/backend/user";
import { useNavigate } from "react-router-dom";


interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, eventId }) => {
  const navigate = useNavigate();
  
  const [paymentDetails, setPaymentDetails] = React.useState<PaymentDetails>({
    name: "",
    number: "",
    exp_mm: "",
    exp_yyyy: "",
    card_type: "",
    code: "",
  });
  
  const handleProceed = async () => {
    const { error } = await rsvpToPaidEvent(eventId, paymentDetails);

    if (error) {
      console.error("Error processing payment:", error);
      return;
    }

    alert(`Payment successful!`);
    onClose(); // Close the modal after successful payment
    // Reload the page to reflect changes
    window.location.reload();
  }
    

  
  if (!eventId) return null;
  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h2>Payment Details</h2>
        <form>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              value={paymentDetails.number}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, number: e.target.value })}
              placeholder="Enter your card number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name on Card</label>
            <input
              type="text"
              id="name"
              value={paymentDetails.name}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
              placeholder="Enter the name on the card"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exp_mm">Expiration Month</label>
            <input
              type="text"
              id="exp_mm"
              value={paymentDetails.exp_mm}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, exp_mm: e.target.value })}
              placeholder="MM"
            />
          </div>
          <div className="form-group">
            <label htmlFor="exp_yyyy">Expiration Year</label>
            <input
              type="text"
              id="exp_yyyy"
              value={paymentDetails.exp_yyyy}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, exp_yyyy: e.target.value })}
              placeholder="YYYY"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cardType">Card Type</label>
            <select
              id="cardType"
              value={paymentDetails.card_type}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, card_type: e.target.value })}
            >
              <option value="">Select Card Type</option>
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
              <option value="American Express">American Express</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="securityCode">Security Code</label>
            <input
              type="text"
              id="securityCode"
              value={paymentDetails.code}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, code: e.target.value })}
              placeholder="Enter the security code"
            />
          </div>
          <div className="button-group">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="proceed-button" onClick={handleProceed}>
              Proceed with Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
