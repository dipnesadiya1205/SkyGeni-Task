import { Router, Request, Response } from "express";
import { DataService } from "./dataService";

const router = Router();
const dataService = new DataService();

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "SkyGeni Analytics API is running" });
});

// Get all data
router.get("/data", async (req: Request, res: Response) => {
  try {
    const data = await dataService.getAllData();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get dashboard summary
router.get("/dashboard/summary", async (req: Request, res: Response) => {
  try {
    const summary = await dataService.getDashboardSummary();
    res.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard summary",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get data for a specific quarter
router.get("/quarter/:quarter", async (req: Request, res: Response) => {
  try {
    const { quarter } = req.params;
    const quarterData = await dataService.getQuarterData(quarter);

    if (!quarterData) {
      return res.status(404).json({
        success: false,
        error: "Quarter not found",
        message: `No data available for quarter: ${quarter}`,
      });
    }

    res.json({
      success: true,
      data: quarterData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch quarter data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get available quarters
router.get("/quarters", async (req: Request, res: Response) => {
  try {
    const quarters = await dataService.getAvailableQuarters();
    res.json({
      success: true,
      data: quarters,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch quarters",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get customer type data
router.get("/customer-types", async (req: Request, res: Response) => {
  try {
    const data = await dataService.getCustomerTypeData();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch customer type data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get ACV range data
router.get("/acv-ranges", async (req: Request, res: Response) => {
  try {
    const data = await dataService.getACVRangeData();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch ACV range data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get account industry data
router.get("/industries", async (req: Request, res: Response) => {
  try {
    const data = await dataService.getAccountIndustryData();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch industry data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get team data
router.get("/teams", async (req: Request, res: Response) => {
  try {
    const data = await dataService.getTeamData();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch team data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
