import geoip from "geoip-country";
import { pool } from "$lib/db/db_client";
import { error } from "@sveltejs/kit";
import { RateLimiter } from "sveltekit-rate-limiter/server";
import type { RequestEvent } from "@sveltejs/kit";
import type {
  Rate as RateType,
  RateLimiterPlugin,
} from "sveltekit-rate-limiter/server";

class Account_limiter implements RateLimiterPlugin {
  readonly rate: RateType;

  constructor(rate: RateType) {
    this.rate = rate;
  }

  async hash(json: any) {
    //const json = await JSON.parse(event.request.body);
    if (!json) return false;
    return json?.account_id;
  }
}

const limiter = new RateLimiter({
  plugins: [new Account_limiter([100, "m"])],
});

/** @type {import('./[id]').RequestHandler} */
export async function POST(event) {
  const request = event.request;

  let data: any = await request.json();
  console.log("analytics endpoint hit from: " + data.url);

  if (await limiter.isLimited(data)) throw error(429);
  //connect to db and return 'OK' if user has been added successfully
  //let data: any = url.searchParams;
  let pool_client = await pool();
  let text = `INSERT INTO analytics(
	  id, 
    account_id,
    date, 
    url,
    url_hash, 
    path,
    referrer, 
    title, 
    screen_width,
    screen_height,
    device_pixel_ratio,
    session_length,
    scroll,
    bot,
    query, 
    transfer,
    country,
    dom_interactive,
    dom_complete,
    dom_load_event_end,
		green,
		user_agent,
		unique_view
	) VALUES(
		$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
	)`;

  let data_values = Object.values(data);
  let events = data.events;
  let resources = data.resources;
  // remove the events
  data_values.splice(8, 1);
  // remove the resources -- remembering that we've reduced the array size by one
  data_values.splice(20, 1);

  // check database if this id has been used before
  const unique_text = `SELECT EXISTS(SELECT 1 FROM analytics WHERE id LIKE $1)`;
  const unique_value = [data_values[0]];

  let unique_query = await pool_client.query(unique_text, unique_value);

  let unique_view = unique_query.rows[0].exists ? false : true;

  // temporary
  data_values.push(unique_view);

  //add to database
  try {
    // add the analytics to the db
    let query = await pool_client.query(text, data_values);

    //TODO we are not collecting events yet
    if (events.length > 0) {
      let event_text = `INSERT INTO analytics_events(
				type, 
				date,
				target_tag,
				target_id,
				target_class,
				target_text,
				page_x,
				page_y
			) VALUES (
				$1, $2, $3, $4, $5, $6, $7, $8
			)`;

      for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let event_values = Object.values(event);

        let event_query = await pool_client.query(event_text, event_values);
      }
    }
    // add the resources
    if (resources.length > 0) {
      let resource_text = `INSERT INTO analytics_resources(
				url,
				date,
				type, 
				duration, 
				transfer_size,
				optimised_size
			) VALUES (
				$1, $2, $3, $4, $5, $6
			)
			ON CONFLICT (url) 
			DO UPDATE SET
				date = $2,
				type = $3,
				duration = $4,
				transfer_size = $5,
				optimised_size = $6
			;`;

      for (let i = 0; i < resources.length; i++) {
        let resource = resources[i];
        let resource_values = Object.values(resource);

        let resource_query = await pool_client.query(
          resource_text,
          resource_values,
        );
      }
    }

    if (query) {
      return new Response();
    }
  } catch (err) {
    console.log(err);
  }

  throw error(401, "Data not collected");
}
