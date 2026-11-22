import { Field, fieldControlClass } from '@/shared/ui/Field.jsx'

export function Select({ id, label, error, hint, required, className, children, ...rest }) {
  return (
    <Field
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      {(aria) => (
        <select className={fieldControlClass} {...aria} {...rest}>
          {children}
        </select>
      )}
    </Field>
  )
}
