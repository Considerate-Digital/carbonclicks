import pg from "pg";
import {
  createHarTableQuery,
  createAnalyticsAccountTableQuery,
  createUserTableQuery,
  createUrlTableQuery,
  createAnalyticsTableQuery,
  createAnalyticsEventsTableQuery,
  createAnalyticsResourcesTableQuery,
} from "$lib/db/table";

const { Pool } = pg;
//TODO: find the correct type for a pg client pool

let client_pool: any;

async function new_pool() {
  client_pool = new Pool({
    host: import.meta.env.VITE_DB_HOST,
    port: import.meta.env.VITE_DB_PORT,
    user: import.meta.env.VITE_DB_USER,
    password: import.meta.env.VITE_DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 1000,
  });
  client_pool.on("error", (e: any) => {
    console.log("database error");
    client_pool.end();
    new_pool();
  });
}

export const pool = () => {
  try {
    if (!client_pool) {
      console.log("creating a new pool");
      new_pool();
    } else {
      console.log("returning existing pool");
    }
    return client_pool;
  } catch (err) {
    console.log(err);
  }
};
