import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = () => {
  return (
    <div>
      {/* Skeleton cho bảng */}
      <Skeleton height={30} width="100%" />
      <Skeleton height={20} width="100%" count={3} />

      {/* Skeleton cho biểu đồ */}
      <Skeleton height={300} width="100%" />
    </div>
  );
};

export default SkeletonLoader;
