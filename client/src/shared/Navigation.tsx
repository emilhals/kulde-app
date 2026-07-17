import { Snowflake } from 'lucide-react'
import { useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { NavLink } from 'react-router'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/shared/contexts/theme-provider'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useTranslation } from 'react-i18next'

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
        'bg-white font-semibold text-zinc-900 dark:text-neutral-100 shadow-sm dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-none',
      )
      : cn('text-zinc-500 dark:text-neutral-400'),
  )

export const Navigation = () => {
  const { theme, setTheme } = useTheme()
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
    <header className="grid grid-cols-3 items-center w-full h-16">
      <span
        aria-hidden="true"
        className="justify-self-start px-8 text-zinc-500 dark:text-neutral-500"
      >
        <Snowflake />
      </span>

      <nav className="justify-self-center h-10 text-sm rounded-full bg-zinc-100 dark:bg-neutral-800/80">
        <ul
          onMouseLeave={() => {
            setPosition((prev) => ({ ...prev, opacity: 0 }))
          }}
          className="flex relative p-1 mx-auto rounded-full cursor-pointer w-fit focus-outline-0"
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

      <div className="justify-self-end px-8">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={
            theme === 'dark' ? t('switch-to-light') : t('switch-to-dark')
          }
        >
          {theme === 'dark' ? (
            <Sun aria-hidden="true" />
          ) : (
            <Moon aria-hidden="true" />
          )}
        </Button>
      </div>
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
      className="block relative z-10"
    >
      <NavLink to={to} data-label={label} className={navLinkClass}>
        <span className="col-start-1 row-start-1">{label}</span>
      </NavLink>
    </li>
  )
}

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.div
      animate={{ ...position }}
      className="absolute z-0 h-8 rounded-full shadow-inner bg-zinc-200 dark:bg-neutral-700"
      aria-hidden="true"
    />
  )
}
