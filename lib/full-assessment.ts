// lib/full-assessment.ts
// Wholeness Index — Standard Assessment (72 items)
// 4 items per sub-domain × 5 sub-domains × 4 domains = 80 + 8 discriminators
// Trimmed to 72: 3–4 items per sub-domain, best-performing items retained
// Scoring: Formation Index (F), Alignment Index (A), Structural Integrity Index (SI)

export type Domain = 'I' | 'Ch' | 'Co' | 'Im'
export type SubDomain =
  | 'I_selfconcept' | 'I_purpose' | 'I_belief' | 'I_values' | 'I_narrative'
  | 'Ch_consistency' | 'Ch_ethics' | 'Ch_discipline' | 'Ch_courage' | 'Ch_integrity'
  | 'Co_skills' | 'Co_application' | 'Co_problemsolving' | 'Co_learning' | 'Co_execution'
  | 'Im_recognition' | 'Im_opportunity' | 'Im_influence' | 'Im_contribution' | 'Im_legacy'
  | 'Dx'

export interface FullItem {
  id: number
  domain: Domain | 'Dx'
  subdomain: SubDomain
  text: string
  reversed?: boolean
}

// ─── IDENTITY (20 items — 4 per sub-domain) ─────────────────────────────────

const IDENTITY_ITEMS: FullItem[] = [
  // Self-concept
  { id: 1,  domain: 'I', subdomain: 'I_selfconcept', text: "I have a settled, stable sense of who I am that does not depend on external validation or role titles." },
  { id: 2,  domain: 'I', subdomain: 'I_selfconcept', text: "When I face a significant setback, my sense of self remains intact rather than fragmenting with the circumstance." },
  { id: 3,  domain: 'I', subdomain: 'I_selfconcept', text: "I can distinguish between who I am and what I do. My identity is not collapsed into my current role or function." },
  { id: 4,  domain: 'I', subdomain: 'I_selfconcept', text: "I often feel that I present differently in different contexts and am not sure which version is the real one.", reversed: true },

  // Purpose
  { id: 5,  domain: 'I', subdomain: 'I_purpose', text: "I can state my purpose — the specific contribution I am here to make — in a single, clear sentence." },
  { id: 6,  domain: 'I', subdomain: 'I_purpose', text: "My daily work is connected, at least partially, to something I experience as genuinely meaningful." },
  { id: 7,  domain: 'I', subdomain: 'I_purpose', text: "I have a sense of what I want my life to have stood for at its end — not in vague terms, but with real specificity." },
  { id: 8,  domain: 'I', subdomain: 'I_purpose', text: "I regularly feel busy without a clear sense that what I'm doing actually matters.", reversed: true },

  // Belief alignment
  { id: 9,  domain: 'I', subdomain: 'I_belief', text: "The beliefs I hold about what is possible for me are broadly consistent with the level of contribution I want to make." },
  { id: 10, domain: 'I', subdomain: 'I_belief', text: "I believe I am fundamentally capable of doing the work I am called to do, even when I lack specific skills or knowledge." },
  { id: 11, domain: 'I', subdomain: 'I_belief', text: "I have identified and addressed at least one significant limiting belief that was constraining my development." },
  { id: 12, domain: 'I', subdomain: 'I_belief', text: "I often doubt whether I am truly capable of performing at the level I aspire to.", reversed: true },

  // Values
  { id: 13, domain: 'I', subdomain: 'I_values', text: "When I face a difficult decision, I have a reliable internal reference point — a felt sense of what is consistent with who I am." },
  { id: 14, domain: 'I', subdomain: 'I_values', text: "There is strong consistency between the values I would say I hold and the choices I actually make under pressure." },
  { id: 15, domain: 'I', subdomain: 'I_values', text: "I am clear about the non-negotiables — the lines I would not cross regardless of external pressure or incentive." },
  { id: 16, domain: 'I', subdomain: 'I_values', text: "I often feel pulled in different directions by competing obligations without a clear sense of which to prioritise.", reversed: true },

  // Narrative
  { id: 17, domain: 'I', subdomain: 'I_narrative', text: "I can tell the story of my life in a way that makes sense — connecting my past, present, and future into a coherent arc." },
  { id: 18, domain: 'I', subdomain: 'I_narrative', text: "I have reframed at least one significant painful experience into something that now functions as a source of strength or direction." },
  { id: 19, domain: 'I', subdomain: 'I_narrative', text: "I experience my past as a resource I draw on, rather than a burden I carry." },
  { id: 20, domain: 'I', subdomain: 'I_narrative', text: "I often feel that my history defines me in ways I would prefer not to be defined.", reversed: true },
]

