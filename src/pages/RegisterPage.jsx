import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { parseApiError } from '@/services/api'
import { Button } from '@/shared/ui/Button.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { ROUTES } from '@/constants/routes.js'
import { USER_ROLES } from '@/constants/roles.js'
import { useState } from 'react'

const schema = z.object({
  first_name: z.string().min(1, 'Обязательно'),
  second_name: z.string().min(1, 'Обязательно'),
  phone_number: z.string().min(5, 'Укажите телефон'),
  email: z.string().email(),
  password: z.string().min(6, 'Минимум 6 символов'),
})

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    setFormError('')
    try {
      await registerUser({
        ...values,
        role: USER_ROLES.customer,
      })
      navigate(ROUTES.login, { replace: true, state: { registered: true } })
    } catch (e) {
      setFormError(parseApiError(e).message)
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <PageHeader
        kicker="Регистрация"
        title="Создать аккаунт"
        subtitle="Роль по умолчанию — покупатель."
      />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="first_name"
          label="Имя"
          error={errors.first_name?.message}
          {...register('first_name')}
        />
        <Input
          id="second_name"
          label="Фамилия"
          error={errors.second_name?.message}
          {...register('second_name')}
        />
        <Input
          id="phone_number"
          label="Телефон"
          error={errors.phone_number?.message}
          {...register('phone_number')}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="relative">
          <Input id="password" label="Пароль" type={showPassword ? 'text' : 'password'} autoComplete="new-password" error={errors.password?.message} {...register('password')} />
          <button type="button" className="absolute right-3 top-9 text-sm font-medium text-[var(--color-info)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" onClick={() => setShowPassword((value) => !value)} aria-pressed={showPassword}>
            {showPassword ? 'Скрыть' : 'Показать'}
          </button>
        </div>
        {formError ? (
          <p role="alert" className="form-error">
            {formError}
          </p>
        ) : null}
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Отправка…' : 'Зарегистрироваться'}
        </Button>
      </form>
      <p style={{ marginTop: '1.5rem' }}>
        Уже есть аккаунт? <Link to={ROUTES.login}>Войти</Link>
      </p>
    </div>
  )
}
