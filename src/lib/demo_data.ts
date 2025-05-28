import countries from "i18n-iso-countries";
import enLang from "i18n-iso-countries/langs/en.json";

import { generate } from "random-words";
//@ts-ignore types do not exist for this module
import * as rdg from "random-date-generator";
import { random_number } from "$lib/utils/random_number";
import type { AnalyticsEvent, View } from "$lib/types/dashboard";

function get_country() {
  let country_arr = Object.keys(countries.getAlpha3Codes());
  return country_arr[random_number(country_arr.length - 1)];
}

function make_url() {
  let path = (generate(random_number(4)) as string[]).join("/");
  return {
    url: "considerate.digital/" + path,
    path: path == "" ? "/" : path,
  };
}
async function generate_hash(text: string) {
  let buffer = new TextEncoder().encode(text);
  let hash = await crypto.subtle.digest("SHA-512", buffer);
  let hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}
function create_date() {
  // just needs to be random within the last year
  let start = new Date();
  start.setMonth(start.getMonth() - 12);
  let end = new Date();

  let random_date = rdg.getRandomDateInRange(start, end);
  return random_date;
}

function create_nearby_date(start: number) {
  // just needs to be random within the last year
  let end = new Date(start);
  end.setMinutes(end.getMinutes() + random_number(10));
  let random_date = rdg.getRandomDateInRange(start, end);
  return random_date;
}

async function create_url_hash(users: any[]) {
  let num = random_number(2);
  let unique = num == 1 ? true : false;
  if (unique) {
    return {
      hash: await generate_hash(new String(random_number(10000)) + "text"),
      unique,
    };
  } else {
    return {
      hash: users[random_number(users.length - 1)],
      unique,
    };
  }
}

function make_user_agent() {
  const agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.3",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.3",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.",
  ];
  return agents[random_number(agents.length - 1) - 1];
}

export async function create_views(num: number) {
  if (num === 0) {
    num = 1;
  }
  const views = [];
  for (let i = 0; num > i; i++) {
    let { url, path } = make_url();
    // this is the analytics view that contains events and resources
    let b = {
      id: await generate_hash("view"),
      account_id: "demo",
      date: new Date().toISOString(),
      url: url,
      url_hash: await generate_hash(url),
      path: path,
      referrer: "",
      title: "",
      events: [],
      screen_width: 900,
      screen_height: 1400,
      device_pixel_ratio: 1.0,
      session_length: random_number(40000),
      scroll: true,
      bot: false,
      query: "",
      transfer: random_number(6000000),
      country: get_country(),
      dom_interactive: random_number(4000),
      dom_complete: random_number(4000),
      dom_load_event_end: random_number(4000),
      resources: [],
      green: true,
      user_agent: make_user_agent(),
      // unique view is worked out on the server
    };

    views.push(b);
  }
  return views;
}

export const demo_data = async () => {
  countries.registerLocale(enLang);

  let data_view = await create_views(1);
  console.log(data_view);
  console.log(JSON.stringify(data_view[0]));

  let account_id = crypto.randomUUID();
  let max_views = 10000;
  let view_number = random_number(max_views);
  let min_views = 1000;
  while (view_number < min_views) {
    view_number = random_number(max_views);
  }
  console.log(`total views: ${view_number}`);
  let users_no = Math.round(view_number / (Math.PI * 3));

  console.log(`total users: ${users_no}`);
  let url_no = users_no > 100 ? 100 : users_no;
  let urls = [];
  for (let i = 0; url_no > i; i++) {
    let url = make_url();
    urls.push(url);
  }

  let users = [];
  for (let i = 0; users_no > i; i++) {
    users.push(await generate_hash(new String(i) + "text"));
  }
  let views = [];
  while (views.length < view_number) {
    let { url, path } = urls[random_number(urls.length - 1)];
    let { hash, unique } = await create_url_hash(users);
    if (!unique) {
      //create a set of a few page views
      let agent = make_user_agent();
      let date = create_date();
      for (let i = 0; random_number(5) > i; i++) {
        let { url, path } = urls[random_number(urls.length - 1)];
        let b: View = {
          id: hash,
          account_id: account_id,
          date: create_nearby_date(date).toISOString(),
          url: url,
          url_hash: await generate_hash(url),
          path: path,
          referrer: "",
          title: "",
          screen_width: 900,
          screen_height: 1400,
          device_pixel_ratio: 1.0,
          session_length: random_number(40000),
          scroll: true,
          bot: false,
          query: "",
          transfer: random_number(6000000),
          country: get_country(),
          dom_interactive: random_number(4000),
          dom_complete: random_number(4000),
          dom_load_event_fired: random_number(4000),
          green: true,
          user_agent: agent,
          unique_view: unique,
        };

        views.push(b);
      }
    }
    let a: View = {
      id: hash,
      account_id: account_id,
      date: create_date().toISOString(),
      url: url,
      url_hash: await generate_hash(url),
      path: path,
      referrer: "",
      title: "",
      screen_width: 900,
      screen_height: 1400,
      device_pixel_ratio: 1.0,
      session_length: random_number(40000),
      scroll: true,
      bot: false,
      query: "",
      transfer: random_number(600000),
      country: get_country(),
      dom_interactive: random_number(4000),
      dom_complete: random_number(4000),
      dom_load_event_fired: random_number(4000),
      green: true,
      agent: make_user_agent(),
      unique_view: unique,
    };
    views.push(a);
  }
  return views;
};
