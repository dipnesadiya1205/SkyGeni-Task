import { useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchDashboardSummary,
  fetchAvailableQuarters,
  setSelectedQuarter,
  fetchQuarterData,
} from "../store/slices/analyticsSlice";
import CustomerTypeCard from "./cards/CustomerTypeCard";
import ACVRangeCard from "./cards/ACVRangeCard";
import IndustryCard from "./cards/IndustryCard";
import TeamCard from "./cards/TeamCard";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    dashboardSummary,
    availableQuarters,
    loading,
    error,
    selectedQuarter,
  } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    if (!dashboardSummary) {
      dispatch(fetchDashboardSummary());
    }
    if (availableQuarters.length === 0) {
      dispatch(fetchAvailableQuarters());
    }
  }, [dispatch, dashboardSummary, availableQuarters]);

  useEffect(() => {
    if (selectedQuarter) {
      dispatch(fetchQuarterData(selectedQuarter));
    }
  }, [selectedQuarter, dispatch]);

  const handleQuarterChange = (event: SelectChangeEvent<string>) => {
    const quarter = event.target.value;
    dispatch(setSelectedQuarter(quarter === "All Quarters" ? null : quarter));
  };

  if (loading && !dashboardSummary) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight="bold"
          color="primary"
        >
          SkyGeni Analytics Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Comprehensive sales analytics and insights
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      {dashboardSummary && (
        <Grid
          container
          spacing={3}
          mb={4}
          sx={{
            flexWrap: "nowrap",
            justifyContent: "space-between",
          }}
        >
          <Grid item xs={12} sm={6} md={3} sx={{ flexBasis: "23%" }}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "primary.main",
                color: "white",
              }}
            >
              <Typography variant="h4" component="div" fontWeight="bold">
                {dashboardSummary.totalDeals.toLocaleString()}
              </Typography>
              <Typography variant="body1">Total Deals</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ flexBasis: "23%" }}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "success.main",
                color: "white",
              }}
            >
              <Typography variant="h4" component="div" fontWeight="bold">
                ${dashboardSummary.totalACV.toLocaleString()}
              </Typography>
              <Typography variant="body1">Total ACV</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ flexBasis: "23%" }}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "warning.main",
                color: "white",
              }}
            >
              <Typography variant="h4" component="div" fontWeight="bold">
                ${dashboardSummary.averageACV.toLocaleString()}
              </Typography>
              <Typography variant="body1">Average ACV</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ flexBasis: "23%" }}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "info.main",
                color: "white",
              }}
            >
              <Typography variant="h4" component="div" fontWeight="bold">
                {dashboardSummary.quarters.length}
              </Typography>
              <Typography variant="body1">Quarters</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Quarter Selector */}
      {dashboardSummary && dashboardSummary.quarters.length > 0 && (
        <Box mb={3}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Quarter</InputLabel>
            <Select
              value={selectedQuarter || "All Quarters"}
              label="Select Quarter"
              onChange={handleQuarterChange}
            >
              <MenuItem value="All Quarters">
                <span>All Quarters</span>
              </MenuItem>
              {dashboardSummary.quarters.map((quarter) => (
                <MenuItem key={quarter} value={quarter}>
                  {quarter}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ flexWrap: "nowrap" }}>
        <Grid item xs={12} md={6}>
          <CustomerTypeCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <ACVRangeCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <IndustryCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <TeamCard />
        </Grid>
      </Grid>

      {/* Top Performers */}
      {dashboardSummary && (
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={6} sx={{ width: "25%" }}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Top Industries
              </Typography>
              <List dense>
                {dashboardSummary.topIndustries.map((item) => (
                  <ListItem key={item.industry} disableGutters>
                    <ListItemText
                      primary={item.industry}
                      secondary={
                        <Box
                          component="span"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>{`$${item.totalACV.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`}</span>
                          <span>{`(${item.dealCount} deals)`}</span>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} sx={{ width: "25%" }}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Top Teams
              </Typography>
              <List dense>
                {dashboardSummary.topTeams.map((item) => (
                  <ListItem key={item.team} disableGutters>
                    <ListItemText
                      primary={item.team}
                      secondary={
                        <Box
                          component="span"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>{`$${item.totalACV.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}`}</span>
                          <span>{`(${item.dealCount} deals)`}</span>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
