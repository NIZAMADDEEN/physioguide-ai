import { classNames } from "../../utils/helpers";

/**
 * Reusable Card component matching DESIGN.md
 */
export default function Card({
  children,
  elevation = 1, // 1 (Level 1), 2 (Level 2 hoverable)
  padding = "lg", // sm, md, lg, xl
  hoverable = false,
  className,
  ...props
}) {
  const shadowClass = elevation === 2 ? "shadow-lg" : "shadow-sm";
  const paddingClass =
    padding === "sm"
      ? "p-2"
      : padding === "md"
        ? "p-3"
        : padding === "lg"
          ? "p-4"
          : padding === "xl"
            ? "p-5"
            : "";
  const hoverClass = hoverable ? "feature-card" : ""; // Reuse feature-card hover styling

  return (
    <div
      className={classNames(
        "bg-surface border border-outline-variant rounded-4", // rounded-4 is Bootstrap for 1rem
        shadowClass,
        paddingClass,
        hoverClass,
        className,
      )}
      style={
        !hoverable
          ? { transition: "box-shadow 0.25s ease, border-color 0.25s ease" }
          : {}
      }
      {...props}
    >
      {children}
    </div>
  );
}
