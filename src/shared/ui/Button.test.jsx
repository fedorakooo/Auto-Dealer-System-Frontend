import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/shared/ui/Button.jsx'

describe('Button', () => {
  it('renders label', () => {
    render(<Button type="button">Continue</Button>)
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
  })
})
