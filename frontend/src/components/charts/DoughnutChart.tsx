import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { ChartDataPoint } from "../../types";

interface DoughnutChartProps {
  data: ChartDataPoint[];
  width: number;
  height: number;
  title: string;
  colors?: string[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  width,
  height,
  title,
  colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
  ],
}) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !ref.current) return;

    // Clear previous chart
    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current);
    const legendWidth = 150;
    const chartAreaWidth = width - legendWidth;
    const radius = Math.min(chartAreaWidth, height) / 2 - 20;
    const centerX = chartAreaWidth / 2;
    const centerY = height / 2;

    // Create chart group
    const g = svg
      .append("g")
      .attr("transform", `translate(${centerX},${centerY})`);

    // Create pie generator
    const pie = d3
      .pie<ChartDataPoint>()
      .value((d) => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<ChartDataPoint>>()
      .innerRadius(radius * 0.4) // This creates the doughnut hole
      .outerRadius(radius);

    // Color scale
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.label))
      .range(colors);

    // Create the pie chart
    g.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.data.label) as string)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 1);

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

        const percentage = (
          (d.value / d3.sum(data, (d) => d.value)) *
          100
        ).toFixed(1);
        tooltip
          .html(
            `
          <strong>${d.data.label}</strong><br/>
          Value: ${d.value.toLocaleString()}<br/>
          Percentage: ${percentage}%
        `
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.8);
        d3.selectAll(".tooltip").remove();
      });

    // Add percentage labels in the center
    g.selectAll(".percentage-label")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("class", "percentage-label")
      .attr("transform", (d) => {
        const pos = arc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text((d) => {
        const percentage = (d.value / d3.sum(data, (d) => d.value)) * 100;
        return percentage > 5 ? `${percentage.toFixed(1)}%` : "";
      });

    // Add lines connecting labels to slices
    g.selectAll(".label-line")
      .data(pie(data))
      .enter()
      .append("polyline")
      .attr("class", "label-line")
      .attr("points", (d) => {
        const pos = arc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        const startPoint = arc.centroid(d);
        const midPoint = [
          radius * 0.95 * (midangle < Math.PI ? 1 : -1),
          pos[1],
        ];
        const endPoint = [
          radius * 0.99 * (midangle < Math.PI ? 1 : -1),
          pos[1],
        ];
        return `${startPoint},${midPoint},${endPoint}`;
      })
      .style("fill", "none")
      .style("stroke", "#666")
      .style("stroke-width", "1px");

    // Add total in center
    const total = d3.sum(data, (d) => d.value);
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Total");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.5em")
      .style("font-size", "14px")
      .text(total.toLocaleString());

    // Add legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${chartAreaWidth + 10}, 30)`);

    const legendItems = legend
      .selectAll(".legend-item")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => colorScale(d.label) as string);

    legendItems
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("font-size", "12px")
      .text((d) => d.label);
  }, [data, width, height, title, colors]);

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      style={{ display: "block", margin: "auto" }}
    />
  );
};

export default DoughnutChart;
