import 'dotenv/config'

import {neon} from '@neondatabase/serverless'
import {drizzle} from 'drizzle-orm/neon-http'

const sql = neon(process.env.DATABASE_URL)  // this takes the connection string and craetes the raw database connection 

const db = drizzle(sql) //takes the raw connection and wraps it with the query builder , now insted of the rawSQL , we get the clean javascript api

export {sql, db}