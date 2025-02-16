import { useEffect, useState } from 'react'

import { ACTIONS } from '@/common/constants'

export const useAction = (input?) => {
  const [action, setAction] = useState(ACTIONS.SELECT)

  useEffect(() => {
    if (!input) return
    setAction(input)

    console.log('action', input)
    console.log(typeof (input))
  })
  return action
}
