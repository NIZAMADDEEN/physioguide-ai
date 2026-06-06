import { useId } from 'react';
import { classNames } from '../../utils/helpers';

/**
 * Reusable InputField component matching DESIGN.md
 */
export default function InputField({
  label,
  type = 'text',
  error,
  icon,
  className,
  id: customId,
  ...props
}) {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <div className={classNames('mb-3', className)}>
      {label && (
        <label htmlFor={id} className="form-label text-label-sm mb-1 text-on-surface">
          {label} {props.required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="position-relative">
        {icon && (
          <span
            className="material-symbols-outlined position-absolute top-50 translate-middle-y text-outline"
            style={{ left: '12px', fontSize: 20 }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          className={classNames(
            'form-control pg-input',
            icon ? 'ps-5' : '',
            error ? 'is-invalid' : ''
          )}
          {...props}
        />
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
