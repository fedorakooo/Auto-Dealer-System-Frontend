import clsx from 'clsx'
import { Field, fieldControlClass } from '@/shared/ui/Field.jsx'

export function Textarea({ id, label, error, hint, required, rows = 4, className, ...rest }) {
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
        <textarea
          rows={rows}
          className={clsx(fieldControlClass, 'min-h-24 resize-y text-sm')}
          {...aria}
          {...rest}
        />
      )}
    </Field>
  )
}
