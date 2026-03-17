import { type SchemaTypeDefinition } from 'sanity'
import { analysis } from './analysis'
import { user } from './user'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [analysis, user],
}
