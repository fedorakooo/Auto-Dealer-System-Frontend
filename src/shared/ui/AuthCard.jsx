import { Brand } from '@/shared/ui/Brand.jsx'

/** Centered card shell shared by the sign-in and registration pages. */
export function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto w-full max-w-md py-4 sm:py-8">
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]">
        <div className="bg-[var(--color-primary)] px-6 py-5 sm:px-8">
          <Brand alwaysShowName showTagline />
        </div>
        <div className="px-6 py-7 sm:px-8">
          <h1 className="mb-1 text-2xl">{title}</h1>
          {subtitle ? <p className="mb-6 text-sm">{subtitle}</p> : <div className="mb-6" />}
          {children}
        </div>
      </div>
      {footer ? (
        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">{footer}</p>
      ) : null}
    </div>
  )
}
