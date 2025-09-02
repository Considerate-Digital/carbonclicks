import nodemailer from "nodemailer";
import type { Email } from "$lib/types/email";

function emailFormat(email: Email) {
  if (email.contactForm == true) {
    return (
      `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${email.subject}</title>
    </head>
    <body>
        <p>From: ` +
      email.fromName +
      `</p>
        <p>Email: ` +
      email.fromAddress +
      `</p>
        <div>Message: ` +
      email.message +
      `</div>
    </body>
    </html>`
    );
  } else {
    return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${email.subject}</title>
    </head>
    <body>
    <section style="max-width:750px; margin:1rem auto; background: white;">
        <section style="padding: 1rem; margin:0rem; background-color: white">
            <section style="
               min-height: 500px;
                background-color: white;
                color: black;
                margin: 1rem auto;
                max-width: 40rem;
            ">
                ${email.message}
            </section>
        </section>
        <section style="background-color: black; color: white">
            <div style="margin:0rem; padding: 1rem 1rem; min-height: 100px;
                font-family: lato, sans-serif;
                max-width: 33rem;
            ">
                <p style="font-size: 0.875rem">
                    Considerate Digital and the Considerate Digital logos are trademarks of Considerate Digital Ltd, registered in many jurisdictions worldwide. Other product and service names may be trademarks of Considerate Digital or other companies.
                </p>
            </div>
            
        </section>
        <section style="background-color: white;">
            <div>
                <p style="font-size: 0.875rem; padding: 0.2rem; margin: 0rem;text-align: center; ">All rights reserved - Considerate Digital Limited</p>
            </div>
            
        </section>
    </section><!--message-end-->


    </body>
    </html>`;
  }
}

function emailPlain(email: Email) {
  return (
    "From: " +
    email.fromName +
    "Email: " +
    email.fromAddress +
    "Message: " +
    email.message
  );
}

export async function processEmail(email: Email) {
  if (email.contactForm == true) {
    email.toAddress = import.meta.env.VITE_MAIL_TO_ADDRESS;
    email.subject = "Contact Form";
  } else {
    email.fromName = import.meta.env.VITE_MAIL_FROM_NAME;
    email.fromAddress = import.meta.env.VITE_MAIL_FROM_ADDRESS;
  }
  if (email.toAddress == "") {
    email.toAddress = import.meta.env.VITE_MAIL_TO_ADDRESS;
  }
  let emailFormatted = emailFormat(email);
  let emailPlainText = emailPlain(email);

  /**mailer details**/
  let transporter = nodemailer.createTransport({
    //@ts-ignore
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: import.meta.env.VITE_MAIL_USERNAME,
      pass: import.meta.env.VITE_MAIL_PASSWORD,
      clientId: import.meta.env.VITE_OAUTH_CLIENTID,
      clientSecret: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
      refreshToken: import.meta.env.VITE_OAUTH_REFRESH_TOKEN,
    },
  });

  await transporter.verify(function (error: any, success: any) {
    if (error) {
      console.log("Transporter Error");
      console.log(error);
    } else {
      console.log("server is ready to accept messages");
    }
  });

  let mailOptions = {
    from: email.fromAddress,
    to: email.toAddress,
    subject: email.subject,
    text: emailPlainText,
    html: emailFormatted,
  };

  await transporter.sendMail(mailOptions, function (err: any, data: any) {
    if (err) {
      console.log("Error " + err);
      return {
        status: 404,
        body: false,
      };
    } else {
      console.log("Email sent successfully");
      return {
        status: 200,
        body: true,
      };
    }
  });

  return true;
}
