import {reset, seed} from 'drizzle-seed'
import { db, sql } from './connection.ts';
import {schema} from './schema/index.ts';

await reset(db, schema);

await seed(db, schema).refine((f) => {
  return {
    rooms: {
      count: 20,
      columns: {
        name: f.companyName(),
        description: f.loremIpsum(),
      }
    }
  }
})

// biome-ignore lint/suspicious/noConsole: dev only
console.log('Database seeded successfully');

await sql.end();