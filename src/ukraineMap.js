import * as d3 from "d3";
import { BehaviorSubject } from "rxjs";

const regionSubject = new BehaviorSubject(null);

let values = new Map();

const width = 900;
const height = 500;

const plot = d3
  .select("#ukraine-map")
  .select("svg")
  .attr("width", width + "px")
  .attr("height", height + "px");

const initMap = async () => {
  const geoJson = await d3.json(
    "https://gist.githubusercontent.com/yuuurchyk/6ab170b7752fc8f6cd065f2502213bd0/raw/224fa9a2a59032b16779083d28cd4411e321882a/ukraine.json"
  );
  // remove Simferopol because of lack of unis
  geoJson.features = geoJson.features.filter(
    (entry) => entry.properties.HASC_1 !== "UA.SC"
  );

  const projection = d3
    .geoAlbers() // цей і наступний рядки є списані з інтернетів
    .rotate([-30, 0, 0])
    .fitSize([width, height], geoJson);
  const geoGenerator = d3.geoPath().projection(projection);

  const regionsG = plot.append("g");

  plot.on("click", (e, d) => {
    regionSubject.next(null);
  });

  regionsG
    .selectAll("path")
    .data(geoJson.features)
    .join("path")
    .attr("d", geoGenerator)
    .classed("region-polygon", true)
    .on("click", (e, d) => {
      e.stopPropagation();

      if (!values.has(d.properties.HASC_1)) return;

      d3.select(e.target).raise();

      const next =
        regionSubject.value === d.properties.HASC_1
          ? null
          : d.properties.HASC_1;

      regionSubject.next(next);
    });

  plot
    .selectAll("text")
    .data(geoJson.features)
    .join("text")
    .classed("region-number", true)
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle")
    .attr("x", (d) => {
      return geoGenerator.centroid(d.geometry)[0];
    })
    .attr("y", (d) => {
      return geoGenerator.centroid(d.geometry)[1];
    })
    .attr("dx", (d) => {
      switch (d.properties.HASC_1) {
        case "UA.OD":
          return 25;
        default:
          return 0;
      }
    })
    .attr("dy", (d) => {
      switch (d.properties.HASC_1) {
        case "UA.KC":
          return -14;
        case "UA.KV":
          return 30;
        default:
          return 0;
      }
    });

  regionSubject.subscribe((value) => {
    regionsG.selectAll("path").classed("region-polygon__selected", (d) => {
      return d.properties.HASC_1 === value;
    });
  });
};

const setValues = (valuesMap) => {
  values = valuesMap;

  const DARK_BLUE = "#34495e";
  const RED = "#e74c3c";

  const countExtent = d3.extent(valuesMap.values());
  const gradient = d3.scaleLinear().range([DARK_BLUE, RED]).domain(countExtent);

  plot.selectAll("path").attr("fill", (d) => {
    const code = d.properties.HASC_1;

    if (valuesMap.has(code)) return gradient(valuesMap.get(code));
    else return "#7f8c8d";
  });

  plot.selectAll("text").text((d) => valuesMap.get(d.properties.HASC_1) ?? "");
};

export { initMap, regionSubject, setValues };
