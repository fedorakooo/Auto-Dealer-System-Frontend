import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { parseApiError } from '@/services/api'
import { ROUTES } from '@/constants/routes.js'
import { SEED_EMPLOYEE_EMAILS } from '@/shared/config/seedEmployees.js'
import { isDev } from '@/shared/config/env.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { AuthCard } from '@/shared/ui/AuthCard.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Input, PasswordInput } from '@/shared/ui/Input.jsx'

const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
})

export function LoginPage() {
  const { login } = useAuth()
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
      title="Вход в личный кабинет"
      subtitle="Используйте email и пароль вашей учётной записи."
      footer={
        <>
          Нет аккаунта?{' '}
          <Link to={ROUTES.register} className="link">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      {justRegistered ? (
        <Alert variant="success">Аккаунт создан. Войдите, используя свои данные.</Alert>
      ) : null}
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
          label="Пароль"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {formError ? <Alert variant="danger">{formError}</Alert> : null}
        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Вход…' : 'Войти'}
        </Button>
      </form>
      {isDev ? (
        <p className="mt-6 mb-0 rounded-lg bg-[var(--color-surface-subtle)] p-3 text-xs leading-5">
          Локальная разработка: сотрудники создаются из <code>employees.yaml</code> при старте API;
          email: {SEED_EMPLOYEE_EMAILS.join(', ')}; пароли — поле <code>password</code> в том же
          файле.
        </p>
      ) : null}
    </AuthCard>
  )
}
