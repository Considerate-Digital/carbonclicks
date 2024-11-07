import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  throw redirect(301, "/dashboard/login");
}
