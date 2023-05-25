import { BehaviorSubject } from "rxjs";
import noUiSlider from "nouislider";

const initSlider = (domElement, minValue, maxValue) => {
  const config = {
    start: [minValue, maxValue],
    range: {
      min: [minValue],
      max: [maxValue],
    },
    step: 1,
    format: {
      from: function (value) {
        return parseInt(value);
      },
      to: function (value) {
        return parseInt(value);
      },
    },
  };

  noUiSlider.create(domElement, config);

  return domElement;
};

const getSliderSubject = (slider) => {
  const values = slider.noUiSlider.get();
  const subject = new BehaviorSubject(values);

  slider.noUiSlider.on("end", function (values, handle) {
    const v1 = values[0];
    const v2 = values[1];

    subject.next([v1, v2]);
  });
  slider.noUiSlider.on("slide", function (values, handle) {
    const v1 = values[0];
    const v2 = values[1];

    subject.next([v1, v2]);
  });

  return subject;
};

const getSliderLazySubject = (slider) => {
  const values = slider.noUiSlider.get();
  const subject = new BehaviorSubject(values);

  slider.noUiSlider.on("end", function (values, handle) {
    const v1 = values[0];
    const v2 = values[1];

    subject.next([v1, v2]);
  });

  return subject;
};

export { initSlider, getSliderSubject, getSliderLazySubject };
