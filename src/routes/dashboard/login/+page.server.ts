//check if user is logged in -- if so, then redirect to dashboard
import { pool } from "$lib/db/db_client";

import { processEmail } from "$lib/email/mailer";

// imports for the add form
import { z } from "zod";
import { superValidate, message } from "sveltekit-superforms/server";
import { fail } from "@sveltejs/kit";
import { login_schema } from "$lib/form_schemas/login";

import { error, redirect } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, parent, url }) {
  const form = await superValidate(login_schema);
  const email_change_param = url.searchParams.get("email-change") ?? undefined;
  // this assumes that the email has been successfully changed in the layout
  if (email_change_param) {
    let email_change;
    if (email_change_param == "true") {
      email_change = true;
    } else {
      email_change = false;
    }
    return { form, email_change };
  }

  // Always return { form } in load functions
  return { form };
  throw fail(500);
}

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, login_schema);

    if (!form.valid) {
      return fail(400, { form });
    }

    let email_title = "Register";

    try {
      // check for url in db
      const pool_client = await pool();

      const text = "SELECT * FROM users WHERE email LIKE $1";
      const values = [form.data.email];

      let query = await pool_client.query(text, values);

      const date = new Date().toISOString();
      const login_token = crypto.randomUUID();

      let expiry_time = new Date();
      expiry_time.setMinutes(expiry_time.getMinutes() + 15);


      // if user exists, then send the email
      if (query && query?.rows.length > 0) {
        console.log("user exists");
        // set register to false, as this is not a registration process
        email_title = "Login";
        //add new login token and login token expiry to user
        const ex_user_text = `UPDATE users SET
					login_token = $1,
					login_token_expiry = $2
					WHERE email LIKE $3
				`;
        const ex_user_values = [login_token, expiry_time, form.data.email];

        let ex_user_query = await pool_client.query(
          ex_user_text,
          ex_user_values,
        );

        if (!ex_user_query) {
          console.log("error");
        }
      } else {
        //if user does not exists, then register them and send an email

        // add audit results to db if they don't already exist
        // send email with button that uses the report id as a search param
        const user_text = `INSERT into users(
					id,
					email,
					email_validated,
					signup_date,
					login_token,
					login_token_expiry,
					last_login,
					login_count
				)
				VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;

        const user_values = [
          crypto.randomUUID(),
          form.data.email,
          false,
          date,
          login_token,
          expiry_time,
          date,
          0,
        ];

        let user_query = await pool_client.query(user_text, user_values);

        if (!user_query) {
          console.log("error");
        }
      }

      // email the reciever with the login code

      const message_html = `
				<h2 style="
					font-family: lato, sans-serif;
				font-weight: 600;
				margin: 1rem 0rem;
				">${email_title}</h2>
				<p style="
					font-family:lato, sans-serif;
				">
				
				</p>
				<p style="
					font-family:lato, sans-serif;
				">
				Once you click the button below you will be redirected to our website where you will be logged into your account. 
					</p>

				<a style="

					display: block;

				" href="${import.meta.env.VITE_DOMAIN_ADDRESS}/dashboard?login=${login_token}">
				<button style="
				font-family: lato, sans-serif;
				font-weight: 500; 
				font-size: 1rem; 
				line-height: 1; 
				text-align: center;
				background-color: black;
				color: white;
				text-align: center;
				border: 1px solid transparent;
				padding: 0.6rem 3rem;
				margin: 1.875rem 0em;
				cursor: pointer;
				text-decoration: none;
				width: max-content;
				">${email_title}</button>
				</a>


				<a style="

					display: block;
					cursor: pointer;
					font-style: italic;
					font-size: 0.85rem;

				" href="${import.meta.env.VITE_DOMAIN_ADDRESS}/dashboard?login=${login_token}">
			${import.meta.env.VITE_DOMAIN_ADDRESS}/dashboard?login=${login_token}
			</a>

				<p style="
					font-style: italic;
				font-size: 0.85rem;
				font-family:lato, sans-serif;
				">
				You will be logged in automatically after clicking this link.
					</p>
				<p style="
					font-family:lato, sans-serif;
				">
				Considerate Digital provides webpage certification alongside consulting and development services. If you need to certify a full website or want to learn more about digital carbon emissions, <a href="https://considerate.digital">get in touch.</a>
						</p>
					`;

      let email = {
        toAddress: form.data.email,
        toName: "",
        fromName: "",
        fromAddress: "",
        contactForm: false,
        subject: email_title,
        message: message_html,
      };

      try {
        // do not send the email for this test
        if (form.data.email != "test_test_test_test@considerate.digital") {
          await processEmail(email);
        }
      } catch (err) {
        console.log(err);
      }
      let return_text = "Entry successful";
      if (form.data.email === "test_test_test_test@considerate.digital") {
        return_text = login_token;
      }
      return message(form, return_text);
    } catch (err) {
      console.log(err);
      throw error(500, "Something went wrong");
    }
    return { form };
  },
};
