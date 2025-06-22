import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchACVRangeData } from "../../store/slices/analyticsSlice";
import DataCard from "./DataCard";
import BarChart from "../charts/BarChart";
import type { ChartDataPoint, ACVRangeRecord } from "../../types";

const ACVRangeCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { acvRangeData, quarterData, selectedQuarter, loading } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    if (acvRangeData.length === 0) {
      dispatch(fetchACVRangeData());
    }
  }, [dispatch, acvRangeData.length]);

  const chartData = useMemo(() => {
    const sourceData =
      selectedQuarter && quarterData && quarterData.quarter === selectedQuarter
        ? quarterData.acvRanges
        : acvRangeData;

    if (!sourceData) return [];

    const aggregatedData = new Map<string, number>();
    sourceData.forEach((item) => {
      aggregatedData.set(
        item.ACV_Range,
        (aggregatedData.get(item.ACV_Range) || 0) + item.count
      );
    });

    return Array.from(aggregatedData.entries()).map(([label, value]) => ({
      label,
      value,
    }));
  }, [acvRangeData, quarterData, selectedQuarter]);

  const totalDeals = chartData.reduce((sum, item) => sum + item.value, 0);

  const handleRefresh = () => {
    dispatch(fetchACVRangeData());
  };

  return (
    <DataCard
      title="ACV Ranges"
      subtitle={
        selectedQuarter
          ? `Distribution for ${selectedQuarter}`
          : "Deal distribution by ACV range"
      }
      data={chartData}
      totalValue={totalDeals}
      isLoading={loading}
      onRefresh={handleRefresh}
      color="#4caf50"
    >
      <BarChart
        data={chartData}
        width={300}
        height={250}
        title="ACV Range Distribution"
        xLabel="ACV Range"
        yLabel="Number of Deals"
        colors={["#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ff9800"]}
      />
    </DataCard>
  );
};

export default ACVRangeCard;
