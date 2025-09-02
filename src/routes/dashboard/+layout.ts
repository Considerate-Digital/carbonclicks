import { error, redirect } from "@sveltejs/kit";
/** @type {import('./$types').PageLoad} */
export async function load({ data, url }) {
  if (url.pathname === "/dashboard/login") {
    return;
  }

  const demo = url.searchParams.get("demo") ?? undefined;

  if (!data?.user_id && !demo) {
    console.log("redirecting to login from layout.ts");
    throw redirect(302, "/dashboard/login");
  }

  return data;
}
