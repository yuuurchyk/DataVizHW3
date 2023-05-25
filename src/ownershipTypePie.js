import { BehaviorSubject } from "rxjs";
import * as d3 from "d3";

const ownershipTypeSubject = new BehaviorSubject(null);

const width = 350;
const height = 450;

const r = Math.min(width, height) / 2 - 10;

const colors = new Map();
colors.set("state", "#2ecc71");
colors.set("private", "#f39c12");
colors.set("municipal", "#3498db");

const plot = d3.select("#ownership-type-pie").select("svg");

const initPie = () => {
  plot.attr("width", width + "px").attr("height", height + "px");

  plot.on("click", () => {
    ownershipTypeSubject.next(null);
  });

  ownershipTypeSubject.subscribe((value) => {
    onOwnershipTypeChanged(value);
  });
};

const onOwnershipTypeChanged = (value) => {
  plot
    .selectAll("path")
    .classed("pie-region__selected", (d) => d.data.name === value)
    .attr("fill-opacity", (d) => {
      if (ownershipTypeSubject.value)
        return d.data.name === ownershipTypeSubject.value ? 1.0 : 0.5;
      else return 1.0;
    });

  if (value) {
    plot
      .selectAll("path")
      .filter((d) => d.data.name === value)
      .raise();
  }
};

const clear = () => {
  plot.selectAll("*").remove();
};

const setValues = (inputValues) => {
  clear();
  if (inputValues.size === 0) return;

  let n = 0;
  inputValues.forEach((cnt, name) => {
    n += cnt;
  });

  let values = [];
  inputValues.forEach((cnt, name) => {
    console.log(cnt);

    const percentage = (cnt * 100) / n;
    const roundedPercentage = Math.round(percentage * 10) / 10;
    const representation = roundedPercentage
      .toString()
      .padStart(4, "|")
      .replaceAll("|", "\u00A0\u00A0");

    values.push({
      name: name,
      cnt: cnt,
      percentage: roundedPercentage,
      percentageRepresentation: representation,
    });
  });

  values.sort((lhs, rhs) => lhs.cnt < rhs.cnt);

  const pie = d3
    .pie()
    .value((d) => d.cnt)
    .sort((lhs, rhs) => lhs.cnt > rhs.cnt);
  const arcGenerator = d3
    .arc()
    .innerRadius(0)
    .outerRadius(r)
    .startAngle(function (d) {
      return d.startAngle - Math.PI;
    })
    .endAngle(function (d) {
      return d.endAngle - Math.PI;
    });

  const sectors = plot
    .append("g")
    .attr("transform", `translate(${r + 10}, ${r + 5})`);

  sectors
    .append("g")
    .selectAll("path")
    .data(pie(values))
    .join("path")
    .attr("d", arcGenerator)
    .attr("fill", (d) => colors.get(d.data.name))
    .classed("pie-region", true)
    .on("click", (e, d) => {
      e.stopPropagation();
      const next =
        d.data.name === ownershipTypeSubject.value ? null : d.data.name;
      ownershipTypeSubject.next(next);
    });
  sectors
    .append("g")
    .selectAll("text")
    .data(pie(values))
    .join("text")
    .text((d) => (d.data.percentage <= 10 ? "" : d.data.percentage + "%"))
    .attr("x", (d) => arcGenerator.centroid(d)[0])
    .attr("y", (d) => arcGenerator.centroid(d)[1])
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle")
    .classed("pie-number", true);
  sectors
    .append("g")
    .selectAll("text")
    .data(pie(values))
    .join("text")
    .text((d) => (d.data.percentage <= 10 ? "" : d.data.name))
    .attr(
      "x",
      (d) => arcGenerator.centroid(d)[0] - (d.data.name === "college" ? 5 : 0)
    )
    .attr("y", (d) => arcGenerator.centroid(d)[1] + 15)
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle")
    .classed("pie-number", true);

  const legend = plot
    .append("g")
    .attr("transform", `translate(${(width - 180) / 2},${height - 75})`);
  legend
    .append("rect")
    .attr("width", 180)
    .attr("height", 75)
    .attr("id", "pie-legend")
    .attr("rx", 15);
  legend
    .selectAll("labels")
    .data(values)
    .enter()
    .append("rect")
    .attr("x", 10)
    .attr("y", (d, i) => i * 20 + 10)
    .attr("width", 30)
    .attr("height", 15)
    .attr("fill", (d) => colors.get(d.name))
    .attr("rx", 5)
    .classed("pie-legend-label", true);
  legend
    .selectAll("labels-text")
    .data(values)
    .enter()
    .append("text")
    .attr("x", 50)
    .attr("y", (d, i) => i * 20 + 22)
    .text((d) => `${d.percentageRepresentation}% ${d.name}`)
    .classed("pie-legend-label-text", true);

  onOwnershipTypeChanged(ownershipTypeSubject.value);
};

export { initPie, setValues, ownershipTypeSubject, clear };
