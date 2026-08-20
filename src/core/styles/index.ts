import type { StyleDef, StyleId } from '../../types'
import { jazz } from './jazz'
import { bebop } from './bebop'
import { jazzBlues } from './jazzBlues'
import { blues } from './blues'
import { popRock } from './popRock'
import { gospel } from './gospel'
import { bossa } from './bossa'
import { latin } from './latin'
import { afro } from './afro'

export const STYLES: Record<StyleId, StyleDef> = {
  jazz,
  bebop,
  jazzBlues,
  blues,
  popRock,
  gospel,
  bossa,
  latin,
  afro,
}

export const STYLE_LIST: { id: StyleId; name: string; def: StyleDef }[] = (
  ['jazz', 'bebop', 'jazzBlues', 'blues', 'popRock', 'gospel', 'bossa', 'latin', 'afro'] as StyleId[]
).map(id => ({ id, name: STYLES[id].name, def: STYLES[id] }))
