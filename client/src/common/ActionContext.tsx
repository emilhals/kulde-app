import { createContext, useState, useMemo } from 'react'

interface ActionContextType {
  action: string;
  updateAction: (action: string) => void;
}

export const ActionContext = createContext<ActionContextType | null>(null)
export const ActionContextProvider = ({ children }: { children: string }) => {
  const [action, setAction] = useState<ActionContextType>('SELECT')

  const updateAction = (action: string) => setAction(action)

  return (
    <ActionContext.Provider value={{ action, updateAction }}>
      {children}
    </ActionContext.Provider>
  )
}
