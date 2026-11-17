import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import FormField from '../../components/FormField'
import { useRegister } from './queries'

const EMPTY = { first_name: '', last_name: '', email: '', password: '' }

export default function RegisterForm() {
  const [form, setForm] = useState(EMPTY)
  const registerMutation = useRegister()
  const { fields, message } = registerMutation.isError
    ? parseApiError(registerMutation.error, 'Registration failed.')
    : { fields: {}, message: null }

  const bind = (name) => ({
    name,
    value: form[name],
    errors: fields[name],
    onChange: (e) => setForm({ ...form, [name]: e.target.value }),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    registerMutation.mutate(form)
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h1>Create your TaskHub account</h1>
      <div className="form-row">
        <FormField label="First name" autoComplete="given-name" {...bind('first_name')} />
        <FormField label="Last name" autoComplete="family-name" {...bind('last_name')} />
      </div>
      <FormField label="Email" type="email" required autoComplete="email" {...bind('email')} />
      <FormField
        label="Password"
        type="password"
        required
        autoComplete="new-password"
        {...bind('password')}
      />
      {message && <p className="error">{message}</p>}
      <button type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