// ─── CHARACTER (20 items — 4 per sub-domain) ────────────────────────────────

const CHARACTER_ITEMS: FullItem[] = [
  // Consistency
  { id: 21, domain: 'Ch', subdomain: 'Ch_consistency', text: "People who have worked closely with me would describe me as someone whose behaviour is predictable in the best sense — reliable and consistent." },
  { id: 22, domain: 'Ch', subdomain: 'Ch_consistency', text: "My commitments to others are ones I take seriously enough that breaking them feels genuinely costly to me." },
  { id: 23, domain: 'Ch', subdomain: 'Ch_consistency', text: "I behave the same way when I think I am not being observed as when I think I am." },
  { id: 24, domain: 'Ch', subdomain: 'Ch_consistency', text: "I often find myself making promises I do not fully intend to keep, or know I will struggle to keep.", reversed: true },

  // Ethics
  { id: 25, domain: 'Ch', subdomain: 'Ch_ethics', text: "I have a worked-out ethical framework — not just intuitions, but actual principles I have thought through and can articulate." },
  { id: 26, domain: 'Ch', subdomain: 'Ch_ethics', text: "I have declined a financial or professional opportunity specifically because it conflicted with my ethical commitments." },
  { id: 27, domain: 'Ch', subdomain: 'Ch_ethics', text: "I hold myself to ethical standards I would apply equally to others — I do not make exceptions for myself that I would not make for people I admire." },
  { id: 28, domain: 'Ch', subdomain: 'Ch_ethics', text: "I sometimes act in ways I know to be ethically questionable when the stakes or pressures are high enough.", reversed: true },

  // Discipline
  { id: 29, domain: 'Ch', subdomain: 'Ch_discipline', text: "I have a set of daily or weekly practices that I maintain consistently — not because external circumstances demand them but because I have chosen them." },
  { id: 30, domain: 'Ch', subdomain: 'Ch_discipline', text: "I can work at a high level for sustained periods without requiring external motivation, recognition, or accountability structures." },
  { id: 31, domain: 'Ch', subdomain: 'Ch_discipline', text: "I protect my most important work from distraction, interruption, and the tyranny of the urgent." },
  { id: 32, domain: 'Ch', subdomain: 'Ch_discipline', text: "I regularly start things I do not finish, or let important practices decay within weeks of beginning them.", reversed: true },

  // Courage
  { id: 33, domain: 'Ch', subdomain: 'Ch_courage', text: "When I believe something important needs to be said, I say it — even when doing so carries real social, relational, or professional risk." },
  { id: 34, domain: 'Ch', subdomain: 'Ch_courage', text: "I am able to hold and express an unpopular view in a group setting without requiring external permission or validation." },
  { id: 35, domain: 'Ch', subdomain: 'Ch_courage', text: "When I see something wrong or unjust in an environment I am part of, I respond to it rather than letting it pass." },
  { id: 36, domain: 'Ch', subdomain: 'Ch_courage', text: "I frequently find myself holding back from saying or doing things I believe are right because I am worried about how others will respond.", reversed: true },

  // Integrity
  { id: 37, domain: 'Ch', subdomain: 'Ch_integrity', text: "There is a high degree of alignment between the person I present to the world and the person I am privately." },
  { id: 38, domain: 'Ch', subdomain: 'Ch_integrity', text: "When I make a mistake, I acknowledge it cleanly — to myself and, when appropriate, to others — without excessive self-protection." },
  { id: 39, domain: 'Ch', subdomain: 'Ch_integrity', text: "The commitments I make publicly are ones I have genuinely made privately — I do not perform commitment I have not actually made." },
  { id: 40, domain: 'Ch', subdomain: 'Ch_integrity', text: "I sometimes present a version of myself professionally that I know to be somewhat exaggerated or aspirational rather than accurate.", reversed: true },
]

