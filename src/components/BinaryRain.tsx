import { useMemo } from 'react'

function makeColumn(seed: number, len: number) {
  let s = seed
  return Array.from({ length: len }, () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return (s & 1) === 1 ? '1' : '0'
  }).join('\n')
}

const COLUMN_SEEDS = [42, 91, 17, 203, 55, 88, 12, 144, 77, 31, 66, 5, 199, 22, 58, 103, 7, 81, 44, 120]

export function BinaryRain({ className = '', dense = false }: { className?: string; dense?: boolean }) {
  const columns = useMemo(() => {
    const count = dense ? 20 : 14
    const len = dense ? 36 : 28
    return COLUMN_SEEDS.slice(0, count).map((seed, i) => ({
      id: i,
      text: makeColumn(seed + i * 997, len),
    }))
  }, [dense])

  return (
    <div className={`binary-rain ${dense ? 'binary-rain--dense' : ''} ${className}`.trim()} aria-hidden>
      {columns.map((col) => (
        <span className="binary-rain__col" key={col.id}>
          {col.text}
        </span>
      ))}
    </div>
  )
}
