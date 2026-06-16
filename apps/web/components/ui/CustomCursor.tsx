'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX - 4 + 'px'
      dot.style.top = mouseY - 4 + 'px'
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      ring.style.left = ringX - 16 + 'px'
      ring.style.top = ringY - 16 + 'px'
      requestAnimationFrame(animate)
    }

    const onEnter = () => { if (dot.style.transform !== 'scale(3)') dot.style.transform = 'scale(3)' }
    const onLeave = () => { if (dot.style.transform !== 'scale(1)') dot.style.transform = 'scale(1)' }

    document.addEventListener('mousemove', onMove)

    const bind = (el: HTMLElement) => {
      if (!el.dataset.cursorBound) {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        el.dataset.cursorBound = 'true'
      }
    }
    document.querySelectorAll<HTMLElement>('a, button, [role="button"], input, textarea, select').forEach((el) => bind(el))

    // Re-query on DOM changes for dynamically added elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('a, button, [role="button"], input, textarea, select').forEach((el) => bind(el))
    })
    observer.observe(document.body, { childList: true, subtree: true })

    animate()
    return () => {
      document.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
