import { Link } from 'react-router'

import { useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion"

import { ThermometerSnowflakeIcon } from 'lucide-react'
import { SnowflakeIcon } from 'lucide-react'

const cards = [
  {
    name: 'Simulator',
    description: 'Consectetur vel non. Rerum ut consequatur nobis unde. Enim est quo corrupti consequatur.',
    to: '/simulator'
  },
  {
    name: 'Rørskjema-tegner',
    description: 'Quod possimus sit modi rerum exercitationem quaerat atque tenetur ullam.',
    to: '/diagram'
  },
  {
    name: 'Komponenter',
    description: 'Ratione et porro eligendi est sed ratione rerum itaque. Placeat accusantium impedit eum odit.',
    to: '/components'
  },
]
function HomePage() {

  return (
    <>
      <motion.section
        className='relative isolate grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 z-10 text-gray-200'
      >
        <div className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl">
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          />
        </div>
        <div className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu">
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
              <SnowflakeIcon size={40} />
              Kulde.app
            </h2>
            <p className="mt-8 text-pretty text-lg font-medium text-gray-400 sm:text-xl/8">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
              fugiat veniam occaecat fugiat.
            </p>
          </div>
          <div className="mx-auto mt-16 grid z-10 max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {cards.map((card) => (
              <Link to={card.to}>
                <motion.div
                  onHoverStart={(e) => { console.log("hei") }}
                  whileHover={{ scale: 1.03 }}
                  key={card.name} className="flex hover:border-cyan-50 gap-x-4 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
                  <div className="text-base/7">
                    <h3 className="font-semibold text-white">{card.name}</h3>
                    <p className="mt-2 text-gray-300">{card.description}</p>
                  </div>
                </motion.div>

              </Link>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  )
}

export default HomePage