// ─── COMPETENCE (20 items — 4 per sub-domain) ───────────────────────────────

const COMPETENCE_ITEMS: FullItem[] = [
  // Skills
  { id: 41, domain: 'Co', subdomain: 'Co_skills', text: "I have at least one area of genuine craft — a domain where my skill level is high enough that peers with expertise recognise it." },
  { id: 42, domain: 'Co', subdomain: 'Co_skills', text: "I know specifically where my skills are strongest and can leverage those strengths in a way that creates disproportionate value." },
  { id: 43, domain: 'Co', subdomain: 'Co_skills', text: "My core skills have been developed deliberately — through intentional practice — not simply accumulated through experience." },
  { id: 44, domain: 'Co', subdomain: 'Co_skills', text: "I sometimes struggle to identify what my actual skills are, separate from the tasks and roles I have filled.", reversed: true },

  // Application
  { id: 45, domain: 'Co', subdomain: 'Co_application', text: "I consistently produce work that meets or exceeds the standard I have set for it — my output is reliable rather than intermittent." },
  { id: 46, domain: 'Co', subdomain: 'Co_application', text: "I can translate complex ideas, frameworks, or analysis into practical outputs that non-experts can understand and use." },
  { id: 47, domain: 'Co', subdomain: 'Co_application', text: "Under pressure, my output quality remains consistent — I do not produce significantly worse work when stakes are high." },
  { id: 48, domain: 'Co', subdomain: 'Co_application', text: "What I am capable of theoretically does not reliably translate into what I produce in practice.", reversed: true },

  // Problem-solving
  { id: 49, domain: 'Co', subdomain: 'Co_problemsolving', text: "When I face a problem outside my direct experience, I have a reliable process for working through it rather than simply feeling lost." },
  { id: 50, domain: 'Co', subdomain: 'Co_problemsolving', text: "I regularly find novel approaches to familiar problems rather than defaulting to the same solution patterns I have used before." },
  { id: 51, domain: 'Co', subdomain: 'Co_problemsolving', text: "When I identify a problem, I am generally able to locate the root cause rather than addressing only symptoms." },
  { id: 52, domain: 'Co', subdomain: 'Co_problemsolving', text: "I often feel overwhelmed by complex or unfamiliar problems and find myself paralysed rather than moving through them.", reversed: true },

  // Learning
  { id: 53, domain: 'Co', subdomain: 'Co_learning', text: "I actively seek out feedback on my performance and use it to change my behaviour — not just to understand it." },
  { id: 54, domain: 'Co', subdomain: 'Co_learning', text: "When something does not work, I extract useful learning from the failure rather than attributing it to external causes." },
  { id: 55, domain: 'Co', subdomain: 'Co_learning', text: "I have a deliberate approach to my own development — I invest in learning in a structured way rather than hoping it will happen through experience." },
  { id: 56, domain: 'Co', subdomain: 'Co_learning', text: "I find it difficult to receive critical feedback without becoming defensive or dismissive.", reversed: true },

  // Execution
  { id: 57, domain: 'Co', subdomain: 'Co_execution', text: "I finish things. Work I begin reaches completion at a higher rate than most people I have worked alongside." },
  { id: 58, domain: 'Co', subdomain: 'Co_execution', text: "I can move from analysis to action without excessive deliberation — I know when I have enough information to proceed." },
  { id: 59, domain: 'Co', subdomain: 'Co_execution', text: "The projects and commitments under my ownership tend to land well — completed on time and to the standard promised." },
  { id: 60, domain: 'Co', subdomain: 'Co_execution', text: "I have a pattern of beginning projects with high energy that gradually dissipates, leaving a trail of incomplete work.", reversed: true },
]

// ─── IMPACT (20 items — 4 per sub-domain) ───────────────────────────────────

