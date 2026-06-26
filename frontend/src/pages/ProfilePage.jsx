import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/common/Card";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import { getInitials, formatDate } from "../utils/helpers";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        emergencyContact: user.emergencyContact || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="row g-4 max-w-container mx-auto">
      {/* Profile Summary Card */}
      <div className="col-12 col-xl-4">
        <Card
          padding="xl"
          className="text-center h-100 position-relative overflow-hidden"
        >
          <div
            className="position-absolute top-0 start-0 w-100 bg-primary-color"
            style={{ height: "120px" }}
          />

          <div
            className="rounded-circle bg-surface d-flex align-items-center justify-content-center mx-auto position-relative z-1 mb-4 shadow-sm"
            style={{
              width: "120px",
              height: "120px",
              marginTop: "40px",
              border: "4px solid #fff",
            }}
          >
            <span className="text-display-lg text-primary font-bold">
              {getInitials(user.name)}
            </span>
          </div>

          <h2 className="text-headline-lg mb-1">{user.name}</h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            {user.email}
          </p>

          <div className="d-flex justify-content-center gap-2 mb-5">
            <span className="badge rounded-pill bg-primary-color bg-opacity-10 text-primary text-label-sm px-3 py-2 text-capitalize">
              {user.role} Account
            </span>
          </div>

          <div className="text-start border-top border-outline-variant pt-4">
            <div className="text-label-sm text-on-surface-variant text-uppercase mb-3">
              Account Details
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-outline">
                calendar_today
              </span>
              <div>
                <div className="text-label-sm text-on-surface-variant">
                  Member Since
                </div>
                <div className="text-body-md font-bold">
                  {formatDate(user.memberSince)}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="material-symbols-outlined text-outline">
                shield
              </span>
              <div>
                <div className="text-label-sm text-on-surface-variant">
                  Data Privacy
                </div>
                <div className="text-body-md font-bold text-secondary">
                  HIPAA Compliant
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings Form */}
      <div className="col-12 col-xl-8">
        <Card padding="xl" className="h-100">
          <div className="border-bottom border-outline-variant pb-4 mb-4">
            <h2 className="text-headline-md m-0">Personal Information</h2>
            <p className="text-body-md text-on-surface-variant m-0 mt-1">
              Update your contact details and emergency contacts.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <InputField
                  id="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <InputField
                  id="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <InputField
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <InputField
                  id="emergencyContact"
                  label="Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Name — Phone"
                />
              </div>
            </div>

            <div className="border-top border-outline-variant pt-4 mb-5">
              <h3 className="text-label-md text-on-surface-variant text-uppercase mb-4">
                Preferences
              </h3>

              <div className="d-flex align-items-center justify-content-between p-3 bg-surface border border-outline-variant rounded-3 mb-3">
                <div>
                  <div className="font-bold text-label-md">
                    Email Notifications
                  </div>
                  <div className="text-label-sm text-on-surface-variant">
                    Receive daily reminders and weekly summaries.
                  </div>
                </div>
                <div className="form-check form-switch fs-4 m-0">
                  <input
                    className="form-check-input cursor-pointer"
                    type="checkbox"
                    role="switch"
                    id="emailNotif"
                    defaultChecked
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between p-3 bg-surface border border-outline-variant rounded-3">
                <div>
                  <div className="font-bold text-label-md">SMS Alerts</div>
                  <div className="text-label-sm text-on-surface-variant">
                    Get notified 1 hour before scheduled sessions.
                  </div>
                </div>
                <div className="form-check form-switch fs-4 m-0">
                  <input
                    className="form-check-input cursor-pointer"
                    type="checkbox"
                    role="switch"
                    id="smsNotif"
                    defaultChecked
                  />
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <Button type="submit" loading={loading} icon="save">
                Save Changes
              </Button>
              {success && (
                <span className="text-secondary d-flex align-items-center gap-1 text-label-sm font-bold fade-in">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18 }}
                  >
                    check_circle
                  </span>
                  Saved successfully
                </span>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
