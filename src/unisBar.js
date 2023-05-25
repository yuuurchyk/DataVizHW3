import * as d3 from "d3";

const width = 1000;
const height = 400;

const paddingHorizontal = 50;
const paddingVertical = 40;

const colors = new Map();
colors.set("state", "#2ecc71");
colors.set("private", "#f39c12");
colors.set("municipal", "#3498db");

const plot = d3
  .select("#unis-bar")
  .select("svg")
  .attr("width", width + "px")
  .attr("height", height + "px");

const clear = () => {
  plot.selectAll("*").remove();
};

const setUniversities = (minYear, maxYear, universities) => {
  clear();

  if (universities.length == 0) return;

  const ownerships = new Set();
  for (const uni of universities) ownerships.add(uni.ownership_type);

  const yearsExtent = [minYear, maxYear];

  const cntByYear = new Map();
  for (let i = yearsExtent[0]; i <= yearsExtent[1]; ++i) cntByYear.set(i, 0);
  universities.forEach((uni) =>
    cntByYear.set(uni.year, cntByYear.get(uni.year) + 1)
  );

  let data = [];
  for (let i = yearsExtent[0]; i <= yearsExtent[1]; ++i) {
    if (cntByYear.get(i) == 0) continue;
    data.push({
      year: i,
      cnt: cntByYear.get(i),
    });
  }

  const maxCnt = d3.max(data, (d) => d.cnt);

  let years = [];
  for (let i = yearsExtent[0]; i <= yearsExtent[1]; ++i) years.push(i);

  const xScale = d3
    .scaleBand()
    .range([0, width - 2 * paddingHorizontal])
    .domain(years);
  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickValues(
      xScale.domain().filter(function (d, i) {
        return !(i % 10);
      })
    );

  const yScale = d3
    .scaleLinear()
    .range([height - 2 * paddingVertical, 0])
    .domain([0, maxCnt]);
  const yAxis = d3.axisLeft().scale(yScale).ticks(5);

  plot
    .append("g")
    .attr(
      "transform",
      `translate(${paddingHorizontal}, ${height - paddingVertical})`
    )
    .call(xAxis);
  plot
    .append("g")
    .attr("transform", `translate(${paddingHorizontal}, ${paddingVertical})`)
    .call(yAxis);

  plot
    .append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("fill", "red")
    .attr("width", xScale.bandwidth())
    .attr("x", (d) => paddingHorizontal + xScale(d.year))
    .attr("y", (d) => paddingVertical + yScale(d.cnt))
    .attr("height", (d) => height - 2 * paddingVertical - yScale(d.cnt));
};

export { setUniversities, clear };
