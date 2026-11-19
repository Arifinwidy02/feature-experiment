import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { buttonStyles, type ButtonSize, type ButtonVariant } from './buttonStyles'

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export function ButtonLink({ variant, size, fullWidth, className, ...rest }: ButtonLinkProps) {
  return <Link className={cn(buttonStyles({ variant, size, fullWidth }), className)} {...rest} />
}
