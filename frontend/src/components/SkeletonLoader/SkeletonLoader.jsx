// src/components/Skeleton/Skeleton.js
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = ({
  type = "rectangle", // Kiểu skeleton: rectangle, square, circle
  size = "medium", // Kích thước: small, medium, large
  length = "medium", // Độ dài (chỉ áp dụng cho rectangle): short, medium, long
  width, // Tùy chỉnh chiều rộng (nếu có)
  height, // Tùy chỉnh chiều cao (nếu có)
  count = 1, // Số lượng skeleton
  className, // Class tùy chỉnh
}) => {
  // Xác định kích thước dựa trên type, size và length
  const getDimensions = () => {
    let dimensions = {};

    if (type === "rectangle") {
      // Kích thước cho hình chữ nhật
      const heights = {
        small: 10,
        medium: 20,
        large: 30,
      };

      const widths = {
        short: 100,
        medium: 200,
        long: 300,
      };

      dimensions.height = height || heights[size] || 20;
      dimensions.width = width || widths[length] || 200;
    } else if (type === "square") {
      // Kích thước cho hình vuông
      const sizes = {
        small: 30,
        medium: 50,
        large: 70,
      };

      dimensions.height = height || sizes[size] || 50;
      dimensions.width = width || sizes[size] || 50;
    } else if (type === "circle") {
      // Kích thước cho hình tròn
      const sizes = {
        small: 30,
        medium: 50,
        large: 70,
      };

      dimensions.height = height || sizes[size] || 50;
      dimensions.width = width || sizes[size] || 50;
      dimensions.circle = true; // Để tạo hình tròn
    }

    return dimensions;
  };

  const dimensions = getDimensions();

  return (
    <Skeleton
      count={count}
      height={dimensions.height}
      width={dimensions.width}
      circle={dimensions.circle || false}
      className={className}
      baseColor="#e0e0e0" // Màu nền của skeleton
      highlightColor="#f5f5f5" // Màu sáng khi hiệu ứng chạy
    />
  );
};

export default SkeletonLoader;
