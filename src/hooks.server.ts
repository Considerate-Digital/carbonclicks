import { pool } from "$lib/db/db_client";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  //console.log(event);
  const origin = event.url.origin;
  let cookies = event.cookies;
  const path = event.url.pathname;
  const searchParams = event.url.searchParams;

  const logout = searchParams.get("logout") ?? undefined;
  if (path.startsWith("/dashboard")) {
    if (path.startsWith("/dashboard/login")) {
      console.log("login pathway");
      if (logout) {
        console.log("running logout");
        cookies.delete("session_token", { path: "/", secure: false });
        return await resolve(event);
      }
      return await resolve(event);
    }

    const login_token = searchParams.get("login") ?? undefined;
    const email_change_token = searchParams.get("email-token") ?? undefined;
    const new_email = searchParams.get("email") ?? undefined;
    const demo = searchParams.get("demo") ?? undefined;

    let cookie;
    let user_id;
    let account;
    let account_id;

    // TODO: create separate clients for each if option
    if (demo) {
      return await resolve(event);
    } else if (email_change_token && new_email) {
      const pool_client = await pool();
      console.log("changing the email");
      //change the email and redirect to login page
      // add audit results to db if they don't already exist
      // send email with button that uses the report id as a search param

      // check token is valid
      const check_token_text = `SELECT login_token_expiry FROM users WHERE login_token = $1`;
      const check_token_values = [email_change_token];
      let check_token_query = await pool_client.query(
        check_token_text,
        check_token_values,
      );

      if (!check_token_query) {
        console.log("query token error");
        return await Response.redirect(
          origin + "/dashboard/login?email-change=false",
          307,
        );
      }

      let check_token_expiry =
        check_token_query?.rows[0].login_token_expiry ?? undefined;

      if (!check_token_expiry) {
        console.log("token expiry error");
        return await Response.redirect(
          origin + "/dashboard/login?email-change=false",
          307,
        );
      }
      // check the timestamp
      let date_now = new Date().valueOf();
      if (date_now > new Date(check_token_expiry).valueOf()) {
        console.log("token out of date error");
        return await Response.redirect(
          origin + "/dashboard/login?email-change=false",
          307,
        );
      }

      const email_change_text = `UPDATE users SET
            email = $1
            WHERE login_token = $2
          `;

      const email_change_values = [new_email, email_change_token];

      let email_change_query = await pool_client.query(
        email_change_text,
        email_change_values,
      );

      if (!email_change_query) {
        console.log("error");
        return await Response.redirect(
          origin + "/dashboard/login?email-change=false",
          307,
        );
      }
      console.log("email change successful, redirecting to email-change=true");
      return await Response.redirect(
        origin + "/dashboard/login?email-change=true",
        307,
      );
    } else if (cookies.get("session_token")) {
      const pool_client = await pool();
      console.log("found a cookie and checking if valid");
      const cookie_text = `SELECT u.session_expiry, u.id, u.primary_analytics_accounts FROM users u WHERE session_token = $1;`;
      const cookie_values = [cookies.get("session_token")];

      let cookie_query = await pool_client.query(cookie_text, cookie_values);

      if (cookie_query?.rows.length > 0) {
        // check if the session expiry is in date
        let date_now = new Date().valueOf();

        if (
          date_now < new Date(cookie_query.rows[0].session_expiry).valueOf()
        ) {
          user_id = String(cookie_query.rows[0].id);
          if (cookie_query.rows[0].primary_analytics_accounts) {
            console.log("setting account id");
            account_id = Array(
              cookie_query.rows[0].primary_analytics_accounts[0],
            )[0];
            user_id = cookie_query.rows[0].id;
            console.log("cookie is valid and account exists");
            //@ts-ignore
            event.locals.user_id = user_id;
            //@ts-ignore
            event.locals.account_id = account_id;
            return await resolve(event);
          }
        }
      } else {
        console.log("user account not found");
      }
    }
    // this follows an email link with the login token in the url params
    if (login_token) {
      // first delete any existing cookies
      if (cookies.get("session_token"))
        cookies.delete("session_token", { path: "/" });
      console.log("using the login token to generate cookie");
      //create cookie and log the user in
      let session_expiry = new Date();
      session_expiry.setMonth(session_expiry.getMonth() + 1);

      const expiry_in_seconds =
        (session_expiry.valueOf() - new Date().valueOf()) / 1000;

      const session_token = crypto.randomUUID();
      cookies.set("session_token", session_token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: expiry_in_seconds,
      });

      const pool_client = await pool();
      // set session_token in db and session_expiry
      const session_text = `UPDATE users SET 
        session_expiry = $1,
        session_token = $2,
        last_login = $3,
        login_count = login_count + 1
        WHERE login_token = $4
        RETURNING id, primary_analytics_accounts
        ;`;

      const session_values = [
        session_expiry.toISOString(),
        session_token,
        new Date().toISOString(),
        login_token,
      ];

      let session_query = await pool_client.query(session_text, session_values);

      if (session_query?.rows.length > 0) {
        user_id = String(session_query.rows[0].id);
        if (session_query.rows[0].primary_analytics_accounts) {
          account_id = Array(
            session_query.rows[0].primary_analytics_accounts[0],
          )[0];
        }
        console.log("session successfully created");
      }
      // @ts-ignore
      event.locals.user_id = user_id;
      // @ts-ignore
      event.locals.account_id = account_id;
      return await resolve(event);
    }
  }

  //check other routes
  let allowedApiRoutes = [
    "certification",
    "login",
    "logout",
    "validateUser",
    "googleApi",
    "oauth",
    "register",
    "registerAccount",
    "reset",
    "resendUserValidation",
    "checkReset",
    "forgot",
    "mailer",
    "carbonIntensity?basic=true",
    "carbonIntensity",
    "scanSite?first=true",
    "scanSite",
    "emailSubscriber",
    "stripeWebhook",
    "validateAccount",
    "cookieConsentGiven",
    "cookieNoticeShown",
    "getFixes",
    "getUrls",
    "public/api",
    "getAnalytics",
    "wordpress",
  ];
  const routeChecker = (value: string | string[]) => {
    return allowedApiRoutes.some((element) => value.includes(element));
  };
  //check if event is going to api
  if (event.url.href.includes("api")) {
    if (routeChecker(event.url.href)) {
    } else if (event.request.headers.has("Authorization")) {
      let raw_header = event.request.headers.get("Authorization");
      if (raw_header) {
        let authorizationHeader = decodeURIComponent(raw_header);

        //let authMatch = await compare(session.sessionId, authorizationHeader);
        // TODO: reimplement this protective auth checking
        let authMatch = true;
        if (authMatch) {
          return await resolve(event);
        } else {
          return Response.redirect(import.meta.env.VITE_DOMAIN_ADDRESS, 303);
        }
      }
    } else {
      return Response.redirect(import.meta.env.VITE_DOMAIN_ADDRESS, 303);
    }
  }

  return await resolve(event);
}

