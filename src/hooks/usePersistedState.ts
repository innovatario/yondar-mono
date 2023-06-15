import React from 'react'

export default function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] { // use unknown here https://typescript-eslint.io/rules/no-unsafe-return/#examples
  const [state, setState] = React.useState<T>(() => {
    const persistedState = localStorage.getItem(key)
    return persistedState ? JSON.parse(persistedState) : defaultValue
  })
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [state, key])
  return [state, setState]
}
