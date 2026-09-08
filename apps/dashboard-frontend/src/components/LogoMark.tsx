import type { SVGProps } from 'react'

export function LogoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className} {...props}>
      <path d="M16 3.5 26.8 9.75v12.5L16 28.5 5.2 22.25V9.75L16 3.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 9.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z" fill="currentColor" />
      <circle cx="16" cy="16" r="2.1" fill="var(--background)" />
      <circle cx="16" cy="3.5" r="2" fill="currentColor" />
      <circle cx="26.8" cy="22.25" r="2" fill="currentColor" />
    </svg>
  )
}