/*

import { pool } from "$lib/db/db_client";
import { createHarTableQuery, createAnalyticsAccountTableQuery, createUserTableQuery, createUrlTableQuery, createAnalyticsTableQuery, createAnalyticsEventsTableQuery, createAnalyticsResourcesTableQuery } from "$lib/db/table";
export async function handle({ event, resolve }) {
 
//check other routes
let allowedApiRoutes = [
  'certification',
  'login',
  'logout',
  'validateUser',
  'googleApi',
  'oauth',
  'register',
  'registerAccount',
  'reset',
  'resendUserValidation',
  'checkReset',
  'forgot',
  'mailer',
  'carbonIntensity?basic=true',
  'carbonIntensity',
  'scanSite?first=true',
  'scanSite',
  'emailSubscriber',
  'stripeWebhook',
  'validateAccount',
  'cookieConsentGiven',
  'cookieNoticeShown',
  'getFixes',
  'getUrls',
  'public/api',
  'getAnalytics',
  'wordpress',
];
const routeChecker = (value: string | string[]) => {
  return allowedApiRoutes.some((element) => value.includes(element));
};
//check if event is going to api
if (event.url.href.includes('api')) {
  if (routeChecker(event.url.href)) {
  } else if (event.request.headers.has('Authorization')) {
    let authorizationHeader = decodeURIComponent(event.request.headers.get('Authorization'));
    let authMatch = await compare(session.sessionId, authorizationHeader);
    if (authMatch) {
      return await resolve(event);
    } else {
      return Response.redirect(import.meta.env.VITE_DOMAIN_ADDRESS, 303);
    }
  } else {
    return Response.redirect(import.meta.env.VITE_DOMAIN_ADDRESS, 303);
  }
}

return await resolve(event);

}

// create the db tables 
// This now relies on the "carbon" instance to check the db tables
setTimeout( async ( ) => {
  console.log("creating the db tables");
  let pool_connect = await pool();
  await pool_connect.query(createUserTableQuery);  
  await pool_connect.query(createAnalyticsAccountTableQuery);  
  //await pool_connect.query(createUrlTableQuery);  
  //await pool_connect.query(createHarTableQuery);
  await pool_connect.query(createAnalyticsTableQuery);  
  await pool_connect.query(createAnalyticsEventsTableQuery);  
  await pool_connect.query(createAnalyticsResourcesTableQuery);  
}, 12000)
*/
