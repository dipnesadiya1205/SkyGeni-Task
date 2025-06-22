import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchTeamData } from "../../store/slices/analyticsSlice";
import DataCard from "./DataCard";
import DoughnutChart from "../charts/DoughnutChart";
import type { ChartDataPoint, TeamRecord } from "../../types";

const TeamCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teamData, quarterData, selectedQuarter, loading } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    if (teamData.length === 0) {
      dispatch(fetchTeamData());
    }
  }, [dispatch, teamData.length]);

  const chartData = useMemo(() => {
    const sourceData =
      selectedQuarter && quarterData && quarterData.quarter === selectedQuarter
        ? quarterData.teams
        : teamData;

    if (!sourceData) return [];

    const aggregatedData = new Map<string, number>();
    sourceData.forEach((item) => {
      aggregatedData.set(
        item.Team,
        (aggregatedData.get(item.Team) || 0) + item.count
      );
    });

    return Array.from(aggregatedData.entries()).map(([label, value]) => ({
      label,
      value,
    }));
  }, [teamData, quarterData, selectedQuarter]);

  const totalDeals = chartData.reduce((sum, item) => sum + item.value, 0);

  const handleRefresh = () => {
    dispatch(fetchTeamData());
  };

  return (
    <DataCard
      title="Teams"
      subtitle={
        selectedQuarter
          ? `Distribution for ${selectedQuarter}`
          : "Deal distribution by team"
      }
      data={chartData}
      totalValue={totalDeals}
      isLoading={loading}
      onRefresh={handleRefresh}
      color="#f44336"
    >
      <DoughnutChart
        data={chartData}
        width={300}
        height={250}
        title="Team Distribution"
        colors={["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5"]}
      />
    </DataCard>
  );
};

export default TeamCard;
