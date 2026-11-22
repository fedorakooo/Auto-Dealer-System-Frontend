import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { parseApiError } from '@/services/api'
import { ROUTES } from '@/constants/routes.js'
import { useBrand } from '@/features/brand/brandContext.js'
import { isDev } from '@/shared/config/env.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { AuthCard } from '@/shared/ui/AuthCard.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Input, PasswordInput } from '@/shared/ui/Input.jsx'
import { t } from '@/shared/i18n/index.js'

const schema = z.object({
  email: z.string().email({ error: () => t('auth.validation.email') }),
  password: z.string().min(1, { error: () => t('auth.validation.passwordRequired') }),
})

export function LoginPage() {
  const { login } = useAuth()
  const brand = useBrand()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState('')

  const from = location.state?.from?.pathname || ROUTES.account
  const justRegistered = Boolean(location.state?.registered)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    setFormError('')
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (error) {
      setFormError(parseApiError(error).message)
    }
  }

  return (
    <AuthCard
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
      footer={
        <>
          {t('auth.login.noAccount')}{' '}
          <Link to={ROUTES.register} className="link">
            {t('auth.login.registerLink')}
          </Link>
        </>
      }
    >
      {justRegistered ? <Alert variant="success">{t('auth.login.registered')}</Alert> : null}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <PasswordInput
          id="password"
          label={t('auth.password')}
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {formError ? <Alert variant="danger">{formError}</Alert> : null}
        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
        </Button>
      </form>
      {isDev || brand.demo.show_login_hint ? (
        <p className="mt-6 mb-0 rounded-lg bg-[var(--color-surface-subtle)] p-3 text-xs leading-5">
          {t('auth.login.demoHintStart')}
          <code>employees.yaml</code>
          {t('auth.login.demoHintMiddle')}
          <code>password</code>
          {t('auth.login.demoHintEnd')}
        </p>
      ) : null}
    </AuthCard>
  )
}
