import { get_guides } from "$lib/guides";
import { get_posts } from "$lib/posts";
import { redirect } from "@sveltejs/kit";

export async function load({ url }: { url: { pathname: string } }) {
  console.log("loading filtered guides");
  let { pathname } = url;
  let slug = pathname;
  let guides = await get_guides();
  let guide = guides.find((guide) => guide.slug === slug);

  if (!guide) {
    console.log("cannot find guide, so looking for post");
    let posts = await get_posts();
    let slug = pathname.split("/");
    slug = slug[slug.length - 1];
    guide = posts.find((guide) => guide.slug === slug);
  }

  if (!guide) redirect(307, "/guide");

  return {
    guide: JSON.parse(JSON.stringify(guide)),
  };
}
