import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../contexts/AuthContext";
import { University } from "../../types";
import { fetchUniversities } from "../../services/backend/all";

const CAREER_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "faculty", label: "Faculty" },
  { value: "professional", label: "Professional" },
  { value: "other", label: "Other" },
];

const Register: React.FC = () => {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<University[]>([]);
  const [universitySuggestions, setUniversitySuggestions] = useState<University[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const universityInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [career, setCareer] = useState("student");

  useEffect(() => {
    if (user) {
      navigate("/events");
    }
  }, [user, navigate]);

  useEffect(() => {
    const getUniversities = async () => {
      const { data } = await fetchUniversities();
      if (data) {
        setUniversities(data);
        setUniversitySuggestions(data);
      }
    };
    getUniversities();
  }, []);

  const showUniversityField = career === "student" || career === "faculty";

  const handleUniversityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    setUniversity(input);

    if (input.length >= 0 ) { // Filter universities based on user input -- case-insensitive -- if db is large, consider using 2 letters
      const filtered = universities.filter((uni) => uni.full_name.toLowerCase().includes(input));
      setUniversitySuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setUniversitySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectUniversity = (uni: University) => {
    setUniversity(uni.full_name);
    setUniversitySuggestions([]);
    setShowSuggestions(false);
    universityInputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (universityInputRef.current && !universityInputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await signUp({
      fullName,
      email,
      phone,
      password,
      university: showUniversityField ? university : "",
      career,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/login");
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
          autoComplete="name"
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
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <div className="form-group">
          <label htmlFor="career-select">Career:</label>
          <select
            id="career-select"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            className="career-select"
          >
            {CAREER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {showUniversityField && (
          <div className="autocomplete-container" ref={universityInputRef}>
            <input
              type="text"
              placeholder="University"
              value={university}
              onChange={handleUniversityInput}
              required={showUniversityField}
              onFocus={() => setShowSuggestions(true)}
              // autoComplete="organization"
            />
            {showSuggestions && universitySuggestions.length > 0 && (
              <ul className="suggestions-list">
                {universitySuggestions.map((uni) => (
                  <li key={uni.id} onClick={() => selectUniversity(uni)}>
                    {uni.full_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
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
