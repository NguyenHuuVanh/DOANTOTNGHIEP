import React from "react";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import classNames from "classnames/bind";
import styles from "./BarChart.module.scss";

const cx = classNames.bind(styles);

const BarChartComponents = ({data, allDevices, devices}) => {
  // Kiểm tra dữ liệu đầu vào
  if (!data) {
    return <div>Không có dữ liệu để hiển thị</div>;
  }

  // Hàm render biểu đồ cho một node
  const renderChart = (chartData, title) => {
    const {calculateHumi, calculateTemp} = chartData || {};

    if (!calculateTemp || typeof calculateTemp !== "object" || calculateTemp === null) {
      console.error(`calculateTemp is missing or invalid for ${title}`);
      return <div>Không có dữ liệu để hiển thị cho {title}</div>;
    }

    const dataBarChart = Object.keys(calculateTemp).map((key) => ({
      name: key,
      Temperature: parseFloat(calculateTemp[key]),
      Humidity: parseFloat(calculateHumi[key]),
    }));

    const CustomBarLabel = (props) => {
      const {x, y, width, value} = props;
      return (
        <text x={x + width / 2} y={y - 5} fill="#000" textAnchor="middle" fontSize={14} fontWeight="bold">
          {value}
        </text>
      );
    };

    return (
      <div className={cx("chart-container")}>
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={dataBarChart}
            margin={{
              top: 40,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            fontSize="12px"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(value) => {
                if (value === "StandardDeviation") return "Std Deviation";
                return value;
              }}
              label={{
                value: "Statistical parameters",
                position: "insideBottom",
                offset: -10,
                fontSize: 14,
                textAnchor: "start", // 👈 Căn trái
              }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#8884d8"
              label={{
                value: "Temperature (°C)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fontSize: 14,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#82ca9d"
              label={{
                value: "Humidity (%)",
                angle: -90,
                position: "insideRight",
                offset: 10,
                fontSize: 14,
              }}
            />
            <Tooltip contentStyle={{fontSize: "16px"}} labelStyle={{fontSize: "16px"}} itemStyle={{fontSize: "16px"}} />
            <Legend wrapperStyle={{fontSize: "16px", fontWeight: "bold", bottom: -20}} />
            <Bar yAxisId="left" dataKey="Temperature" fill="#8884d8" label={<CustomBarLabel />} />
            <Bar yAxisId="right" dataKey="Humidity" fill="#82ca9d" label={<CustomBarLabel />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Trường hợp "All Devices" được tích
  if (allDevices) {
    return (
      <div className={cx("charts-wrapper")}>
        {devices.map((device) => (
          <div key={device} className={cx("chart")}>
            {renderChart(data[device], device)}
          </div>
        ))}
      </div>
    );
  }

  // Trường hợp chỉ hiển thị một node
  return renderChart(data, "Selected Device");
};

export default BarChartComponents;
