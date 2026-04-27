'use client'

interface Props {
  scores: [number, number, number, number] // I, Ch, Co, Im — 0..1
  size?: number
  showLabels?: boolean
}

interface Band {
  key: (typeof domainKeys)[number]
  idx: number
  score: number
  weight: number
  yB: number
  yT: number
  wB: number
  wT: number
  TL: [number, number]
  TR: [number, number]
  BR: [number, number]
  BL: [number, number]
}

const domainKeys = ['identity', 'character', 'competence', 'impact'] as const

export default function TrapeziumDial({ scores, size = 400, showLabels = true }: Props) {
  const [sI, sCh, sCo, sIm] = scores

  const PAD_X = 160
  const VB_W = size + PAD_X * 2
  const VB_H = size + 110
  const cx = VB_W / 2

  const baseWidth = size * 0.86
  const topWidth  = size * 0.22
  const totalH    = size * 0.78
  const yBase     = (VB_H + totalH) / 2
  const yTop      = yBase - totalH

  const weights = [120, 60, 60, 120]
  const sumW = 360
  const bandHeights = weights.map(w => (w / sumW) * totalH)

  const widthAtY = (y: number) => {
    const t = (yBase - y) / totalH
    return baseWidth + (topWidth - baseWidth) * t
  }

  const colors = {
    identity:   '#1F3A32',
    character:  '#3E6057',
    competence: '#8C6E3E',
    impact:     '#B8955A',
  }

  const scoreArr = [sI, sCh, sCo, sIm]

  const bands: Band[] = []
  let yCursor = yBase
  for (let i = 0; i < 4; i++) {
    const yB = yCursor
    const yT = yCursor - bandHeights[i]
    const wB = widthAtY(yB)
    const wT = widthAtY(yT)
    bands.push({
      key: domainKeys[i], idx: i, score: scoreArr[i], weight: weights[i],
      yB, yT, wB, wT,
      TL: [cx - wT / 2, yT], TR: [cx + wT / 2, yT],
      BR: [cx + wB / 2, yB], BL: [cx - wB / 2, yB],
    })
    yCursor = yT
  }

  const wholeness = (sI * 120 + sCh * 60 + sCo * 60 + sIm * 120) / 360

  const labelMeta: Record<string, { name: string; mono: string; w: number }> = {
    identity:   { name: 'Identity',   mono: 'I',   w: 120 },
    character:  { name: 'Character',  mono: 'II',  w: 60 },
    competence: { name: 'Competence', mono: 'III', w: 60 },
    impact:     { name: 'Impact',     mono: 'IV',  w: 120 },
  }

  const wRatio = size / VB_H
  return (
    <svg
      width={VB_W * wRatio} height={size}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        {Object.entries(colors).map(([k, c]) => (
          <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity="0.95" />
            <stop offset="100%" stopColor={c} stopOpacity="1" />
          </linearGradient>
        ))}
      </defs>

      {/* Ghost outline */}
      <polygon
        points={`${cx - baseWidth/2},${yBase} ${cx + baseWidth/2},${yBase} ${cx + topWidth/2},${yTop} ${cx - topWidth/2},${yTop}`}
        fill="none" stroke="#B8955A" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.45"
      />

      {/* Band separators */}
      {bands.slice(0, 3).map((b, i) => {
        const w = widthAtY(b.yT)
        return <line key={i} x1={cx - w/2} y1={b.yT} x2={cx + w/2} y2={b.yT}
          stroke="#B8955A" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
      })}

      {/* Bands */}
      {bands.map(b => {
        const fillOpacity = 0.25 + 0.75 * b.score
        const strokeOpacity = 0.5 + 0.5 * b.score
        const pts = `${b.TL.join(',')  } ${b.TR.join(',')} ${b.BR.join(',')} ${b.BL.join(',')}`
        const midY = (b.yB + b.yT) / 2
        const lm = labelMeta[b.key]
        return (
          <g key={b.key}>
            <polygon points={pts}
              fill={`url(#g-${b.key})`} fillOpacity={fillOpacity}
              stroke={colors[b.key as keyof typeof colors]} strokeOpacity={strokeOpacity} strokeWidth="1"
            />
            {showLabels && (
              <text x={cx} y={midY + 5} textAnchor="middle"
                fontFamily="'JetBrains Mono', monospace" fontSize={b.weight >= 100 ? 11 : 9.5}
                letterSpacing="0.22em"
                fill={b.score > 0.35 ? '#FAF7F1' : colors[b.key as keyof typeof colors]}
                fillOpacity={b.score > 0.35 ? 0.95 : 0.7} fontWeight="500">
                {lm.name.toUpperCase()}
              </text>
            )}
            {showLabels && (
              <>
                <text x={cx + b.wB/2 + 18} y={midY - 2} textAnchor="start"
                  fontFamily="'Cormorant Garamond', serif" fontStyle="italic"
                  fontSize="14" fill="#0F2520" letterSpacing="0">
                  {lm.mono}
                </text>
                <text x={cx + b.wB/2 + 18} y={midY + 12} textAnchor="start"
                  fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#8C6E3E" letterSpacing="0.16em">
                  {Math.round(b.score * 100)}/100
                </text>
                <text x={cx - b.wB/2 - 18} y={midY + 4} textAnchor="end"
                  fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="rgba(26,22,20,0.5)" letterSpacing="0.18em">
                  w · {lm.w}
                </text>
              </>
            )}
          </g>
        )
      })}

      {/* Wholeness score */}
      <g>
        <text x={cx} y={yBase + 28} textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace" fontSize="9" letterSpacing="0.22em" fill="#8C6E3E">
          WHOLENESS · Σ / 360
        </text>
        <text x={cx} y={yBase + 54} textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif" fontStyle="italic"
          fontSize="24" fontWeight="500" fill="#0F2520">
          {wholeness.toFixed(3)}
        </text>
      </g>

      {/* Axis labels */}
      <g fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="0.26em" fill="#8C6E3E" fontWeight="500">
        <text x={cx} y={yTop - 18} textAnchor="middle">DO</text>
        <text x={cx} y={yBase + 78} textAnchor="middle">KNOW</text>
        <text x={cx - size * 0.52} y={(yBase + yTop)/2} textAnchor="middle"
          transform={`rotate(-90, ${cx - size * 0.52}, ${(yBase + yTop)/2})`}>BE</text>
        <text x={cx + size * 0.52} y={(yBase + yTop)/2} textAnchor="middle"
          transform={`rotate(90, ${cx + size * 0.52}, ${(yBase + yTop)/2})`}>BE</text>
      </g>
    </svg>
  )
}
