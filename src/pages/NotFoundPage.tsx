import { SearchX } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'

export default function NotFoundPage() {
  return (
    <EmptyState
      icon={<SearchX aria-hidden className="size-6" />}
      title="Page not found"
      description="The page you are looking for does not exist or has moved."
      action={<ButtonLink to="/">Back to home</ButtonLink>}
    />
  )
}
