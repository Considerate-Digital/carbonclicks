import { pool } from "$lib/db/db_client";
import { error, redirect } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
  //console.log("these are the locals");
  //console.log(locals);
  // @ts-ignore
  const user_id = locals.user_id;
  // @ts-ignore
  const account_id = locals.account_id;

  if (user_id) {
    const pool_client = await pool();
    let account;

    if (!account_id && user_id && user_id != "") {
      console.log("making a new account");
      // make new account -- this is the first account a user would have
      const account_text = `INSERT INTO analytics_accounts(
          id,
          primary_user_id,
          paid,
          last_accessed,
          creation_date
        ) VALUES($1, $2, $3, $4, $5)
        RETURNING *
        ;`;

      const account_values = [
        crypto.randomUUID(),
        user_id,
        false,
        new Date().toISOString(),
        new Date(),
      ];

      let account_create_query = await pool_client.query(
        account_text,
        account_values,
      );

      account = account_create_query.rows[0];

      //add account id to the user

      const acc_user_text = `UPDATE users SET
        primary_analytics_accounts = ARRAY[$1]
        WHERE id = $2;`;

      const acc_user_values = [account.id, user_id];

      let acc_user_query = await pool_client.query(
        acc_user_text,
        acc_user_values,
      );

      return {
        user_id: user_id,
        account: account,
      };
    } else {
      // get the user's analytics data
      const data_text = `SELECT * FROM analytics_accounts WHERE id = $1`;
      // replace this with real id
      const data_value = [account_id];

      let data_query = await pool_client.query(data_text, data_value);

      console.log("attempting to return rows");

      if (data_query.rows[0]) {
        account = data_query.rows[0];


        if (import.meta.env.VITE_DOMAIN_ADDRESS == "http://localhost:5173") {
          console.log("using localhost data");
          account["id"] = "demo";
        }

        // get the user's analytics data
        const views_text = `SELECT * FROM analytics WHERE account_id = $1`;
        // replace this with real id
        const views_value = [account.id];

        let views_query = await pool_client.query(views_text, views_value);

        return {
          user_id: user_id,
          account: account,
          views: views_query.rows,
        };
      }
    }
  }
}
