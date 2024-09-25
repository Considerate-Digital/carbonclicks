import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  //console.log(locals);
  throw redirect(301, "/dashboard/login");
}
