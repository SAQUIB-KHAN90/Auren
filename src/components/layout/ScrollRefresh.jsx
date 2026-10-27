import { useLayoutEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ScrollTrigger measures the page once, on mount. Images, fonts and lazy
// sections land after that, so every start/end ends up offset against a page
// that has since grown — triggers then fire early, or never. Watching the
// document height and re-measuring whenever it actually changes fixes the lot
// in one place, instead of each page guessing when its own content settled.
export default function ScrollRefresh() {
  useLayoutEffect(() => {
    let frame = 0
    let lastHeight = 0

    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const height = Math.round(document.body.scrollHeight)
        // Guard against re-entering: refresh() must not loop with the observer.
        if (height === lastHeight) return
        lastHeight = height
        ScrollTrigger.refresh()
      })
    }

    const observer = new ResizeObserver(measure)
    observer.observe(document.body)

    // Covers the first paint, where the body height has not moved yet but
    // images are still decoding.
    window.addEventListener('load', measure)
    measure()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('load', measure)
    }
  }, [])

  return null
}
