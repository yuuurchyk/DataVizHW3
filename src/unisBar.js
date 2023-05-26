import * as d3 from "d3";

const width = 1000;
const height = 400;

const paddingHorizontal = 50;
const paddingVertical = 40;

const plot = d3
  .select("#unis-bar")
  .select("svg")
  .attr("width", width + "px")
  .attr("height", height + "px");

const clear = () => {
  plot.selectAll("*").remove();
};

const transformData = (minYear, maxYear, universities) => {
  const byYear = new Map();
  for (let i = minYear; i <= maxYear; ++i)
    byYear.set(i, {
      year: i,
      state: 0,
      private: 0,
      municipal: 0,
    });

  for (const uni of universities) byYear.get(uni.year)[uni.ownership_type] += 1;

  let res = [];
  for (let i = minYear; i <= maxYear; ++i) res.push(byYear.get(i));

  const stackGen = d3
    .stack()
    .keys(["state", "private", "municipal"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  const stack = stackGen(res);

  return stack;
};

const getMaxCnt = (universities) => {
  const cnts = new Map();

  for (const uni of universities)
    cnts.set(uni.year, (cnts.get(uni.year) ?? 0) + 1);

  let res = 0;
  cnts.forEach((value, key) => {
    res = Math.max(res, value);
  });

  return res;
};

const setUniversities = (minYear, maxYear, universities) => {
  clear();

  if (universities.length == 0) return;

  const nYears = maxYear - minYear + 1;

  const data = transformData(minYear, maxYear, universities);

  const maxCnt = getMaxCnt(universities);

  const years = [];
  for (let i = minYear; i <= maxYear; ++i) years.push(i);

  const xScale = d3
    .scaleBand()
    .domain(years)
    .range([0, width - 2 * paddingHorizontal]);
  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickValues(
      xScale.domain().filter(function (d, i) {
        if (nYears > 100) return !(i % 20);
        else if (nYears > 50) return !(i % 10);
        else return !(i % 2);
      })
    );
  plot
    .append("g")
    .attr(
      "transform",
      `translate(${paddingHorizontal}, ${height - paddingVertical})`
    )
    .call(xAxis);

  const yScale = d3
    .scaleLinear()
    .range([height - 2 * paddingVertical, 0])
    .domain([0, maxCnt]);
  const yAxis = d3.axisLeft().scale(yScale).ticks(5);
  plot
    .append("g")
    .attr("transform", `translate(${paddingHorizontal}, ${paddingVertical})`)
    .call(yAxis);

  const color = d3
    .scaleOrdinal()
    .domain(["state", "private", "municipal"])
    .range(["#2ecc71", "#f39c12", "#3498db"]);

  plot
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (d) => paddingHorizontal + xScale(d.data.year))
    .attr("y", (d) => paddingVertical + yScale(d[1]))
    .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .attr("rx", 1);
};

export { setUniversities, clear };
