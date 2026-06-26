import { useEffect } from "react";
import { classNames } from "../../utils/helpers";

/**
 * Reusable Modal component with glassmorphism backdrop.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass =
    size === "sm"
      ? "max-w-sm"
      : size === "lg"
        ? "max-w-lg"
        : size === "xl"
          ? "max-w-xl"
          : "max-w-md";

  return (
    <div
      className="position-fixed inset-0 z-3"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050,
        backgroundColor: "rgba(11, 28, 48, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-md)",
      }}
      onClick={onClose}
    >
      <div
        className={classNames(
          "bg-surface w-100 rounded-4 shadow-xl",
          maxWidthClass,
        )}
        style={{ maxWidth: size === "lg" ? "800px" : "500px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between p-4 border-bottom border-outline-variant">
          <h3 className="text-headline-md m-0">{title}</h3>
          <button
            onClick={onClose}
            className="btn-close"
            aria-label="Close"
            style={{ filter: "none" }} // Ensure visibility against backgrounds
          />
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
