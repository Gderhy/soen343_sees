import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../contexts/AuthContext";

const Register: React.FC = () => {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() =>{
    if (user) {
      navigate("/events");
    }
  }, [user, navigate]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setphone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await signUp({ fullName, email, phone, password,  });

    if (error) {
      setError(error.message);
    } else {
      navigate("/login"); // Redirect to events page after signup
    }
  };

  return (
    <div className="login-container">
      <h1>Register</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setphone(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
