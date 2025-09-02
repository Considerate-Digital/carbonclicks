const imports = import.meta.glob("./posts/*.md", {
  query: "?raw",
  import: "default",
});

import { Guide } from "$lib/guides.ts";

const posts = [];
export async function get_posts() {
  if (posts.length == 0) {
    console.log("importing posts");
    for (const path in imports) {
      await imports[path]().then((post) => {
        if (post) {
          let new_post = new Guide(post);

          if (
            new Date(date_converter(new_post.date)).valueOf() <
            new Date().valueOf()
          ) {
            posts.push(new_post);
          }
        }
      });
    }
    await posts.sort((a, b) => {
      if (
        new Date(date_converter(a.date)).valueOf() >
        new Date(date_converter(b.date)).valueOf()
      ) {
        return -1;
      } else if (
        new Date(date_converter(a.date)).valueOf() <
        new Date(date_converter(b.date)).valueOf()
      ) {
        return 1;
      } else {
        return 0;
      }
    });

    return posts;
  } else {
    return posts;
  }
}

/* old */
interface Post_interface {
  date: string;
  title: string;
  author: string;
  slug: string;
  teaser: string;
  text: string;
}

export class Post implements Post_interface {
  constructor(post) {
    this.#parse_md(post);
  }

  #parse_md(post) {
    let meta_obj = {};
    let meta = post.split("---")[1].split("---")[0];
    let line_regex = /\r?\n|\r|\n/g;
    let separate_lines = meta.split(line_regex);
    separate_lines.forEach((line) => {
      let line_arr = line.split(":");
      // check that there's a key
      if (line_arr[0] != "") {
        meta_obj[line_arr[0]] = line_arr[1].trim();
      }
    });
    //console.log(meta_obj);
    const text = post.split("---")[2];
    this.date = meta_obj.date;
    this.title = meta_obj.title;
    this.author = meta_obj.author;
    this.slug = meta_obj.slug;
    this.teaser = text.split(line_regex)[2];
    this.teaser = this.teaser.replaceAll("## ", "");
    this.text = text;
  }
}
function date_converter(date) {
  let split = date.split("/");
  // format the date YYYY-MM-DD so that it can be parsed accurately
  return `${split[2]}-${split[1]}-${split[0]}T00:00:00`;
}
