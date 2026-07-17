import type { Presentation } from './primitives'
import { sqlBasicsSession4 } from './sqlBasicsSession4'
import { practicalDataAnalystAi } from './practicalDataAnalystAi'

/** All decks available at #/present. Add new presentations here. */
export const PRESENTATIONS: Presentation[] = [
  practicalDataAnalystAi,
  sqlBasicsSession4,
]

export function getPresentation(id: string): Presentation | undefined {
  return PRESENTATIONS.find(p => p.id === id)
}
