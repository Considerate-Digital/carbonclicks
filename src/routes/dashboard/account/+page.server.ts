import { z } from "zod";
import { processEmail } from "$lib/email/mailer";
import { pool } from "$lib/db/db_client";
import { message, superValidate } from "sveltekit-superforms/server";
import { redirect, fail } from "@sveltejs/kit";

const change_email_schema = z.object({
  email: z.string().email(),
  new_email: z.string().email(),
  user_id: z.string(),
});
const delete_account_schema = z.object({
  consent: z.preprocess((val) => (val ? true : false), z.boolean()),
  email: z.string().email(),
  user_id: z.string(),
});

export async function load({ parent }) {
  //load account data
  let data = await parent();
  if (import.meta.env.VITE_DOMAIN_ADDRESS === "http://localhost:5173") {
    console.log("domain is local");
    data["user_id"] = "testdemo";
  }
  if (!data?.user_id) redirect(307, "/dashboard/login");
  let id = data.user_id;

  const email_form = await superValidate({ user_id: id }, change_email_schema);
  const delete_form = await superValidate(
    { user_id: id },
    delete_account_schema,
  );
  return {
    email_form,
    delete_form,
  };
}

export const actions = {
  email: async ({ request }) => {
    const email_form = await superValidate(request, change_email_schema);

    if (!email_form.valid) return fail(400, { email_form });

    //TODO change email -- send email with some sort of token?

    // for testing purposes
    if (
      email_form.data.email ===
      "test_test_test_test_email_change@considerate.digital"
    ) {
      // set the id, so that we can find the user in the database
      email_form.data.user_id = "demo";
    }

    const pool_client = await pool();

    const user_text = "SELECT id FROM users WHERE id LIKE $1";
    const user_values = [email_form.data.user_id];

    let user_query = await pool_client.query(user_text, user_values);

    if (!user_query) {
      return message(email_form, "We could not find your account.");
    }

    let user_id = user_query.rows[0].id;
    let new_token = crypto.randomUUID();
    let expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);

    const token_text = `UPDATE users SET 
				login_token = $1,
				login_token_expiry = $2
				WHERE id LIKE $3;`;
    const token_values = [new_token, expiry.toISOString(), user_id];

    let token_update = await pool_client.query(token_text, token_values);

    // email the reciever with the login code

    const message_html = `
				<h2 style="
					font-family: lato, sans-serif;
				font-weight: 600;
				margin: 1rem 0rem;
				">Email change</h2>
				<p style="
					font-family:lato, sans-serif;
				">
				
				</p>
				<p style="
					font-family:lato, sans-serif;
				">
				Once you click the button below you will be redirected to our website and your email will be changed to ${email_form.data.new_email}. 
					</p>

				<a style="

					display: block;

				" href="${import.meta.env.VITE_DOMAIN_ADDRESS}/dashboard/?email-token=${new_token}&email=${email_form.data.new_email}">
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
				">Change Email</button>
				</a>
				<p style="
					font-style: italic;
				font-size: 0.85rem;
				font-family:lato, sans-serif;
				">
				<a style="
					display: block;
					cursor: pointer;
					font-style: italic;
					font-size: 0.85rem;
					" href="${import.meta.env.VITE_DOMAIN_ADDRESS}/dashboard/?email-token=${new_token}&email=${email_form.data.new_email}">
				${import.meta.env.VITE_DOMAIN_ADDRESS}/dashboard/?email-token=${new_token}&email=${email_form.data.new_email}
				</a>
				You will be logged in automatically after clicking this link.
					</p>
				<p style="
					font-family:lato, sans-serif;
				">
				Considerate Digital provides webpage certification alongside consulting and development services. If you need to certify a full website or want to learn more about digital carbon emissions, <a href="https://considerate.digital">get in touch.</a>
						</p>
					`;

    let email = {
      toAddress: email_form.data.new_email,
      toName: "",
      fromName: "",
      fromAddress: "",
      contactForm: false,
      subject: "Email change",
      message: message_html,
    };

    try {
      await processEmail(email);
    } catch (err) {
      console.log(err);
    }

    return message(email_form, "Email changed");
  },
  delete: async ({ request }) => {
    const delete_form = await superValidate(request, delete_account_schema);

    if (!delete_form.valid) return fail(400, { delete_form });

    // for testing
    if (
      delete_form.data.email ===
      "test_test_test_test_exists@considerate.digital"
    ) {
      console.log("account delete is test");
      // set the test id, so that a real account can be deleted
      delete_form.data.user_id = "demo_2";
    }

    //TODO delete account only, not the urls or analytics results

    const pool_client = await pool();
    const delete_text = `DELETE FROM users WHERE id LIKE $1`;
    const delete_values = [delete_form.data.user_id];

    console.log("deleting account");

    let delete_update = await pool_client.query(delete_text, delete_values);

    if (!delete_update) return fail(400, { delete_form });

    // email
    const message_html = `
				<h2 style="
					font-family: lato, sans-serif;
				font-weight: 600;
				margin: 1rem 0rem;
				">User account deleted</h2>
				<p style="
					font-family:lato, sans-serif;
				">
				
				</p>
				<p style="
					font-family:lato, sans-serif;
				">
				We have deleted your user account. Thank you for using Considerate Digital's software.
					</p>
				<p style="
					font-style: italic;
				font-size: 0.85rem;
				font-family:lato, sans-serif;
				">
					</p>
				<p style="
					font-family:lato, sans-serif;
				">
				Considerate Digital provides webpage certification alongside consulting and development services. If you need to certify a full website or want to learn more about digital carbon emissions, <a href="https://considerate.digital">get in touch.</a>
						</p>
					`;

    let email = {
      toAddress: delete_form.data.email,
      toName: "",
      fromName: "",
      fromAddress: "",
      contactForm: false,
      subject: "User account deleted",
      message: message_html,
    };

    try {
      await processEmail(email);
    } catch (err) {
      console.log(err);
    }

    redirect(307, "/dashboard/login");
  },
};
