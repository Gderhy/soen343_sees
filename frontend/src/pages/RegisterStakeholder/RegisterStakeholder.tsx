import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase/supabase";
import "./RegisterStakeholder.css";

type StakeholderType = "educational" | "organization" | null;

const RegisterStakeholder: React.FC = () => {
  const navigate = useNavigate();
  const [stakeholderType, setStakeholderType] = useState<StakeholderType>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
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
          stakeholderType, // Add stakeholder type to user metadata
          address,
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

  if (!stakeholderType) {
    return (
      <div className="stakeholder-container">
        <h2>Register as a Stakeholder</h2>
        <div className="type-selection">
          <h3>Are you registering as:</h3>
          <button
            type="button"
            className="type-btn"
            onClick={() => setStakeholderType("educational")}
          >
            Educational Institution
          </button>
          <button
            type="button"
            className="type-btn"
            onClick={() => setStakeholderType("organization")}
          >
            Organization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stakeholder-container">
      <h2>
        Register as a{" "}
        {stakeholderType === "educational"
          ? "Educational Institution"
          : "Organization"}
      </h2>
      <form onSubmit={handleRegister} className="stakeholder-form">
        <input
          type="text"
          placeholder={
            stakeholderType === "educational"
              ? "Institution Name (e.g. Harvard University)"
              : "Organization Name (e.g. Red Cross)"
          }
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
        <div className="form-actions">
          <button
            type="button"
            className="back-btn"
            onClick={() => setStakeholderType(null)}
          >
            Back
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterStakeholder;
