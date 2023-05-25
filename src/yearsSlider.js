import {
  initSlider,
  getSliderSubject,
  getSliderLazySubject,
} from "../lib/slider";

const initYearsSlider = (minYear, maxYear) => {
  const yearsSlider = document.getElementById("years-slider");

  const slider = initSlider(
    yearsSlider.getElementsByTagName("div")[0],
    minYear,
    maxYear
  );

  const fromSpan = yearsSlider.getElementsByTagName("span")[0];
  const toSpan = yearsSlider.getElementsByTagName("span")[1];

  const sliderSubject = getSliderSubject(slider);
  sliderSubject.subscribe((values) => {
    fromSpan.innerHTML = values[0];
    toSpan.innerHTML = values[1];
  });

  const sliderLazySubject = getSliderLazySubject(slider);

  return sliderLazySubject;
};

export { initYearsSlider };
