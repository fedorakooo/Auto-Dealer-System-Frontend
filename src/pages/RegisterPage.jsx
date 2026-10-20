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

const schema = z.object({
  first_name: z.string().min(1, 'Обязательно'),
  second_name: z.string().min(1, 'Обязательно'),
  phone_number: z.string().min(5, 'Укажите телефон'),
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
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
      title="Создать аккаунт"
      subtitle="Регистрация покупателя занимает меньше минуты."
      footer={
        <>
          Уже есть аккаунт?{' '}
          <Link to={ROUTES.login} className="link">
            Войти
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Input
            id="first_name"
            label="Имя"
            autoComplete="given-name"
            error={errors.first_name?.message}
            {...register('first_name')}
          />
          <Input
            id="second_name"
            label="Фамилия"
            autoComplete="family-name"
            error={errors.second_name?.message}
            {...register('second_name')}
          />
        </div>
        <Input
          id="phone_number"
          label="Телефон"
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
          label="Пароль"
          autoComplete="new-password"
          hint="Минимум 6 символов"
          error={errors.password?.message}
          {...register('password')}
        />
        {formError ? <Alert variant="danger">{formError}</Alert> : null}
        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Отправка…' : 'Зарегистрироваться'}
        </Button>
      </form>
    </AuthCard>
  )
}
