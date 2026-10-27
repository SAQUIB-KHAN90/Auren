import { useEffect, useRef, useState } from 'react'

// The 3D stages pull in three.js and a model the moment they mount. Holding
// them until the section is nearly in view keeps that cost off the first load
// without changing what the section does once you reach it.
export default function useNearViewport(rootMargin = '500px') {
  const ref = useRef(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        observer.disconnect()
      },
      { rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [near, rootMargin])

  return [ref, near]
}
