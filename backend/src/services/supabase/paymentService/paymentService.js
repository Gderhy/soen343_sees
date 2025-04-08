const supabase = require("../supabaseAdmin");


const verifyPaymentDetails = async (paymentDetails) => {
  try {
    const {data, error} = await supabase
      .from("credit_cards")
      .select("*")
      .eq("name", paymentDetails.name)
      .eq("number", paymentDetails.number)
      .eq("exp_mm", paymentDetails.exp_mm)
      .eq("exp_yyyy", paymentDetails.exp_yyyy)
      .eq("code", paymentDetails.code)
      .eq("card_type", paymentDetails.card_type)
      .single();

    if (error) {
      console.error("Error fetching payment details:", error);
      return { data: null, error};
    }

    if (!data) {
      console.log("Payment details not found in the database.");
      return { data: null, error: "Payment details not found" };
    }

    return { data, error: null }; 
  } catch (err) {
    console.error("Error verifying payment details:", err);
    return { data: null, error: err };
  };
}

const createPaymentDetails = async (paymentDetails) => {
  try {
    const { data, error } = await supabase
      .from("credit_cards")
      .insert([paymentDetails])
      .single();

    if (error) {
      console.error("Error creating payment details:", error);
      return null;
    }

    console.log("Payment details created successfully:", data);
    return data;
  } catch (err) {
    console.error("Error creating payment details:", err);
    return null;
  };
}

const updatePaymentDetails = async (paymentDetails) => {
  try {
    const { data, error } = await supabase
      .from("credit_cards")
      .update(paymentDetails)
      .eq("id", paymentDetails.id)
      .single();

    if (error) {
      console.error("Error updating payment details:", error);
      return null;
    }

    console.log("Payment details updated successfully:", data);
    return data;
  } catch (err) {
    console.error("Error updating payment details:", err);
    return null;
  };
}

const deletePaymentDetails = async (paymentId) => {
  try {
    const { data, error } = await supabase
      .from("credit_cards")
      .delete()
      .eq("id", paymentId)
      .single();

    if (error) {
      console.error("Error deleting payment details:", error);
      return null;
    }

    console.log("Payment details deleted successfully:", data);
    return data;
  } catch (err) {
    console.error("Error deleting payment details:", err);
    return null;
  };
}

const insertPayment = async (paymentEntry) => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .insert([paymentEntry])
      .single();

    if (error) {
      console.error("Error inserting payment:", error);
      return {data: null, error};
    }

    console.log("Payment inserted successfully:", data);
    return {data, error: null};
  } catch (err) {
    console.error("Error inserting payment:", err);
    return {data: null, error: err};
  };
} 

module.exports = {
  verifyPaymentDetails,
  insertPayment,
};