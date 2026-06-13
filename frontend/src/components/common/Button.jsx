import { classNames } from '../../utils/helpers';

/**
 * Reusable Button component matching DESIGN.md
 */
export default function Button({
  children,
  variant = 'primary', // primary, secondary, white, outline-white
  size = 'md', // sm, md, lg
  icon,
  loading = false,
  className,
  pill = false,
  disabled = false,
  ...props
}) {
  const baseClass = `btn-pg-${variant}`;
  const sizeClass = size === 'sm' ? 'py-1 px-3 text-sm' : size === 'lg' ? 'py-3 px-5 text-lg' : '';
  const pillClass = pill ? 'btn-pg-primary-pill' : ''; // Applies extra border radius
  const loadingClass = loading ? 'opacity-75' : '';

  return (
    <button
      className={classNames(baseClass, sizeClass, pillClass, loadingClass, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      ) : icon ? (
        <span className="material-symbols-outlined" style={{ fontSize: size === 'sm' ? 18 : 20 }}>
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
