import { useState, useEffect } from 'react'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'

// Define general type for useWindowSize hook, which includes width and height
interface Size {
  width?: number
  height?: number
}

/**
 * This hook returns an object containing the window's width and height.
 * @returns `Size`
 */
export const useWindowSize = (): Size => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

/**
 * This hook returns an object containing the window's width and height.
 *
 * Debouncing window.onresize will only call the event handler after the event has stopped firing for a certain amount of time.
 * This will ensure that your function will only be called once the resizing is “complete.”
 *
 * @param delay delay after event is "complete" to run callback, default `250ms`
 * @returns `Size`
 */
export const useWindowSizeWithDebounce = (delay = 250): Size => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    const debounced = debounce(handleResize, delay)

    window.addEventListener('resize', debounced)

    return () => {
      debounced.cancel()
      window.removeEventListener('resize', debounced)
    }
  }, [])

  return windowSize
}

/**
 * This hook returns an object containing the window's width and height.
 *
 * Throttling window.onresize limits how often the event handler will be called by setting a timeout between calls.
 * This will allow you to call the function at a reasonable rate.
 *
 * @param delay delay between calls, default `250ms`
 * @returns `Size`
 */
export const useWindowSizeWithThrottle = (delay = 250): Size => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    const throttled = throttle(handleResize, delay)

    window.addEventListener('resize', throttled)

    return () => {
      throttled.cancel()
      window.removeEventListener('resize', throttled)
    }
  }, [])

  return windowSize
}