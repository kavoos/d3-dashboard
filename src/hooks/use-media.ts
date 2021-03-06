import { useState, useEffect } from 'react'

/**
 * https://usehooks.com/useMedia/
 *
 * @param queries Media queries
 * @param values Column counts (relates to above media queries by array index)
 * @param defaultValue Default column count
 * @returns Matched value
 */
export const useMedia = <T = number>(queries: string[], values: T[], defaultValue: T): T => {
  // Array containing a media query list for each query
  const mediaQueryLists = queries.map(q => window.matchMedia(q))

  const getValue = () => {
    // Get index of first media query that matches
    const index = mediaQueryLists.findIndex(mql => mql.matches)
    // Return related value or defaultValue if none
    return values?.[index] || defaultValue
  }

  // State and setter for matched value
  const [value, setValue] = useState<T>(getValue)

  useEffect(
    () => {
      // Event listener callback
      // Note: By defining getValue outside of useEffect we ensure that it has
      // current values of hook args (as this hook callback is created once on mount).
      const handler = () => setValue(getValue)

      // Set a listener for each media query with above handler as callback.
      mediaQueryLists.forEach((mql) => mql.addEventListener('change', handler))

      // Remove listeners on cleanup
      return () =>
        mediaQueryLists.forEach((mql) => mql.removeEventListener('change', handler))
    }, []) // Empty array ensures effect is only run on mount and unmount

    return value
}