const IMPACT_ITEMS: FullItem[] = [
  // Recognition
  { id: 61, domain: 'Im', subdomain: 'Im_recognition', text: "My contributions are recognised by people whose recognition I genuinely value — not just anyone, but the people whose judgement matters in my domain." },
  { id: 62, domain: 'Im', subdomain: 'Im_recognition', text: "I have a professional reputation in my field or sector that is known to people beyond my immediate organisation or team." },
  { id: 63, domain: 'Im', subdomain: 'Im_recognition', text: "I am able to articulate my own contribution clearly when asked, without either understating or overstating it." },
  { id: 64, domain: 'Im', subdomain: 'Im_recognition', text: "I often feel that my contributions go unacknowledged despite the quality of my work, and I struggle to understand why.", reversed: true },

  // Opportunity
  { id: 65, domain: 'Im', subdomain: 'Im_opportunity', text: "In the last six months, I have actively created a new opportunity — for myself, my team, or someone in my network." },
  { id: 66, domain: 'Im', subdomain: 'Im_opportunity', text: "I see and act on opportunities others miss — I have a better-than-average ability to identify where value can be created." },
  { id: 67, domain: 'Im', subdomain: 'Im_opportunity', text: "I have sponsored or created a significant opportunity for at least one other person in the past year." },
  { id: 68, domain: 'Im', subdomain: 'Im_opportunity', text: "Most of the significant opportunities I have had came to me through luck or connections I inherited — not through anything I actively did.", reversed: true },

  // Influence
  { id: 69, domain: 'Im', subdomain: 'Im_influence', text: "People seek out my perspective, input, or involvement on things that genuinely matter — not out of politeness, but because they believe my contribution will make a real difference." },
  { id: 70, domain: 'Im', subdomain: 'Im_influence', text: "I can influence outcomes and decisions in environments where I have no formal authority." },
  { id: 71, domain: 'Im', subdomain: 'Im_influence', text: "The people I have worked closely with have been measurably developed by the relationship — not just supported, but actually grown." },
  { id: 72, domain: 'Im', subdomain: 'Im_influence', text: "My influence in my environment tends to dissipate when I leave — what I create does not persist structurally beyond my presence.", reversed: true },

  // Contribution
  { id: 73, domain: 'Im', subdomain: 'Im_contribution', text: "My work has made a measurable, concrete difference in the past year — I can describe specifically what is different because I was there." },
  { id: 74, domain: 'Im', subdomain: 'Im_contribution', text: "I can articulate the specific value I add that would be missing if I were not present — not my job title, but my actual contribution." },
  { id: 75, domain: 'Im', subdomain: 'Im_contribution', text: "My contributions tend to compound — the work I do creates value that multiplies over time rather than being one-off or transactional." },
  { id: 76, domain: 'Im', subdomain: 'Im_contribution', text: "I often work hard on things without a clear sense of whether what I am doing actually matters to anyone.", reversed: true },

  // Legacy
  { id: 77, domain: 'Im', subdomain: 'Im_legacy', text: "I can describe, with some specificity, what I want the world to look like as a result of my having been fully deployed in it." },
  { id: 78, domain: 'Im', subdomain: 'Im_legacy', text: "The work I am currently doing is building toward something that will outlast my direct involvement in it." },
  { id: 79, domain: 'Im', subdomain: 'Im_legacy', text: "I am investing in the development of people who will carry forward the work and values that matter most to me." },
  { id: 80, domain: 'Im', subdomain: 'Im_legacy', text: "I find questions about legacy or long-term impact irrelevant or premature — I am focused on what is in front of me now.", reversed: true },
]

// ─── DISCRIMINATOR ITEMS (8 items) ──────────────────────────────────────────

