import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { parseApiError } from '@/services/api'
import { ROUTES } from '@/constants/routes.js'
import { USER_ROLES } from '@/constants/roles.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { AuthCard } from '@/shared/ui/AuthCard.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Input, PasswordInput } from '@/shared/ui/Input.jsx'
import { t } from '@/shared/i18n/index.js'

const schema = z.object({
  first_name: z.string().min(1, { error: () => t('auth.validation.required') }),
  second_name: z.string().min(1, { error: () => t('auth.validation.required') }),
  phone_number: z.string().min(5, { error: () => t('auth.validation.phone') }),
  email: z.string().email({ error: () => t('auth.validation.email') }),
  password: z.string().min(6, { error: () => t('auth.validation.passwordMin') }),
})

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    setFormError('')
    try {
      await registerUser({ ...values, role: USER_ROLES.customer })
      navigate(ROUTES.login, { replace: true, state: { registered: true } })
    } catch (error) {
      setFormError(parseApiError(error).message)
    }
  }

  return (
    <AuthCard
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
      footer={
        <>
          {t('auth.register.haveAccount')}{' '}
          <Link to={ROUTES.login} className="link">
            {t('auth.register.loginLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Input
            id="first_name"
            label={t('auth.register.firstName')}
            autoComplete="given-name"
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            id="second_name"
            label={t('auth.register.lastName')}
            autoComplete="family-name"
            error={errors.second_name?.message}
            {...register('second_name')}
          />
        </div>
        <Input
          id="phone_number"
          label={t('auth.register.phone')}
          type="tel"
          autoComplete="tel"
          error={errors.phone_number?.message}
          {...register('phone_number')}
        />
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
          autoComplete="new-password"
          hint={t('auth.validation.passwordMin')}
          error={errors.password?.message}
          {...register('password')}
        />
        {formError ? <Alert variant="danger">{formError}</Alert> : null}
        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          {isSubmitting ? t('auth.register.submitting') : t('auth.register.submit')}
        </Button>
      </form>
    </AuthCard>
  )
}
