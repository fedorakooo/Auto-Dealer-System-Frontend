import { useState } from 'react'
import clsx from 'clsx'
import { Field, fieldControlClass } from '@/shared/ui/Field.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'

export function Input({ id, label, error, hint, required, className, inputClassName, ...rest }) {
  return (
    <Field
      id={id}
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      {(aria) => <input className={clsx(fieldControlClass, inputClassName)} {...aria} {...rest} />}
    </Field>
  )
}

/** Password input with a built-in show/hide toggle that stays aligned when errors appear. */
export function PasswordInput({ id, label, error, hint, required, className, ...rest }) {
  const [visible, setVisible] = useState(false)
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
        <div className="relative">
          <input
            className={clsx(fieldControlClass, 'pr-11')}
            type={visible ? 'text' : 'password'}
            {...aria}
            {...rest}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
            aria-pressed={visible}
          >
            <Icon name={visible ? 'eyeOff' : 'eye'} className="h-5 w-5" />
          </button>
        </div>
      )}
    </Field>
  )
}
