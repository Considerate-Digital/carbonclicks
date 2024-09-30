import { objectToBuffer, bufferToObject } from "$lib/utils/buffer";
import countries from "i18n-iso-countries";
import enLang from "i18n-iso-countries/langs/en.json";
import type { CountryDataPoint } from "$lib/types/dashboard";
countries.registerLocale(enLang);

function match_countries(d: any, countryArr: CountryDataPoint[]) {
  let match = 0;
  for (let i = 0; countryArr.length > i; i++) {
    let country = countryArr[i];
    if (
      d.properties.name ==
      countries.getName(country.name, "en", { select: "official" })
    ) {
      if (country.carbon) {
        return (match = Number(country.carbon.toFixed(2)));
      } else {
        return (match = 0);
      }
    }
  }
  return match;
}

onmessage = async (e) => {
  let { countries_topo, countryArr } = bufferToObject(e.data);

  let labels = [];
  let data = [];
  
  if (countryArr.length > 0) {
    let carbon_unit = countryArr[0].carbon_unit;
    // this increases the efficiency to a single loop
    for (let i = 0; countries_topo.length > i; i++) {
      // not sure what type the countries topo takes
      let c_top: any = countries_topo[i];
      let match = match_countries(c_top, countryArr);
      let result = c_top.properties.name + " " + match + carbon_unit + "CO2e";
      labels.push(result);
      data.push({
        feature: c_top,
        value: match,
      });
    }
  }

  let data_prep = {
    data: data,
    labels: labels,
  };
  // convert object to buffer
  let returnData = objectToBuffer(data_prep);
  postMessage(returnData);
};
export {};
