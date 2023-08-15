import React from "react";
import { Line } from "react-chartjs-2";

function LineChart({ chartData, chartTitle, chartSubtitle }) {
  return (
    <div className="chart-container">
      <h4 style={{ textAlign: "center" }}> {chartTitle} </h4>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: chartSubtitle
            },
            legend: {
              display: true
            }
          }
        }
      }
      />
    </div>
  );
}
export default LineChart;