import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";
import Card from "../components/common/Card";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3">
      {/* Decorative background blurs */}
      <div
        className="position-absolute rounded-circle bg-primary-color opacity-25"
        style={{
          width: "400px",
          height: "400px",
          filter: "blur(100px)",
          top: "-10%",
          right: "-5%",
        }}
      />
      <div
        className="position-absolute rounded-circle bg-secondary-color opacity-25"
        style={{
          width: "300px",
          height: "300px",
          filter: "blur(80px)",
          bottom: "-5%",
          left: "-5%",
        }}
      />

      <Card
        elevation={2}
        className="w-100 position-relative glass-card z-1"
        style={{ maxWidth: "440px" }}
        padding="xl"
      >
        <div className="text-center mb-4">
          <h1 className="text-headline-lg mb-2">Welcome Back</h1>
          <p className="text-body-md text-on-surface-variant">
            Sign in to continue your recovery
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-label-sm rounded-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            icon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label text-label-sm m-0 text-on-surface">
                Password *
              </label>
              <Link
                to="#"
                className="text-label-sm text-primary text-decoration-none hover-underline"
              >
                Forgot?
              </Link>
            </div>
            <InputField
              type="password"
              placeholder="••••••••"
              icon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" loading={loading} className="w-100 mb-4">
            Sign In
          </Button>
        </form>

        <div className="text-center text-label-sm text-on-surface-variant">
          Don't have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="text-primary text-decoration-none font-bold"
          >
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
}
