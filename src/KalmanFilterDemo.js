import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const KalmanFilterDemo = () => {
  const [noise, setNoise] = useState(1.0);
  const [alpha, setAlpha] = useState(1.2);
  const [autoNoise, setAutoNoise] = useState(true);
  const [data, setData] = useState({
    trueState: [],
    noisyMeasurements: [],
    estimates: [],
  });

  useEffect(() => {
    const timesteps = 100;
    const trueState = d3.range(timesteps).map((d) => d / 10);
    const noisyMeasurements = trueState.map((d) => d + d3.randomNormal(0, noise)());

    let estimates = [];
    let P_k = 1;

    noisyMeasurements.forEach((z) => {
      let R_k = alpha * noise;
      let K_k = P_k / (P_k + R_k);
      let x_k = (estimates.length > 0 ? estimates[estimates.length - 1] : 0) + K_k * (z - (estimates.length > 0 ? estimates[estimates.length - 1] : 0));
      estimates.push(x_k);
      P_k = (1 - K_k) * P_k;
    });

    setData({ trueState, noisyMeasurements, estimates });
  }, [noise, alpha]);

  useEffect(() => {
    let direction = 1;
  
    if (!autoNoise) return; // <-- THIS MUST BE OUTSIDE setInterval
  
    const interval = setInterval(() => {
      setNoise(prev => {
        let next = prev + direction * 0.1;
  
        if (next >= 4.0) {
          direction = -1;
          next = 4.0;
        } else if (next <= 0.5) {
          direction = 1;
          next = 0.5;
        }
  
        return next;
      });
    }, 500); // every half second
  
    return () => clearInterval(interval);
  }, [autoNoise]); // ← This is important too!
  useEffect(() => {
    let title = "Kalman Filter Resilience";
  
    if (noise < 1.5) {
      title += " – Normal Operation";
    } else if (noise >= 1.5 && noise < 3.5) {
      title += " – Under Attack";
    } else {
      title += " – Recovery Mode";
    }
  
    document.title = title;
  }, [noise]);
  
  



const width = 500;
const height = 300;

const xScale = d3.scaleLinear()
  .domain([0, data.trueState.length - 1])
  .range([0, width]);

const yValues = [...data.trueState, ...data.noisyMeasurements, ...data.estimates];
const yExtent = d3.extent(yValues);

const yScale = d3.scaleLinear()
  .domain(yExtent)
  .range([height, 0]);
  useEffect(() => {
    document.title = "Kalman Filter Resilience on Cyber-Attacks";
  }, []);
  
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Live Kalman Filter Demo</h1>

      <div>
        <label>Noise Level:</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={noise}
          onChange={(e) => setNoise(parseFloat(e.target.value))}
        />
        <span> {noise.toFixed(1)}</span>
      </div>

      <div>
        <label>Adaptive Factor (α):</label>
        <input
          type="range"
          min="1.0"
          max="2.5"
          step="0.1"
          value={alpha}
          onChange={(e) => setAlpha(parseFloat(e.target.value))}
        />
        <span> {alpha.toFixed(1)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: "500px", margin: "10px auto" }}>
  <span style={{ color: "green" }}>Normal</span>
  <span style={{ color: "red" }}>Attack</span>
  <span style={{ color: "blue" }}>Recovery</span>
</div>

<button onClick={() => setAutoNoise(prev => !prev)}>
  {autoNoise ? "Pause Auto Noise" : "Resume Auto Noise"}
</button>

      <svg width={width} height={height} style={{ border: "1px solid black" }}>
      <rect x={0} y={0} width={width / 3} height={height} fill="#e8f5e9" /> {/* Greenish - Normal */}
  <rect x={width / 3} y={0} width={width / 3} height={height} fill="#fffbee" /> {/* Reddish - Attack */}
  <rect x={(2 * width) / 3} y={0} width={width / 3} height={height} fill="#e3f2fd" /> {/* Blueish - Recovery */}
    
  <path
    d={d3.line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d))(data.trueState)}
    stroke="green"
    strokeWidth="2"
    fill="none"
  />
  <path
    d={d3.line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d))(data.noisyMeasurements)}
    stroke="red"
    strokeWidth="2"
    fill="none"
  />
  <path
    d={d3.line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d))(data.estimates)}
    stroke="blue"
    strokeWidth="2"
    fill="none"
  />
</svg>



      <p>
        <strong>Green</strong>: True Path | <strong>Red</strong>: Noisy Measurements |{" "}
        <strong>Blue</strong>: Filtered Path
      </p>
    </div>
  );
};

export default KalmanFilterDemo;
