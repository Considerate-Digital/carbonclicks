export const calculateDotColor = (urlProgressValue: number) => {
  if (urlProgressValue <= 50) {
    return "var(--primary-color-three)";
  } else if (urlProgressValue <= 60) {
    return "var(--primary-color-one)";
  } else if (urlProgressValue <= 70) {
    return "var(--primary-color-four)";
  } else {
    return "var(--primary-color-two)";
  }
};
