const imports = import.meta.glob("./guides/*.md", {
  query: "?raw",
  import: "default",
});

interface Guide_interface {
  date: string;
  title: string;
  author: string;
  slug: string;
  teaser: string;
  parent: string;
  text: string;
  blog: boolean;
}

export class Guide implements Guide_interface {
  constructor(guide) {
    this.#parse_md(guide);
  }

  #parse_md(guide) {
    let meta_obj = {};
    let meta = guide.split("---")[1].split("---")[0];
    let line_regex = /\r?\n|\r|\n/g;
    let separate_lines = meta.split(line_regex);
    for (let i = 0; separate_lines.length > i; i++) {
      let line = separate_lines[i];
      let line_arr = line.split(":");
      // check that there's a key
      if (line_arr[0] != "") {
        meta_obj[line_arr[0]] = line_arr[1].trim();
      }
    }
    //console.log(meta_obj);
    const text = guide.split("---")[2];
    this.date = meta_obj.date;
    if (!this.date) this.date = this.#get_today_date();
    this.title = meta_obj.title;
    this.author = meta_obj.author;
    this.slug = meta_obj.slug;
    this.parent = meta_obj.parent;
    this.blog = Boolean(Number(meta_obj.blog));
    if (meta_obj?.teaser) {
      this.teaser = meta_obj.teaser;
    } else {
      this.teaser = text.split(line_regex)[2];
      this.teaser = this.teaser.replaceAll("## ", "");
    }
    this.text = text;
  }

  #get_today_date() {
    let d = new Date();
    // set a random but recent date
    d.setDate(d.getDate() - this.#get_random_int(30));
    d = d.toISOString();
    // remove the time
    d = d.split("T")[0];
    let dArr = d.split("-");
    return `${dArr[2]}/${dArr[1]}/${dArr[0]}`;
  }

  #get_random_int(max) {
    return Math.floor(Math.random() * max);
  }
}
function date_converter(date) {
  let split = date.split("/");
  // format the date YYYY-MM-DD so that it can be parsed accurately
  return `${split[2]}-${split[1]}-${split[0]}T00:00:00`;
}

const guides = [];
export async function get_guides() {
  if (guides.length == 0) {
    console.log("importing guides");
    for (const path in imports) {
      await imports[path]().then((guide) => {
        if (guide) {
          let new_guide = new Guide(guide);
          if (
            new Date(date_converter(new_guide.date)).valueOf() <
            new Date().valueOf()
          ) {
            guides.push(new_guide);
          }
        }
      });
    }
    await guides.sort((a, b) => {
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
    return guides;
  } else {
    return guides;
  }
}
