import { initYearsSlider } from "./src/yearsSlider";
import * as ukraineMap from "./src/ukraineMap";
import * as loadingOverlay from "./src/loadingOverlay";
import * as ownershipTypePie from "./src/ownershipTypePie";
import { ownershipTypeSubject } from "./src/ownershipTypePie";
import { regionSubject } from "./src/ukraineMap";

import * as d3 from "d3";

loadingOverlay.showOverlay();

const universities = await d3.json(
  "https://gist.githubusercontent.com/yuuurchyk/64742248b501bca593bf112e41f1e244/raw/ec5160cb31db4358709a2d390c361f235e86a6e6/data.json"
);
// code
// year
// name
// uni_type
// ownership_type

await ukraineMap.initMap();

const yearBounds = d3.extent(universities, (d) => d.year);

const yearsSubject = initYearsSlider(yearBounds[0], yearBounds[1]);

ownershipTypePie.initPie();

const updateState = () => {
  const [minYear, maxYear] = yearsSubject.value;
  const ownership_type = ownershipTypeSubject.value;
  const region = regionSubject.value;

  const regionValues = new Map();
  const ownershipValues = new Map();

  for (const uni of universities) {
    if (uni.year < minYear || uni.year > maxYear) continue;

    if (!region || region == uni.code) {
      ownershipValues.set(
        uni.ownership_type,
        (ownershipValues.get(uni.ownership_type) ?? 0) + 1
      );
    }

    if (!ownership_type || ownership_type == uni.ownership_type) {
      regionValues.set(uni.code, (regionValues.get(uni.code) ?? 0) + 1);
    }
  }

  ukraineMap.setValues(regionValues);
  ownershipTypePie.setValues(ownershipValues);
};

yearsSubject.subscribe((_) => updateState());
regionSubject.subscribe((_) => updateState());
ownershipTypeSubject.subscribe((_) => updateState());

loadingOverlay.hideOverlay();
