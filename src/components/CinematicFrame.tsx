import type { ReactNode } from 'react'

export default function CinematicFrame({ children }: { children: ReactNode }) {
  return (
    <div className="cinematic-frame film-frame">
      <div className="cinematic-frame__halation" aria-hidden="true" />
      <div className="cinematic-frame__grain cinematic-frame__grain--coarse" aria-hidden="true" />
      <div className="cinematic-frame__grain cinematic-frame__grain--fine" aria-hidden="true" />
      <div className="cinematic-frame__vignette" aria-hidden="true" />
      <div className="cinematic-frame__letterbox" aria-hidden="true" />
      {children}
    </div>
  )
}
