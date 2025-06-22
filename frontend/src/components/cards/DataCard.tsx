import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { TrendingUp, TrendingDown, Refresh } from "@mui/icons-material";
import type { ChartDataPoint } from "../../types";

interface DataCardProps {
  title: string;
  subtitle?: string;
  data: ChartDataPoint[];
  totalValue?: number;
  previousValue?: number;
  isLoading?: boolean;
  onRefresh?: () => void;
  children?: React.ReactNode;
  color?: string;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  data,
  totalValue,
  previousValue,
  isLoading = false,
  onRefresh,
  children,
  color = "#1976d2",
}) => {
  const calculateGrowth = () => {
    if (!totalValue || !previousValue) return null;
    const growth = ((totalValue - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(growth),
      isPositive: growth >= 0,
    };
  };

  const growth = calculateGrowth();

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: "450px",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardHeader
        title={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" component="h2" fontWeight="bold">
              {title}
            </Typography>
            {onRefresh && (
              <Tooltip title="Refresh data">
                <IconButton
                  size="small"
                  onClick={onRefresh}
                  disabled={isLoading}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
        subheader={
          <Box>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                {subtitle}
              </Typography>
            )}
            {totalValue !== undefined && (
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color={color}
              >
                {totalValue.toLocaleString()}
              </Typography>
            )}
            {growth && (
              <Box display="flex" alignItems="center" mt={1}>
                {growth.isPositive ? (
                  <TrendingUp sx={{ color: "success.main", mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: "error.main", mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  color={growth.isPositive ? "success.main" : "error.main"}
                  fontWeight="medium"
                >
                  {growth.isPositive ? "+" : "-"}
                  {growth.value.toFixed(1)}%
                </Typography>
              </Box>
            )}
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        {isLoading ? (
          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress />
          </Box>
        ) : (
          <>
            {children}
            {data.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Top Categories:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {data.slice(0, 3).map((item, index) => (
                    <Chip
                      key={index}
                      label={`${item.label}: ${item.value.toLocaleString()}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;
 