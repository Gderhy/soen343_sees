// src/pages/RegisterStakeholder/RegisterStakeholder.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase/supabase";
import "./RegisterStakeholder.css";

const RegisterStakeholder: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
          phone,
          systemRole: "stakeholder",
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Registration successful! Please check your email to confirm.");
      navigate("/login");
    }
  };

  return (
    <div className="stakeholder-container">
      <h2>Register as a Stakeholder</h2>
      <form onSubmit={handleRegister} className="stakeholder-form">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMsg && <p className="error">{errorMsg}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterStakeholder;
