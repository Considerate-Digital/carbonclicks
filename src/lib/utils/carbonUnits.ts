export function getCarbonUnit(emission: number) {
  //emission in grams
  if (emission >= 1000000) {
    return "t";
  } else if (emission >= 1000) {
    return "kg";
  } else {
    return "g";
  }
}

export function convertCarbonGrams(emission: number) {
  emission = Number(emission);
  if (emission >= 1000000) {
    return (emission / 1000000).toFixed(2);
  } else if (emission >= 1000) {
    return (emission / 1000).toFixed(2);
  } else {
    return Number(emission);
  }
}
export function set_carbon_unit(carbon: number) {
  let unit = "g";
  if (carbon >= 1000000) {
    //tons
    unit = "t";
  } else if (carbon >= 1000) {
    //kgo
    unit = "kg";
  }
  return unit;
}

export function set_carbon_value(unit: string, carbon: number) {
  if (unit === "t") {
    //tons
    carbon /= 1000000;
  } else if (unit === "kg") {
    //kgo
    carbon /= 1000;
  }
  return carbon;
}

export function get_carbon_unit_and_value(carbon: number) {
  let unit = "g";
  if (carbon >= 1000000) {
    //tons
    carbon /= 1000000;
    unit = "t";
  } else if (carbon >= 1000) {
    //kgo
    carbon /= 1000;
    unit = "kg";
  }
  return {
    unit,
    carbon,
  };
}
