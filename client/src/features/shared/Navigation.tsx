import { cn } from '@/lib/utils'
import { Snowflake } from 'lucide-react'
import { motion } from 'motion/react'
import type { Dispatch, SetStateAction } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

type Position = { left: number; width: number; opacity: number }
type TabProps = {
  to: string
  label: string
  setPosition: Dispatch<SetStateAction<Position>>
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative inline-grid h-8 items-center justify-center rounded-full px-4',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    'focus-visible:text-gray-900 dark:focus-visible:text-white',
    'after:font-semibold after:col-start-1 after:row-start-1',
    'after:invisible after:content-[attr(data-label)]',
    isActive
      ? cn(
          'bg-white font-semibold text-zinc-900 dark:text-slate-100 shadow-sm dark:bg-slate-900 dark:text-neutral-100 dark:shadow-none',
        )
      : cn('text-zinc-500 dark:text-slate-400'),
  )

export const Navigation = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'navbar' })

  const links = [
    { to: '/simulator', label: t('simulator') },
    { to: '/diagram-drawer', label: t('diagram-drawer') },
  ]

  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  })

  return (
    <header className="grid h-16 w-full grid-cols-3 items-center">
      <span
        aria-hidden="true"
        className="justify-self-start px-8 text-zinc-500 dark:text-slate-500"
      >
        <Snowflake />
      </span>

      <nav className="h-10 justify-self-center rounded-full bg-zinc-100 text-sm dark:bg-slate-800">
        <ul
          onMouseLeave={() => {
            setPosition((prev) => ({ ...prev, opacity: 0 }))
          }}
          className="focus-outline-0 relative mx-auto flex w-fit cursor-pointer rounded-full p-1"
        >
          {links.map((link) => (
            <Tab
              key={link.to}
              to={link.to}
              label={link.label}
              setPosition={setPosition}
            />
          ))}
          <Cursor position={position} />
        </ul>
      </nav>
    </header>
  )
}

const Tab = ({ to, label, setPosition }: TabProps) => {
  const liRef = useRef<HTMLLIElement>(null)

  const updatePosition = () => {
    const li = liRef.current
    if (!li) return

    setPosition({ left: li.offsetLeft, width: li.offsetWidth, opacity: 1 })
  }

  return (
    <li
      ref={liRef}
      onMouseEnter={updatePosition}
      className="relative z-10 block"
    >
      <NavLink
        viewTransition
        to={to}
        data-label={label}
        className={navLinkClass}
      >
        <span className="col-start-1 row-start-1">{label}</span>
      </NavLink>
    </li>
  )
}

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.div
      animate={{ ...position }}
      className="absolute z-0 h-8 rounded-full bg-zinc-200 shadow-inner dark:bg-slate-700"
      aria-hidden="true"
    />
  )
}
