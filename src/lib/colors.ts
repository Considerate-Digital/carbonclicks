import chroma from "chroma-js";

export const Colors = (max_colors = 5) => {
  let green = "rgb(6, 188, 111)";
  let swamp = "rgb(175, 186, 173)";
  let grey = "rgb(229, 235, 231)";
  let black = "rgb(48, 48, 48)";
  let white = "rgb(255, 255,255)";

  let green_fn = chroma.scale([green, white]).domain([0, max_colors]);
  let swamp_fn = chroma.scale([swamp, white]).domain([0, max_colors]);
  let grey_fn = chroma.scale([black, white]).domain([0, max_colors]);

  let scaleArr = [];
  let green_scale = [];
  let swamp_scale = [];
  let grey_scale = [];

  while (scaleArr.length < max_colors) {
    scaleArr.push(green_fn(scaleArr.length).hex());
    scaleArr.push(swamp_fn(scaleArr.length - 1).hex());
    scaleArr.push(grey_fn(scaleArr.length - 2).hex());
    green_scale.push(green_fn(scaleArr.length).hex());
    swamp_scale.push(swamp_fn(scaleArr.length).hex());
    grey_scale.push(grey_fn(scaleArr.length).hex());
  }

  return {
    green,
    swamp,
    grey,
    black,
    white,
    green_scale,
    swamp_scale,
    grey_scale,
    scaleArr,
  };
};
