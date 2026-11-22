/** Login, register, forbidden/not found pages (agent: public). */
export default {
  password: 'Пароль',
  validation: {
    email: 'Некорректный email',
    passwordRequired: 'Введите пароль',
    required: 'Обязательно',
    phone: 'Укажите телефон',
    passwordMin: 'Минимум 6 символов',
  },
  login: {
    title: 'Вход в личный кабинет',
    subtitle: 'Используйте email и пароль вашей учётной записи.',
    noAccount: 'Нет аккаунта?',
    registerLink: 'Зарегистрироваться',
    registered: 'Аккаунт создан. Войдите, используя свои данные.',
    submit: 'Войти',
    submitting: 'Вход…',
    demoHintStart: 'Демо-режим: учётные записи сотрудников создаются из ',
    demoHintMiddle: ' при старте API — email и пароль (поле ',
    demoHintEnd: ') указаны в этом файле.',
  },
  register: {
    title: 'Создать аккаунт',
    subtitle: 'Регистрация покупателя занимает меньше минуты.',
    haveAccount: 'Уже есть аккаунт?',
    loginLink: 'Войти',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Телефон',
    submit: 'Зарегистрироваться',
    submitting: 'Отправка…',
  },
  notFound: {
    title: 'Страница не найдена',
    description: 'Возможно, адрес введён с ошибкой или страница была перемещена.',
  },
  forbidden: {
    title: 'Доступ запрещён',
    description: 'У вашей учётной записи недостаточно прав для этого раздела.',
  },
}
