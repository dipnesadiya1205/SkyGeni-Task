import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchAccountIndustryData } from "../../store/slices/analyticsSlice";
import DataCard from "./DataCard";
import BarChart from "../charts/BarChart";
import type { ChartDataPoint, AccountIndustryRecord } from "../../types";

const IndustryCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accountIndustryData, quarterData, selectedQuarter, loading } =
    useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    if (accountIndustryData.length === 0) {
      dispatch(fetchAccountIndustryData());
    }
  }, [dispatch, accountIndustryData.length]);

  const chartData = useMemo(() => {
    const sourceData =
      selectedQuarter && quarterData && quarterData.quarter === selectedQuarter
        ? quarterData.industries
        : accountIndustryData;

    if (!sourceData) return [];

    const aggregatedData = new Map<string, number>();
    sourceData.forEach((item) => {
      aggregatedData.set(
        item.Acct_Industry,
        (aggregatedData.get(item.Acct_Industry) || 0) + item.count
      );
    });

    return Array.from(aggregatedData.entries()).map(([label, value]) => ({
      label,
      value,
    }));
  }, [accountIndustryData, quarterData, selectedQuarter]);

  const totalDeals = chartData.reduce((sum, item) => sum + item.value, 0);

  const handleRefresh = () => {
    dispatch(fetchAccountIndustryData());
  };

  return (
    <DataCard
      title="Industries"
      subtitle={
        selectedQuarter
          ? `Distribution for ${selectedQuarter}`
          : "Deal distribution by industry"
      }
      data={chartData}
      totalValue={totalDeals}
      isLoading={loading}
      onRefresh={handleRefresh}
      color="#ff9800"
    >
      <BarChart
        data={chartData}
        width={300}
        height={250}
        title="Industry Distribution"
        xLabel="Industry"
        yLabel="Number of Deals"
        colors={["#ff9800", "#ff5722", "#795548", "#9e9e9e", "#607d8b"]}
      />
    </DataCard>
  );
};

export default IndustryCard;
