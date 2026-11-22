/** Login, register, forbidden/not found pages (agent: public). */
export default {
  password: 'Password',
  validation: {
    email: 'Invalid email',
    passwordRequired: 'Enter your password',
    required: 'Required',
    phone: 'Enter a phone number',
    passwordMin: 'At least 6 characters',
  },
  login: {
    title: 'Sign in to your account',
    subtitle: 'Use the email and password of your account.',
    noAccount: 'No account?',
    registerLink: 'Sign up',
    registered: 'Account created. Sign in with your credentials.',
    submit: 'Sign in',
    submitting: 'Signing in…',
    demoHintStart: 'Demo mode: staff accounts are created from ',
    demoHintMiddle: ' when the API starts — their email and password (the ',
    demoHintEnd: ' field) are listed in that file.',
  },
  register: {
    title: 'Create an account',
    subtitle: 'Signing up as a customer takes less than a minute.',
    haveAccount: 'Already have an account?',
    loginLink: 'Sign in',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone',
    submit: 'Sign up',
    submitting: 'Submitting…',
  },
  notFound: {
    title: 'Page not found',
    description: 'The address may be mistyped, or the page has been moved.',
  },
  forbidden: {
    title: 'Access denied',
    description: 'Your account does not have permission to view this section.',
  },
}
