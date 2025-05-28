//import tgwf from "https://cdn.skypack.dev/@tgwf/co2";
import tgwf from "@tgwf/co2";
import countries from "i18n-iso-countries";
import type {
  View,
  AnalyticsEvent,
  PageDataPoint,
  CountryDataPoint,
} from "$lib/types/dashboard";

import { objectToBuffer, bufferToObject } from "$lib/utils/buffer";
import { getCarbonUnit } from "$lib/utils/carbonUnits";

async function getUserCarbon(view: View) {
  const emissions = new tgwf.co2({ model: "1byte" });
  const co2js_options = {
    gridIntensity: {
      device: {
        country: view.country,
      },
      /* TODO don't think we know this 
                    dataCenter: {
                        country: server_location
                    }
                    */
    },
  };
  let { co2 } = emissions.perByteTrace(
    view.transfer,
    view.green,
    co2js_options,
  );
  return Number(co2) as number;
}
import {
  set_carbon_unit,
  set_carbon_value,
  get_carbon_unit_and_value,
} from "$lib/utils/carbonUnits";

onmessage = async (e) => {
  let { fullData, date_stamp } = bufferToObject(e.data);

  let views: View[] = [];
  let events: AnalyticsEvent[] = [];
  let data = {
    views,
    events,
  };

  if (fullData?.views?.length > 0) {
    data.views = fullData.views.filter((row: View) => {
      if (new Date(row.date) && new Date(row.date).valueOf() > date_stamp) {
        //
        //alert("found a day");
        return row;
      }
    });
  }

  if (fullData?.events?.length > 0) {
    data.events = fullData.events.filter((row: AnalyticsEvent) => {
      if (
        new Date(Date.parse(row.date)) &&
        new Date(Date.parse(row.date)).valueOf() > date_stamp
      ) {
        //
        //alert("found a day");
        return row;
      }
    });
  }

  // set test for if there are no rows or events

  /*gradient*/
  let PC = 50;
  /*figures*/
  let totalCarbonCount = 0;
  let figuresUserNum = 0;
  let figuresVisitsNum = 0;
  let figuresCo2NumUnit = "g";
  let figuresRealTimeUsersNum = 0;
  let figuresRealTimeCarbonNum = 0;
  let figuresAverageSessionLength = 0;
  /*tops*/
  let countriesFound: string[] = [];
  let pagesFound: string[] = [];
  let countryArr: CountryDataPoint[] = [];
  let pageArr: PageDataPoint[] = [];

  //get total co2
  //this is now 10 mins ago
  let fiveMinutesAgo = new Date();
  fiveMinutesAgo.setTime(fiveMinutesAgo.getTime() - 1000 * 60 * 10);
  //console.log("Five min earlier " + fiveMinutesAgo);
  let timeZoneOffsetMinutes = new Date().getTimezoneOffset();
  let uniqueUsersInLastFiveMins: string[] = []; // list of user ids

  figuresVisitsNum = data.views.length;
  if (data.views.length > 0) { 
    for (let i = 0; data.views.length > i; i++) {
      let row = data.views[i];
      let rowCarbon: number = await getUserCarbon(row) ?? 0;
      totalCarbonCount += rowCarbon;
      /* figures calculations */
      //co2num can be replaced by totalCarbonCount
      let uniqueView = new Boolean(Number(row.unique_view));
      if (uniqueView == true) {
        figuresUserNum += 1;
      }

      let rowTime = new Date(String(row.date));
      let newRowTime = new Date(
        rowTime.setMinutes(rowTime.getMinutes() - timeZoneOffsetMinutes),
      );

      if (newRowTime.valueOf() > fiveMinutesAgo.valueOf()) {
        if (!uniqueUsersInLastFiveMins.includes(row.id)) {
          uniqueUsersInLastFiveMins.push(row.id);
          figuresRealTimeUsersNum += 1;
        }
        figuresRealTimeCarbonNum += rowCarbon;
      }

      /* tops calculations */

      if (new Boolean(Number(row.unique_view)) == true) {
        //country sorting
        if (!countriesFound.includes(row.country)) {
          let countryDataPoint = {
            name: row.country,
            users: 1,
            carbon: rowCarbon,
            carbon_unit: "g",
          };
          countriesFound.push(row.country);
          countryArr.push(countryDataPoint);
        } else {
          if (countryArr.length > 0) {
            let index = countriesFound.indexOf(row.country);
            if (index) {
              countryArr[index].users += 1;
              countryArr[index].carbon += rowCarbon;
            }
          }
        }
      }

      //page sorting
      if (!pagesFound.includes(row.path)) {
        let pageDataPoint: PageDataPoint = {
          title: row.title,
          path: row.path,
          count: 1,
          carbon: rowCarbon,
          carbon_per_load: rowCarbon,
          carbon_unit: "g",
        };
        pagesFound.push(row.path);
        pageArr.push(pageDataPoint);
      } else {
        if (pageArr.length > 0) {
          let index = pagesFound.indexOf(row.path);
          if (index) {
            pageArr[index].count += 1;
            pageArr[index].carbon += rowCarbon;
          }
        }
      }
    }

    // sort the countries based on emission
    if (countryArr.length > 0) {
      countryArr.sort((a: CountryDataPoint, b: CountryDataPoint) => {
        if (a.carbon < b.carbon) {
          return 1;
        } else if (b.carbon < a.carbon) {
          return -1;
        } else {
          return 0;
        }
      });

      // use the biggest one to set the unit
      let country_measure = set_carbon_unit(countryArr[0].carbon);

      // set page arr and country arr carbon
      for (let i = 0; countryArr.length > i; i++) {
        let country = countryArr[i];
        country.carbon = set_carbon_value(country_measure, country.carbon);
        country.carbon_unit = country_measure;
      }

    }

    if( pageArr.length > 0) {
      // sort the countries based on emission
      pageArr.sort((a: PageDataPoint, b: PageDataPoint) => {
        if (a.carbon < b.carbon) {
          return 1;
        } else if (b.carbon < a.carbon) {
          return -1;
        } else {
          return 0;
        }
      });

      let page_measure = set_carbon_unit(pageArr[0].carbon);

      // set page arr and country arr carbon
      for (let i = 0; pageArr.length > i; i++) {
        let page = pageArr[i];
        page.carbon = set_carbon_value(page_measure, page.carbon);
        page.carbon_unit = page_measure;
      }
    }
    //get average session length
    let sessionLengths = data.views.map((row: View) =>
      Number(row.session_length),
    );

    figuresAverageSessionLength =
      sessionLengths.reduce((a: number, b: number) => a + b) /
      sessionLengths.length;

    /* gradient */
    PC = 100 - (totalCarbonCount / data.views.length) * 100;
  }

  let return_data = objectToBuffer({
    PC: PC,
    totalCarbonCount: totalCarbonCount,
    figuresUserNum: figuresUserNum,
    figuresVisitsNum: figuresVisitsNum,
    figuresCo2NumUnit: figuresCo2NumUnit,
    figuresRealTimeUsersNum: figuresRealTimeUsersNum,
    figuresRealTimeCarbonNum: figuresRealTimeCarbonNum,
    figuresAverageSessionLength: figuresAverageSessionLength,
    countryArr: countryArr,
    pageArr: pageArr,
    data: data,
  });
  postMessage(return_data);
};
export {};
