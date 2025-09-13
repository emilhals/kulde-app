import { useEffect, useState } from 'react'
import WebFont from 'webfontloader'

export const useCustomFont = (fonts: string) => {
  const [fontLoaded, setFontLoaded] = useState<boolean>(false)

  useEffect(() => {
    WebFont.load({
      google: {
        families: [fonts],
      },
      fontactive: () => {
        setTimeout(() => {
          setFontLoaded(true)
        }, 1000)
      },
    })
  })

  return [fontLoaded]
}
