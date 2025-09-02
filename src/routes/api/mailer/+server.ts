import { processEmail } from "$lib/email/mailer";
import { error, redirect } from "@sveltejs/kit";
import { z } from "zod";

const contact_schema = z.object({
  name: z.string(),
  email: z.string().email({ message: "Please type a valid email address." }),
  message: z.string(),
});

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ params, request }) {
  let email = await request.json();

  // validate email
  let valid = contact_schema.safeParse(email);

  if (!valid?.success) {
    throw error(404, "ERROR");
  }
  let formatted_email = {
    subject: "Contact",
    toName: import.meta.env.VITE_MAIL_FROM_NAME,
    toAddress: import.meta.env.VITE_MAIL_TO_ADDRESS,
    fromName: email.name, // do not set unless necessary
    fromAddress: email.email, // do not set unless necessary
    contactForm: true,
    message: email.message,
  };

  let result = await processEmail(formatted_email);
  if (result) {
    return new Response();
  }

  throw error(400, "ERROR");
}
