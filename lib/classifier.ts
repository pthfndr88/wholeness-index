export interface ClassifierItem {
  id: number
  domain: 'I' | 'Ch' | 'Co' | 'Im' | 'Dx'
  text: string
  signal?: 'seek' | 'pow' | 'gem'
}

export type ArchetypeKey = 'seek' | 'pow' | 'gem' | 'frag' | 'aln'

export interface DomainScores { I: number; Ch: number; Co: number; Im: number }

export interface ClassifierResult {
  archetype: ArchetypeKey
  confidence: number
  scores: DomainScores
}

export const CLASSIFIER_ITEMS: ClassifierItem[] = [
  { id: 1,  domain: 'I',  text: "I can articulate what I am uniquely positioned to contribute — and do it clearly in under two minutes." },
  { id: 2,  domain: 'I',  text: "My sense of who I am stays consistent whether I'm at work, under pressure, or starting over." },
  { id: 3,  domain: 'I',  text: "I know what I want my legacy to be. I could write it down right now." },
  { id: 4,  domain: 'Ch', text: "When something needs to be said, I say it — even when it's uncomfortable or politically risky." },
  { id: 5,  domain: 'Ch', text: "The people who know me well trust that I follow through. My word is reliable." },
  { id: 6,  domain: 'Ch', text: "I can sustain effort on things that matter even with no immediate recognition or reward." },
  { id: 7,  domain: 'Co', text: "When I encounter a problem I haven't faced before, I find a way through it." },
  { id: 8,  domain: 'Co', text: "I consistently produce work I'm proud of. My standard doesn't slip under pressure." },
  { id: 9,  domain: 'Co', text: "I can translate complex ideas into clear, concrete outputs that other people can use." },
  { id: 10, domain: 'Im', text: "My contributions are recognised by the people who matter in my field or organisation." },
  { id: 11, domain: 'Im', text: "In the last six months, I have actively created opportunities — for myself or for others." },
  { id: 12, domain: 'Im', text: "People seek out my input, perspective, or involvement on things that genuinely matter." },
  { id: 13, domain: 'Dx', signal: 'seek', text: "I know clearly what I should be doing. I just haven't fully started yet." },
  { id: 14, domain: 'Dx', signal: 'pow',  text: "I'm often one of the most capable people in the room — but I'm not always sure which room I should be in." },
  { id: 15, domain: 'Dx', signal: 'gem',  text: "My work speaks for itself. I shouldn't need to actively promote it or make myself visible." },
]

function variance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  return values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length
}

export function classify(answers: Record<number, number>): ClassifierResult {
  const raw: Record<'I' | 'Ch' | 'Co' | 'Im', number[]> = { I: [], Ch: [], Co: [], Im: [] }
  const dx: Record<string, number> = { seek: 0, pow: 0, gem: 0 }

  CLASSIFIER_ITEMS.forEach(item => {
    const val = answers[item.id] ?? 3
    if (item.domain === 'Dx' && item.signal) dx[item.signal] = val / 5
    else if (item.domain !== 'Dx') raw[item.domain as 'I' | 'Ch' | 'Co' | 'Im'].push(val)
  })

  const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
  const scores: DomainScores = {
    I: avg(raw.I) / 5, Ch: avg(raw.Ch) / 5, Co: avg(raw.Co) / 5, Im: avg(raw.Im) / 5,
  }

  const { I, Ch, Co, Im } = scores
  const allDomains = [I, Ch, Co, Im]
  const v = Math.sqrt(variance(allDomains))
  const aIndex = 1 - (Math.abs(I - Im) + Math.abs(Ch - Co)) / 2

  let archetype: ArchetypeKey
  let confidence: number

  if (allDomains.every(d => d >= 0.68) && aIndex > 0.72 && v < 0.12) {
    archetype = 'aln'; confidence = 0.6 + (allDomains.reduce((a, b) => a + b, 0) / 4 - 0.68) * 2
  } else if (I >= 0.62 && Ch >= 0.54 && Co >= 0.54 && Im < 0.44 && (I + Ch + Co) / 3 > Im + 0.22) {
    archetype = 'gem'; confidence = 0.55 + (((I + Ch + Co) / 3 - Im) + dx.gem * 0.3) * 0.5
  } else if (I >= 0.62 && (Ch + Co) / 2 < 0.46 && Im < 0.40) {
    archetype = 'seek'; confidence = 0.5 + ((I - (Ch + Co) / 2) * 0.7 + dx.seek * 0.3) * 0.6
  } else if (I < 0.52 && (Ch + Co) / 2 >= 0.56) {
    archetype = 'pow'; confidence = 0.5 + (((Ch + Co) / 2 - I) * 0.7 + dx.pow * 0.3) * 0.6
  } else if (v >= 0.18) {
    archetype = 'frag'; confidence = 0.45 + v * 0.8
  } else {
    const signals: Record<ArchetypeKey, number> = {
      seek: I * 0.5 + (1 - (Ch + Co) / 2) * 0.3 + dx.seek * 0.2,
      pow:  (Ch + Co) / 2 * 0.5 + (1 - I) * 0.3 + dx.pow * 0.2,
      gem:  (I + Ch + Co) / 3 * 0.4 + (1 - Im) * 0.3 + dx.gem * 0.3,
      frag: v * 2,
      aln:  (allDomains.reduce((a, b) => a + b, 0) / 4) * 0.6 + aIndex * 0.4,
    }
    archetype = (Object.keys(signals) as ArchetypeKey[]).reduce((a, b) => signals[a] > signals[b] ? a : b)
    confidence = 0.42
  }

  return { archetype, confidence: Math.min(0.95, Math.max(0.38, confidence)), scores }
}

export function confidenceLabel(c: number) {
  if (c >= 0.75) return 'High confidence'
  if (c >= 0.65) return 'Moderate confidence'
  return 'Low confidence — full assessment recommended'
}
