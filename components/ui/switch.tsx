'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className="peer sr-only"
          {...props}
        />
        <div className={cn(
          'h-5 w-9 rounded-full border border-input bg-muted transition-colors',
          'peer-checked:bg-foreground peer-checked:border-foreground',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
          className
        )} />
        <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
)
Switch.displayName = 'Switch'

export { Switch }
