'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface Props {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  as?: 'button' | 'a' | 'div'
  href?: string
  target?: string
  rel?: string
}

export function MagneticButton({ children, className = '', strength = 0.3, onClick, as = 'button', href, target, rel }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14 })
  const sy = useSpring(y, { stiffness: 220, damping: 14 })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const mx = e.clientX - (r.left + r.width / 2)
    const my = e.clientY - (r.top + r.height / 2)
    x.set(mx * strength)
    y.set(my * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const commonProps = {
    ref,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style: { x: sx, y: sy },
    className,
  } as any

  if (as === 'a') {
    return (
      <motion.a href={href} target={target} rel={rel} {...commonProps}>
        {children}
      </motion.a>
    )
  }
  if (as === 'div') {
    return <motion.div {...commonProps}>{children}</motion.div>
  }
  return (
    <motion.button onClick={onClick} {...commonProps}>
      {children}
    </motion.button>
  )
}
