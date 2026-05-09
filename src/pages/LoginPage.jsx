import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { parseApiError } from '@/services/api'
import { Button } from '@/shared/ui/Button.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { ROUTES } from '@/constants/routes.js'
import { SEED_EMPLOYEE_EMAILS } from '@/shared/config/seedEmployees.js'
import { isDev } from '@/shared/config/env.js'
import { useState } from 'react'

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
    } catch (e) {
      setFormError(parseApiError(e).message)
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <PageHeader
        kicker="Вход"
        title="Авторизация"
        subtitle="Используйте email и пароль учётной записи."
      />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="password"
          label="Пароль"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {formError ? (
          <p role="alert" style={{ color: '#fca5a5', marginBottom: '1rem' }}>
            {formError}
          </p>
        ) : null}
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Вход…' : 'Войти'}
        </Button>
      </form>
      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
        Нет аккаунта? <Link to={ROUTES.register}>Регистрация</Link>
      </p>
      {isDev ? (
        <p style={{ marginTop: '1.25rem', fontSize: '0.82rem', lineHeight: 1.45, opacity: 0.75 }}>
          Локальная разработка: сотрудники создаются из{' '}
          <code style={{ fontSize: '0.9em' }}>employees.yaml</code> при старте API; email:{' '}
          {SEED_EMPLOYEE_EMAILS.join(', ')}; пароли — поле{' '}
          <code style={{ fontSize: '0.9em' }}>password</code> в том же файле.
        </p>
      ) : null}
    </div>
  )
}
