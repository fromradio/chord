import type { StyleDef, StyleId } from '../../types'
import { jazz } from './jazz'
import { popRock } from './popRock'
import { blues } from './blues'
import { bossa } from './bossa'

export const STYLES: Record<StyleId, StyleDef> = { jazz, popRock, blues, bossa }

export const STYLE_LIST: { id: StyleId; name: string; def: StyleDef }[] = (
  ['jazz', 'popRock', 'blues', 'bossa'] as StyleId[]
).map(id => ({ id, name: STYLES[id].name, def: STYLES[id] }))
