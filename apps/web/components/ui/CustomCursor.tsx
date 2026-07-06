'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canUseCustomCursor =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!canUseCustomCursor) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX - 4 + 'px'
      dot.style.top  = mouseY - 4 + 'px'
    }

    let rafId: number
    const animate = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      ring.style.left = ringX - 16 + 'px'
      ring.style.top  = ringY - 16 + 'px'
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    document.body.classList.add('has-custom-cursor')
    const onEnter = () => { dot.style.transform = 'scale(3)' }
    const onLeave = () => { dot.style.transform = 'scale(1)' }
    const onTextInputEnter = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const onTextInputLeave = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    document.addEventListener('mousemove', onMove)

    const bind = (el: HTMLElement) => {
      if (!el.dataset.cursorBound) {
        const isTextInput = el.matches('input, textarea, select, [contenteditable="true"]')
        el.addEventListener('mouseenter', isTextInput ? onTextInputEnter : onEnter)
        el.addEventListener('mouseleave', isTextInput ? onTextInputLeave : onLeave)
        el.dataset.cursorBound = 'true'
      }
    }
    document.querySelectorAll<HTMLElement>('a, button, [role="button"], input, textarea, select, [contenteditable="true"]').forEach(bind)

    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('a, button, [role="button"], input, textarea, select, [contenteditable="true"]').forEach(bind)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.body.classList.remove('has-custom-cursor')
      document.removeEventListener('mousemove', onMove)
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
