(async function () {
  const get_optimised_image_size = (width, height) => {
    let area = width * height;

    if (area < 1) {
      return 200;
    }

    let optimised = (area / 24 + area / 1000) / (180 + area / 10 / 1000);
    let contingency = (optimised / 100) * 20;
    let result = Number((optimised + contingency).toFixed(2));

    if (result < 1) {
      return 1;
    } else {
      return result;
    }
  };

  ("use strict");
  console.log("CarbonClicks: initialised");

  let carbonClicks = {};
  //start timer -- necessary for spas -- compare with document timeline too
  carbonClicks.length = 0; // in millisecs
  setInterval(() => {
    carbonClicks.length += 200;
  }, 200);

  carbonClicks.resources = [];
  carbonClicks.events = [];
  carbonClicks.totalTransfer = 0;
  carbonClicks.referrer = document.referrer;
  carbonClicks.urlHash = "";
  carbonClicks.green = false;

  //set the performance observer
  let performanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.initiatorType == "fetch") return;
      let resource = {
        url: entry.name, // url
        date: new Date().toISOString(),
        type: entry.initiatorType, // type
        duration: Math.round(entry.duration), // duration
        transfer_size: Math.round(entry.encodedBodySize), // transferSize
        optimised_size: 0, // optimisedSize
      };

      switch (resource.type) {
        case "img":
          //get image in document
          let htmlImg = document.querySelector(`[src="${resource.u}"]`);
          if (htmlImg) {
            //get width and height
            resource.optimised_size = get_optimised_image_size(
              htmlImg.offsetWidth,
              htmlImg.offsetHeight,
            );
          } else {
            resource.optimised_size = 200 * 1024;
          }
          break;
        case "link": //probably css
          resource.optimised_size = 150 * 1024;
          break;
        case "script": //js
          resource.optimised_size = 150 * 1024;
          break;
        case "other": //font
          resource.optimised_size = 75 * 1024;
          break;
        default:
          resource.optimised_size = 200 * 1024;
          break;
      }
      carbonClicks.resources.push(resource);
      carbonClicks.totalTransfer += resource.transfer_size;
    });
  });
  performanceObserver.observe({ type: "resource", buffered: true });

  //set endpoint from data attribute
  if (document.querySelector("[data-carbon-clicks-endpoint]")) {
    carbonClicks.endpoint =
      document
        .querySelector("[data-carbon-clicks-endpoint]")
        .getAttribute("data-carbon-clicks-endpoint") ??
      "https://carbonclicks.io/public/api/analytics";
  } else {
    console.log("CarbonClicks: data endpoint not found");
    carbonClicks.endpoint = "https://carbonclicks.io/public/api/analytics";
      "https://carbonclicks.io/public/api/analytics";
  }



  async function generate_hash(ip) {
    let userAgent = Navigator.userAgent;
    let buffer = new TextEncoder("utf-8").encode(ip + userAgent);
    let hash = await crypto.subtle.digest("SHA-512", buffer);
    let hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
  }
  let ip, city, region, country_code3;
  try {
    await fetch("https://api.seeip.org/geoip", {
      method: "GET",
    })
      .then((res) => (res.ok ? res.json() : false))
      .then(async (res) => {
        if (res) {
          ip = res.ip;
          city = res.city;
          region = res.region;
          country_code3 = res.country_code3;
          carbonClicks.country = country_code3;
          //generate hash from ip and the userAgent
          carbonClicks.id = await generate_hash(ip);
        } else {
          carbonClicks.country = "";
          carbonClicks.id = await generate_hash("");
        }
      });
  } catch (err) {
    console.log("CarbonClicks: failed to identify IP");
    carbonClicks.country = "";
    carbonClicks.id = await generate_hash("");
  }

  // do we need the url hash -- this is the url and the userAgent in one hash
  //carbonClicks.urlHash = await generate_hash(window.location.href);

  let domain = window.location.href;
  if (domain.startsWith("http")) {
    domain = domain.split("/")[2];
  }

  // check for green hosting
  try {
    await fetch(
      `https://admin.thegreenwebfoundation.org/api/v3/greencheck/${domain}`,
    )
      .then(async (res) => (res.ok ? await res.json() : false))
      .then((res) => {
        if (res) {
          carbonClicks.green = res?.green ? res.green : false;
        } else {
          carbonClicks.green = false;
        }
      });
  } catch (err) {
    console.log("CarbonClicks: failed to check for green hosting");
    carbonClicks.green = false;
  }

  //add event function
  function addEvent(e) {
    // until we tame it
    return;
    try {
      //log event
      let event = {
        type: e.type, // type
        date: new Date().toISOString(), // or better to store millisecs??
        target_tag: e.target?.tagName, // target tag
        target_id:
          (e.target?.id ?? e.target.id != "") ? e.target.id.trim() : "",
        target_class:
          (e.target?.className ?? e.target.className != "")
            ? e.target.className.trim()
            : "", // targetClass
        target_text:
          e.target?.innerText != ""
            ? e.target.innerText.substring(0, 100).trim()
            : "", // targetInnerText -- first x-number of characters?
        page_x: Math.round(e.pageX),
        page_y: Math.round(e.pageY),
      };
      carbonClicks.events.push(event);
    } catch (err) {
      console.log(err);
    }
  }

  //set current href
  carbonClicks.lastHref = window.location.href;

  let dataSent = false;
  carbonClicks.scroll = false;

  //set event listeners
  document.addEventListener("visibilitychange", function () {
    if (
      (document.visibilityState === "hidden" || document.hidden == true) &&
      dataSent === false
    ) {
      carbonClicks.send_data();
      dataSent = true;
    } else if (dataSent === true) {
      dataSent = false;
    }
  });

  document.addEventListener("beforeunload", function () {
    if (dataSent === false) {
      carbonClicks.send_data();
      dataSent = true;
    }
  });

  function check_clicks(e) {
    //check if the href has changed
    addEvent(e);
    setTimeout(() => {
      if (carbonClicks.lastHref != window.location.href) {
        //user may have navigated
        carbonClicks.send_data();

        //reset the process
        dataSent = false;
        carbonClicks.length = 0;
        carbonClicks.lastHref = window.location.href;
      }
    }, 500);
  }
  document.addEventListener("click", check_clicks);

  let currentMouseoverTarget = "";
  document.addEventListener("mouseover", function (e) {
    currentMouseoverTarget = e.target;
    setTimeout(() => {
      if (e.target === currentMouseoverTarget) {
        addEvent(e);
      }
    }, 600);
  });
  document.addEventListener("ontouchstart", function (e) {
    addEvent(e);
  });

  function logScroll(e) {
    addEvent(e);
    carbonClicks.scroll = true;
  }
  document.addEventListener("scroll", logScroll);

  // get account id from data-carbonClicks.
  if (document.querySelector("[data-carbon-clicks-id]")) {
    console.log("CarbonClicks: id found");
      carbonClicks.accountId =
        document
          .querySelector("[data-carbon-clicks-id]")
          .getAttribute("data-carbon-clicks-id") ?? "";
  } else if (document.querySelector("[data-considerate-analytics-id]")) {
    console.log("CarbonClicks: deprecated id data attribute used");
    carbonClicks.accountId =
        document
          .querySelector("[data-considerate-analytics-id]")
          .getAttribute("data-considerate-analytics-id") ?? "";
  } else {
    console.log("CarbonClicks: no id found");
    carbonClicks.accountId = "";
  }
  console.log("CarbonClicks: id - " + carbonClicks.accountId);


  //
  // Get current path.
  const get_path = function () {
    let loc = window.location.href;
    if (loc.startsWith("http")) loc = loc.split("://")[1];
    if (loc.startsWith("www")) loc = loc.replace(/^www\./, "");
    loc = loc.split("/");
    loc.splice(0, 1);
    loc = loc.join("/");
    return loc != "" ? loc : "/";
  };

  // get title?
  carbonClicks.title = document.title ?? "";

  function get_data() {
    let [navs] = performance.getEntriesByType("navigation");
    let data = {
      id: carbonClicks.id,
      account_id: carbonClicks.accountId,
      date: new Date().toISOString(),
      url: window.location.href,
      url_hash: carbonClicks.urlHash,
      path: get_path(),
      referrer: carbonClicks.referrer,
      title: carbonClicks.title,
      events: carbonClicks.events,
      screen_width: Math.round(window.screen.width),
      screen_height: Math.round(window.screen.height),
      device_pixel_ratio: window.devicePixelRatio || 1,
      session_length: carbonClicks.length,
      scroll: carbonClicks.scroll,
      bot: is_bot(),
      query: location.search ? location.search : "",
      transfer: Math.round(carbonClicks.totalTransfer),
      country: carbonClicks.country,
      dom_interactive: Math.round(navs.domInteractive),
      dom_complete: Math.round(navs.domComplete),
      dom_load_event_end: Math.round(navs.loadEventEnd),
      resources: carbonClicks.resources,
      green: carbonClicks.green,
      user_agent: window.navigator.userAgent,
    };
    return JSON.stringify(data);
  }

  function is_bot() {
    let w = window,
      d = document;
    if (w.callPhantom || w._phantom || w.phantom) return true;
    if (w.__nightmare) return true;
    if (d.__selenium_unwrapped || d.__webdriver_evaluate || d.__driver_evaluate)
      return true;
    if (navigator.webdriver) return true;
    // stop all requests from bots and spiders
    if (window.navigator.userAgent.search(/(bot|spider|crawl)/gi) > -1) {
      return true;
    }
    return false;
  }

  // Get a query parameter.
  carbonClicks.get_query = function (name) {
    let s = location.search.substr(1).split("&");
    for (let i = 0; i < s.length; i++)
      if (s[i].toLowerCase().indexOf(name.toLowerCase() + "=") === 0)
        return s[i].substr(name.length + 1);
  };

  carbonClicks.send_data = function () {
    //this is when the analytics data is sent
    let data = get_data();
    let url = carbonClicks.endpoint;
    console.log("CarbonClicks: sending data")
    fetch(url, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    //reset the counter
    carbonClicks.length = 0.0;

    //clear events
    carbonClicks.events = [];
  };
})();
