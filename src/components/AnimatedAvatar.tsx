import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useState } from 'react'
import type { SectionMeta } from '../data/siteContent'

type AnimatedAvatarProps = {
  section: SectionMeta
  ringSpin: MotionValue<number>
  ringSpinReverse: MotionValue<number>
  scrollProgress: MotionValue<number>
}

const idleBySection: Record<
  SectionMeta['id'],
  { y: number[]; rotate: number[]; scale: number[]; duration: number }
> = {
  about: { y: [0, -10, 0], rotate: [0, -2.2, 0], scale: [1, 1.03, 1], duration: 2.6 },
  projects: { y: [0, -7, 0], rotate: [0, -4.5, -1.5], scale: [1, 1.05, 1.02], duration: 2.2 },
  skills: { y: [0, -9, 0], rotate: [0, 2.4, 0], scale: [1, 1.045, 1], duration: 2.4 },
  experience: { y: [0, -5, 0], rotate: [0, 1.2, 0], scale: [1, 1.02, 1], duration: 3.1 },
  contact: { y: [0, -12, 0], rotate: [0, 2.8, 0], scale: [1, 1.06, 1.02], duration: 2.5 },
}

export function AnimatedAvatar({
  section,
  ringSpin,
  ringSpinReverse,
  scrollProgress,
}: AnimatedAvatarProps) {
  const [reactKey, setReactKey] = useState(0)
  const [lastBucket, setLastBucket] = useState(0)

  useMotionValueEvent(scrollProgress, 'change', (v) => {
    const bucket = Math.floor(v * 20)
    if (bucket !== lastBucket) {
      setLastBucket(bucket)
      setReactKey((n) => n + 1)
    }
  })

  useEffect(() => {
    for (const src of [
      '/avatar-about.jpg',
      '/avatar-projects.jpg',
      '/avatar-skills.jpg',
      '/avatar-experience.jpg',
      '/avatar-contact.jpg',
    ]) {
      const img = new Image()
      img.src = src
    }
  }, [])

  const idle = idleBySection[section.id]

  return (
    <div className="avatar-pod">
      <motion.div className="avatar-ring" style={{ rotate: ringSpin }} aria-hidden />
      <motion.div
        className="avatar-ring avatar-ring-delayed"
        style={{ rotate: ringSpinReverse }}
        aria-hidden
      />

      <div className="avatar-orbit" aria-hidden>
        {section.skillTags.map((tag, i) => (
          <motion.span
            className={`orbit-chip orbit-chip-${i}`}
            key={`${section.id}-${tag}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2.2 + i * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.12,
            }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="avatar-frame live"
        key={`react-${reactKey}`}
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.03, 1],
          boxShadow: [
            '0 0 0 1px rgba(61, 224, 208, 0.25), 0 24px 60px rgba(0,0,0,0.45)',
            '0 0 36px 5px rgba(61, 224, 208, 0.5), 0 24px 60px rgba(0,0,0,0.45)',
            '0 0 0 1px rgba(61, 224, 208, 0.25), 0 24px 60px rgba(0,0,0,0.45)',
          ],
        }}
        transition={{ duration: 0.45 }}
      >
        <div className="avatar-scan" aria-hidden />

        <motion.div
          className="avatar-actor"
          animate={{ y: idle.y, rotate: idle.rotate, scale: idle.scale }}
          transition={{ duration: idle.duration, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={section.avatarSrc}
              alt={`AI avatar of Chintan Panchal — ${section.gesture}`}
              className="avatar-full animated"
              src={section.avatarSrc}
              initial={{ opacity: 0, scale: 0.88, x: 24, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.06, x: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
        </motion.div>

        <div className="avatar-hologlow" aria-hidden />

        <AnimatePresence mode="wait">
          <motion.div
            className="avatar-expression-badge"
            key={section.expression}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <span className="expr-dot" aria-hidden />
            <span>{section.expression}</span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            className="avatar-gesture-label"
            key={section.gesture}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
          >
            {section.gesture}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
