import React, {PureComponent} from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import classNames from "classnames/bind";
import styles from "./Chart.module.scss";

const cx = classNames.bind(styles);

const Chart = ({data}) => {
  console.log(data);
  const mappedData = [
    ...(Array.isArray(data)
      ? data.map((item) => ({
          name: item.time,
          Temperature: item.temperature,
          Humidity: item.humidity,
        }))
      : []),
  ];

  console.log(mappedData);

  const CustomTooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          <p style={{color: "#2c3e50"}}>{`Time: ${label}`}</p>
          <p style={{color: "#8884d8"}}>{`Temperature: ${payload[0].payload.Temperature}°C`}</p>
          <p style={{color: "#82ca9d"}}>{`Humidity: ${payload[1].payload.Humidity}%`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{width: "", height: "600px", margin: "20px 0"}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mappedData.splice(0, 20)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" padding={{left: 30, right: 30}} tick={{fontSize: 14}} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="Temperature" stroke="#8884d8" strokeWidth={1} activeDot={{r: 8}} />
          <Line type="monotone" dataKey="Humidity" stroke="#82ca9d" strokeWidth={1} activeDot={{r: 8}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
