import type { ArchetypeKey } from './classifier'

export interface ArchetypeDefinition {
  key: ArchetypeKey
  name: string
  tagline: string
  meaning: string
  primaryDomain: string
  donts: string[]
  dos: string[]
  color: string
  colorLight: string
  colorMid: string
}

export const ARCHETYPES: Record<ArchetypeKey, ArchetypeDefinition> = {
  seek: {
    key: 'seek', name: 'The Seeker',
    tagline: "You know who you are. You haven't yet built the strength to act on it consistently.",
    meaning: "Your Identity is your asset — you have genuine self-clarity and purpose. The constraint is Character: the daily discipline, courage, and follow-through that translates knowing into doing. More self-reflection will not move you forward. Action will.",
    primaryDomain: 'Character',
    donts: ['Add more self-awareness tools or career exploration', 'Seek further clarity before starting', 'Take more courses before committing to action'],
    dos: ['Choose one character strength and practise it daily for 30 days', 'Commit to one visible output per week — published, shared, or presented', 'Find a witness, not a coach — someone who holds you accountable to action'],
    color: '#1e3a6e', colorLight: '#e8f0fb', colorMid: '#4a7cc4',
  },
  pow: {
    key: 'pow', name: 'The Powerhouse',
    tagline: "Impressive capacity. No orienting purpose. Your energy needs a compass.",
    meaning: "You execute with force and capability — but without a clear internal author directing that force. High output without a coherent self behind it eventually produces burnout or purposelessness. The work is Identity, not more performance.",
    primaryDomain: 'Identity',
    donts: ['Take on bigger stretch goals or more responsibilities', 'Accept further leadership training without identity work first', 'Continue optimising output without asking what it is actually for'],
    dos: ['Review your calendar — mark what energised you green, what drained you red', 'Write your personal leadership philosophy in one page and share it publicly', 'Say no to three things this month and notice what remains'],
    color: '#2d6a35', colorLight: '#e8f5ea', colorMid: '#4a9e5c',
  },
  gem: {
    key: 'gem', name: 'The Hidden Gem',
    tagline: "You are more formed than the world knows. The circuit is built — it's not yet connected to output.",
    meaning: "You have the internal substance — identity, character, and competence are all present. The gap is transmission: you are not yet making yourself visible in proportion to what you actually offer. This is not a confidence problem. It is a strategic positioning problem.",
    primaryDomain: 'Impact',
    donts: ['Invest in more skills development — the problem is not capability', 'Attend executive presence programmes without a visibility strategy', 'Wait to be recognised for work that already deserves recognition'],
    dos: ['Commit to one visibility action per day for 30 days', "Identify one sponsor who will make you visible when you're not in the room", 'Share one insight publicly this week — not when it\'s perfect, now'],
    color: '#7a4500', colorLight: '#fdf0e0', colorMid: '#c97810',
  },
  frag: {
    key: 'frag', name: 'The Fragmented',
    tagline: "You are in reconstruction, not failure. The structure is being rebuilt — sequencing is everything.",
    meaning: "Your scores are inconsistent across domains, which signals a transition state rather than a deficit. Something structural has shifted recently. The risk is applying development tools before stabilisation is achieved.",
    primaryDomain: 'Stabilisation first',
    donts: ['Set long-term goals or 5-year plans right now', 'Work on multiple domains simultaneously', 'Allow this to be classified as a motivation or performance issue'],
    dos: ['Choose one domain only and one practice within it for the next 30 days', 'Create a predictable daily structure — rhythm before growth', 'Reassess at 90 days — your archetype will clarify as you stabilise'],
    color: '#7a1f1f', colorLight: '#fdf0f0', colorMid: '#b04040',
  },
  aln: {
    key: 'aln', name: 'The Aligned Leader',
    tagline: "The circuit is complete. The question now is multiplication, not repair.",
    meaning: "Your four domains are proportional and mutually reinforcing. Identity grounds Character, Character powers Competence, and Competence produces Impact consistently. The development question has shifted: not how to grow, but how to scale what you are through systems, people, and legacy.",
    primaryDomain: 'Multiplication',
    donts: ['Apply remedial or generic leadership development', 'Treat current Formation Score as the finish line', "Accept roles that don't carry a legacy or systemic influence dimension"],
    dos: ['Map your mentee portfolio — who are you actively forming?', 'Write your legacy statement: what will be structurally different because you were fully deployed?', 'Install one non-negotiable weekly protection practice — reflective time that is not productive'],
    color: '#5b2d8a', colorLight: '#f3eafd', colorMid: '#9b59d0',
  },
}

export const DOMAIN_LABELS = { I: 'Identity', Ch: 'Character', Co: 'Competence', Im: 'Impact' }
