import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate(); // Move this line before useEffect

  useEffect(() => {
    if (user) {
      console.log("User is already logged in");
      navigate("/");
    }
  }, [user, navigate]); // Add navigate to the dependency array

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await login({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p>
          Don't have an account yet? <a href="/register">Register here</a>
        </p>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