const DISCRIMINATOR_ITEMS: FullItem[] = [
  { id: 81, domain: 'Dx', subdomain: 'Dx', text: "I know exactly what I need to do to move forward. The problem is that I have not yet fully committed to doing it." },
  { id: 82, domain: 'Dx', subdomain: 'Dx', text: "I am one of the most capable people in most of the environments I operate in. The challenge is knowing which environments are actually worth my time." },
  { id: 83, domain: 'Dx', subdomain: 'Dx', text: "My work is good enough that it should speak for itself. I should not have to promote myself to be recognised." },
  { id: 84, domain: 'Dx', subdomain: 'Dx', text: "I feel as though I am operating in multiple directions at once, and none of them are getting the full weight of what I am capable of." },
  { id: 85, domain: 'Dx', subdomain: 'Dx', text: "I understand myself well. The work now is not self-discovery but self-deployment." },
  { id: 86, domain: 'Dx', subdomain: 'Dx', text: "I am effective and productive, but when I am honest with myself, I am not always sure what I am being effective and productive for." },
  { id: 87, domain: 'Dx', subdomain: 'Dx', text: "I have more to offer than the environments I currently operate in allow me to give." },
  { id: 88, domain: 'Dx', subdomain: 'Dx', text: "I am at a point where incremental improvement in what I am already doing is less important than a structural shift in how I operate." },
]

// Total: 80 domain items + 8 discriminators — but we present 72 by default
// The 8 discriminators are shown as a short final section
export const FULL_ASSESSMENT_ITEMS: FullItem[] = [
  ...IDENTITY_ITEMS,
  ...CHARACTER_ITEMS,
  ...COMPETENCE_ITEMS,
  ...IMPACT_ITEMS,
  ...DISCRIMINATOR_ITEMS,
]

// ─── SCORING ENGINE ──────────────────────────────────────────────────────────

export interface SubDomainScores {
  I_selfconcept: number; I_purpose: number; I_belief: number; I_values: number; I_narrative: number
  Ch_consistency: number; Ch_ethics: number; Ch_discipline: number; Ch_courage: number; Ch_integrity: number
  Co_skills: number; Co_application: number; Co_problemsolving: number; Co_learning: number; Co_execution: number
  Im_recognition: number; Im_opportunity: number; Im_influence: number; Im_contribution: number; Im_legacy: number
}

export interface FullAssessmentResult {
  I: number; Ch: number; Co: number; Im: number
  subdomains: SubDomainScores
  F: number     // Formation Index (Wholeness)
  A: number     // Alignment Index (Balance)
  SI: number    // Structural Integrity Index
  CFS: number   // Composite Formation Score = F × A × SI
  archetype: string
  confidence: number
}

function avg(answers: Record<number, number>, items: FullItem[]): number {
  const domain = items.filter(i => i.domain !== 'Dx')
  if (!domain.length) return 0
  const sum = domain.reduce((acc, item) => {
    const raw = answers[item.id] ?? 3
    return acc + (item.reversed ? 6 - raw : raw)
  }, 0)
  return sum / (domain.length * 5)
}

function subAvg(answers: Record<number, number>, subdomain: SubDomain): number {
  const items = FULL_ASSESSMENT_ITEMS.filter(i => i.subdomain === subdomain)
  if (!items.length) return 0
  const sum = items.reduce((acc, item) => {
    const raw = answers[item.id] ?? 3
    return acc + (item.reversed ? 6 - raw : raw)
  }, 0)
  return sum / (items.length * 5)
}

