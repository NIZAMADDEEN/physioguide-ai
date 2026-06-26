import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";
import Card from "../components/common/Card";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3">
      {/* Decorative background blurs */}
      <div
        className="position-absolute rounded-circle bg-secondary-color opacity-25"
        style={{
          width: "400px",
          height: "400px",
          filter: "blur(100px)",
          top: "-10%",
          left: "-5%",
        }}
      />
      <div
        className="position-absolute rounded-circle bg-primary-color opacity-25"
        style={{
          width: "300px",
          height: "300px",
          filter: "blur(80px)",
          bottom: "-5%",
          right: "-5%",
        }}
      />

      <Card
        elevation={2}
        className="w-100 position-relative glass-card z-1"
        style={{ maxWidth: "480px" }}
        padding="xl"
      >
        <div className="text-center mb-4">
          <h1 className="text-headline-lg mb-2">Create Account</h1>
          <p className="text-body-md text-on-surface-variant">
            Start your guided recovery journey today.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-label-sm rounded-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            id="name"
            label="Full Name"
            placeholder="Jane Doe"
            icon="person"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            icon="mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            icon="lock"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <InputField
            id="confirm"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon="lock_reset"
            value={formData.confirm}
            onChange={handleChange}
            required
          />

          <div className="form-check mb-4 mt-2">
            <input
              className="form-check-input border-outline"
              type="checkbox"
              id="terms"
              required
            />
            <label
              className="form-check-label text-label-sm text-on-surface-variant"
              htmlFor="terms"
            >
              I agree to the{" "}
              <Link to="#" className="text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="text-primary">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <Button type="submit" loading={loading} className="w-100 mb-4">
            Create Account
          </Button>
        </form>

        <div className="text-center text-label-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="text-primary text-decoration-none font-bold"
          >
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
