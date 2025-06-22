import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchCustomerTypeData } from "../../store/slices/analyticsSlice";
import DataCard from "./DataCard";
import DoughnutChart from "../charts/DoughnutChart";
import type { ChartDataPoint, CustomerTypeRecord } from "../../types";

const CustomerTypeCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customerTypeData, quarterData, selectedQuarter, loading } =
    useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    if (customerTypeData.length === 0) {
      dispatch(fetchCustomerTypeData());
    }
  }, [dispatch, customerTypeData.length]);

  const chartData = useMemo(() => {
    const sourceData =
      selectedQuarter && quarterData && quarterData.quarter === selectedQuarter
        ? quarterData.customerTypes
        : customerTypeData;

    if (!sourceData) return [];

    const aggregatedData = new Map<string, number>();
    sourceData.forEach((item) => {
      aggregatedData.set(
        item.Cust_Type,
        (aggregatedData.get(item.Cust_Type) || 0) + item.count
      );
    });

    return Array.from(aggregatedData.entries()).map(([label, value]) => ({
      label,
      value,
    }));
  }, [customerTypeData, quarterData, selectedQuarter]);

  const totalDeals = chartData.reduce((sum, item) => sum + item.value, 0);

  const handleRefresh = () => {
    dispatch(fetchCustomerTypeData());
  };

  return (
    <DataCard
      title="Customer Types"
      subtitle={
        selectedQuarter
          ? `Distribution for ${selectedQuarter}`
          : "Deal distribution by customer type"
      }
      data={chartData}
      totalValue={totalDeals}
      isLoading={loading}
      onRefresh={handleRefresh}
      color="#2196f3"
    >
      <DoughnutChart
        data={chartData}
        width={300}
        height={250}
        title="Customer Type Distribution"
        colors={["#2196f3", "#4caf50", "#ff9800", "#f44336"]}
      />
    </DataCard>
  );
};

export default CustomerTypeCard;
 