export function scoreFullAssessment(answers: Record<number, number>): FullAssessmentResult {
  const I  = avg(answers, IDENTITY_ITEMS)
  const Ch = avg(answers, CHARACTER_ITEMS)
  const Co = avg(answers, COMPETENCE_ITEMS)
  const Im = avg(answers, IMPACT_ITEMS)

  const subdomains: SubDomainScores = {
    I_selfconcept: subAvg(answers, 'I_selfconcept'),
    I_purpose:     subAvg(answers, 'I_purpose'),
    I_belief:      subAvg(answers, 'I_belief'),
    I_values:      subAvg(answers, 'I_values'),
    I_narrative:   subAvg(answers, 'I_narrative'),
    Ch_consistency: subAvg(answers, 'Ch_consistency'),
    Ch_ethics:     subAvg(answers, 'Ch_ethics'),
    Ch_discipline: subAvg(answers, 'Ch_discipline'),
    Ch_courage:    subAvg(answers, 'Ch_courage'),
    Ch_integrity:  subAvg(answers, 'Ch_integrity'),
    Co_skills:     subAvg(answers, 'Co_skills'),
    Co_application: subAvg(answers, 'Co_application'),
    Co_problemsolving: subAvg(answers, 'Co_problemsolving'),
    Co_learning:   subAvg(answers, 'Co_learning'),
    Co_execution:  subAvg(answers, 'Co_execution'),
    Im_recognition: subAvg(answers, 'Im_recognition'),
    Im_opportunity: subAvg(answers, 'Im_opportunity'),
    Im_influence:  subAvg(answers, 'Im_influence'),
    Im_contribution: subAvg(answers, 'Im_contribution'),
    Im_legacy:     subAvg(answers, 'Im_legacy'),
  }

  // Weighted scores (Identity & Impact ×120, Character & Competence ×60)
  const sI  = I  * 120
  const sCh = Ch * 60
  const sCo = Co * 60
  const sIm = Im * 120

  // Trapezium Model SEM equations
  const F  = Math.min(1, Math.max(0, (sI * (Math.abs(sCh + sIm) + Math.abs(sCh - sCo))) / (360 * 120)))
  const A  = Math.min(1, Math.max(0, 1 - (Math.abs(sI - sIm) + Math.abs(sCh - sCo)) / 360))
  const SI = Math.min(1, Math.max(0, (sI * sIm + sCh * sCo) / (2 * 120 * 120)))
  const CFS = F * A * SI

  // Archetype
  const vals = [I, Ch, Co, Im]
  const mean = vals.reduce((a, b) => a + b) / 4
  const variance = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / 4)

  let archetype: string, confidence: number
  if (vals.every(d => d >= 0.72) && A > 0.75) {
    archetype = 'aln'; confidence = 0.75 + (mean - 0.72) * 1.5
  } else if (I >= 0.65 && Ch >= 0.60 && Co >= 0.60 && Im < 0.45) {
    archetype = 'gem'; confidence = 0.65 + ((I + Ch + Co) / 3 - Im) * 0.5
  } else if (I >= 0.65 && (Ch + Co) / 2 < 0.48 && Im < 0.42) {
    archetype = 'seek'; confidence = 0.60 + (I - (Ch + Co) / 2) * 0.6
  } else if (I < 0.50 && (Ch + Co) / 2 >= 0.60) {
    archetype = 'pow'; confidence = 0.60 + ((Ch + Co) / 2 - I) * 0.6
  } else {
    archetype = 'frag'; confidence = 0.50 + variance * 0.7
  }

  return {
    I, Ch, Co, Im, subdomains, F, A, SI, CFS,
    archetype,
    confidence: Math.min(0.97, Math.max(0.45, confidence)),
  }
}

export const FULL_ASSESSMENT_SECTIONS = [
  { key: 'identity',   label: 'Identity',   domain: 'I',  items: 20, description: 'How clearly you understand yourself — your purpose, values, and settled sense of who you are.' },
  { key: 'character',  label: 'Character',  domain: 'Ch', items: 20, description: 'The inner qualities you bring under pressure — consistency, courage, ethics, and discipline.' },
  { key: 'competence', label: 'Competence', domain: 'Co', items: 20, description: 'Your developed capability — skills, execution, learning, and problem-solving.' },
  { key: 'impact',     label: 'Impact',     domain: 'Im', items: 20, description: 'The tangible difference you make — recognition, influence, contribution, and legacy.' },
  { key: 'diagnostic', label: 'Diagnostic', domain: 'Dx', items: 8,  description: 'Eight pattern-specific statements to sharpen the accuracy of your profile.' },
]

export function getItemsBySection(sectionKey: string): FullItem[] {
  const map: Record<string, Domain | 'Dx'> = {
    identity: 'I', character: 'Ch', competence: 'Co', impact: 'Im', diagnostic: 'Dx',
  }
  const domain = map[sectionKey]
  return FULL_ASSESSMENT_ITEMS.filter(i => i.domain === domain)
}
