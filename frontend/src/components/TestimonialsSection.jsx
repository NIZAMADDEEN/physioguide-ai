import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    avatar_url: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null); // 'submitting', 'success', 'error'
  const sectionRef = useRef(null);

  useScrollReveal(sectionRef, ".scroll-reveal", 0.1, [testimonials]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials");
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", role: "", content: "", avatar_url: "" });
        fetchTestimonials();
        setTimeout(() => {
          setShowModal(false);
          setSubmitStatus(null);
        }, 1500);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-xl md:py-32 bg-white scroll-reveal"
      id="testimonials"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-xl">
        <h2 className="text-center text-headline-lg font-headline-lg mb-xl scroll-reveal">
          Trusted by Patients and Pros
        </h2>

        {loading ? (
          <div className="text-center text-on-surface-variant">
            Loading stories...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {testimonials.map((t, index) => (
              <div
                key={t.id}
                className="bg-surface p-xl rounded-2xl border border-outline-variant relative scroll-reveal"
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <span className="material-symbols-outlined text-secondary absolute top-6 right-8 text-[48px] opacity-20">
                  format_quote
                </span>
                <div className="flex gap-md items-center mb-md">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-container flex items-center justify-center text-on-primary-container text-2xl font-bold shrink-0">
                    {t.avatar_url ? (
                      <img
                        alt={t.name}
                        className="w-full h-full object-cover"
                        src={t.avatar_url}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[32px]">
                        person
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-on-surface">{t.name}</div>
                    <div className="text-label-sm text-secondary uppercase">
                      {t.role}
                    </div>
                  </div>
                </div>
                <p className="text-headline-md italic font-medium text-on-surface leading-relaxed">
                  {t.content}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-xl text-center">
          <button
            onClick={() => setShowModal(true)}
            className="btn-pg-secondary hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined">edit_note</span>
            Submit Your Story
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0">
              <h3 className="text-headline-md font-headline-md text-on-surface">
                Share Your Story
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-outline-variant/30 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
              <div className="p-lg flex flex-col gap-md overflow-y-auto">
                {submitStatus === "success" && (
                  <div className="bg-secondary-container/20 text-secondary p-sm rounded-lg flex items-center gap-xs">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                    Testimonial submitted successfully!
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="bg-error-container text-on-error-container p-sm rounded-lg flex items-center gap-xs">
                    <span className="material-symbols-outlined">error</span>
                    Something went wrong. Please try again.
                  </div>
                )}

                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface font-bold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface font-bold">
                    Your Role / Condition
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. Shoulder Rehab Patient"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface font-bold">
                    Profile Picture (Optional)
                  </label>
                  <div className="flex items-center gap-md">
                    {formData.avatar_url && (
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-outline-variant">
                        <img
                          src={formData.avatar_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-label-md file:bg-primary-container file:text-on-primary-container hover:file:bg-primary-container/80 transition-all cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface font-bold">
                    Your Story
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    placeholder='"VirtuGym helped me..."'
                  ></textarea>
                </div>
              </div>

              <div className="p-lg border-t border-outline-variant flex justify-end gap-sm bg-surface shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-lg py-sm rounded-lg text-on-surface-variant font-label-md hover:bg-outline-variant/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === "submitting"}
                  className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-xs"
                >
                  {submitStatus === "submitting"
                    ? "Submitting..."
                    : "Submit Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
