import { useState, useEffect, useCallback } from 'react'

type Status = 'idle' | 'pending' | 'success' | 'error'

interface UseAsync<T, E = string> {
  execute: () => Promise<void>
  status: Status
  data: T | null
  error: E | null
}

//  It's generally a good practice to indicate to users the status of any async request.
//  An example would be fetching data from an API and displaying a loading indicator before
//  rendering the results. Another example would be a form where you want to disable the submit
//  button when the submission is pending and then display either a success or error message when
//  it completes. Rather than litter your components with a bunch of useState calls to keep track
//  of the state of an async function, you can use our custom hook which takes an async function as
//  an input and returns the data, error, and status values we need to properly update our UI.
//  Possible values for status prop are: "idle", "pending", "success", "error". As you'll see in the code
//  below, our hook allows both immediate execution and delayed execution using the returned execute function.
//  https://usehooks.com/useAsync/

export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsync<T, E> => {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  // The execute function wraps asyncFunction and
  // handles setting state for pending, data, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)

    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
    } catch (error) {
      setError(error)
      setStatus('error')
    }
  }, [asyncFunction])

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, data, error }
}
