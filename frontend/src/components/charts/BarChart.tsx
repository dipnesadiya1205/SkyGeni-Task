import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { ChartDataPoint } from "../../types";

interface BarChartProps {
  data: ChartDataPoint[];
  width: number;
  height: number;
  title: string;
  xLabel?: string;
  yLabel?: string;
  colors?: string[];
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width,
  height,
  title,
  xLabel = "Categories",
  yLabel = "Values",
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"],
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create chart group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([chartHeight, 0]);

    // Color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(colors);

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(title);

    // Add bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.label) || 0)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.value))
      .attr("fill", (d) => colorScale(d.label) as string)
      .attr("opacity", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 1);

        // Add tooltip
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0, 0, 0, 0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "1000");

        tooltip
          .html(
            `
          <strong>${d.label}</strong><br/>
          Value: ${d.value.toLocaleString()}
        `
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.8);
        d3.selectAll(".tooltip").remove();
      });

    // Add value labels on bars
    g.selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr("y", (d) => {
        const barHeight = chartHeight - yScale(d.value);
        return barHeight < 20 ? yScale(d.value) - 5 : yScale(d.value) + 15;
      })
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("fill", (d) => {
        const barHeight = chartHeight - yScale(d.value);
        return barHeight < 20 ? "black" : "white";
      })
      .text((d) => d.value.toLocaleString());

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-25)");

    g.append("g").call(yAxis);

    // Rotate x-axis labels
    g.select(".axis-x")
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end")
      .attr("x", -5)
      .attr("y", 5);

    // Add axis labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - chartHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(yLabel);

    g.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + margin.bottom - 10)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(xLabel);
  }, [data, width, height, title, xLabel, yLabel, colors]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ display: "block", margin: "auto" }}
    />
  );
};

export default BarChart;
