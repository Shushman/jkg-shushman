import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import * as d3 from 'd3';

export default function MathVisualization() {
  const [amplitude, setAmplitude] = useState([1]);
  const [frequency, setFrequency] = useState([1]);
  const [phase, setPhase] = useState([0]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const x = d3.scaleLinear()
      .domain([0, 4 * Math.PI])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([-3, 3])
      .range([height, 0]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add grid
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(-height).tickFormat("" as any))
      .style("stroke-dasharray", "2,2")
      .style("opacity", 0.3);

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat("" as any))
      .style("stroke-dasharray", "2,2")
      .style("opacity", 0.3);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    // Add axis labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Amplitude");

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .text("Time (radians)");

    // Generate data points
    const data = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * 4 * Math.PI;
      const value = amplitude[0] * Math.sin(frequency[0] * t + phase[0]);
      data.push([t, value]);
    }

    // Create line generator
    const line = d3.line()
      .x((d: any) => x(d[0]))
      .y((d: any) => y(d[1]))
      .curve(d3.curveCardinal);

    // Add the line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line as any);

  }, [amplitude, frequency, phase]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mathematical Visualization</CardTitle>
        <CardDescription>
          Interactive sine wave: f(t) = A × sin(ωt + φ)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="w-full flex justify-center">
          <svg
            ref={svgRef}
            width={500}
            height={300}
            className="border rounded-lg bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Amplitude (A): {amplitude[0].toFixed(1)}
            </label>
            <Slider
              value={amplitude}
              onValueChange={setAmplitude}
              min={0.1}
              max={3}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Frequency (ω): {frequency[0].toFixed(1)}
            </label>
            <Slider
              value={frequency}
              onValueChange={setFrequency}
              min={0.1}
              max={3}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Phase (φ): {phase[0].toFixed(1)}
            </label>
            <Slider
              value={phase}
              onValueChange={setPhase}
              min={-Math.PI}
              max={Math.PI}
              step={0.1}
            />
          </div>
        </div>

        <Card className="bg-muted">
          <CardContent className="pt-4">
            <p className="text-sm font-mono text-center">
              f(t) = {amplitude[0].toFixed(1)} × sin({frequency[0].toFixed(1)}t + {phase[0].toFixed(1)})
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}