export function isValidURL(str: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // fragment locator
  return !!pattern.test(str);
}

export function remove_http(url: string) {
  if (url.startsWith("http")) {
    return url.split("//")[1];
  } else {
    return url;
  }
}

export function url_shortener(url: string, ideal_length: number = 30) {
  //remove http anyway
  url = remove_http(url);
  if (url.startsWith("www.")) {
    url = url.split("www.")[1];
  }
  url = url.split("?")[0];
  if (url.endsWith("/")) {
    url = url.slice(0, url.length - 1);
  }
  if (url.length > ideal_length) {
    // split the url ls we need the start and the end
    // clean the url of params
    let split_url = url.split("/");
    let url_start = split_url[0];
    if (url_start.length > ideal_length / 2) {
      url_start = url_start.slice(0, ideal_length / 1.7);
    }
    let url_end: string | string[] = split_url[split_url.length - 1];
    if (url_end.length > ideal_length / 2) {
      url_end = url_end.split("");
      url_end = url_end.slice(url_end.length - 10, url_end.length);
      url_end = url_end.join("");
      return url_start + "..." + url_end;
    } else {
      return url_start + "..." + "/" + url_end;
    }
  } else {
    return url;
  }
}
