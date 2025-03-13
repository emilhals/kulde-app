import { createContext, ReactNode, useState } from 'react'

type ActionContextType = {
  action: string
  updateAction: React.Dispatch<React.SetStateAction<string>>
}
type ActionPropsType = {
  children: ReactNode
}

export const ActionContext = createContext<ActionContextType | null>(null)
export const ActionContextProvider = ({ children }: ActionPropsType) => {
  const [action, setAction] = useState<string>('SELECT')

  const updateAction: React.Dispatch<React.SetStateAction<string>> = (action) => setAction(action)

  return (
    <ActionContext.Provider value={{ action, updateAction }}>
      {children}
    </ActionContext.Provider>
  )
}
