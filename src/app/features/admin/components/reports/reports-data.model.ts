export interface TrackingData {
  pageViews: number;
  visitors: number;
  returnVisitors: number;
}

export interface ReportsData {
  usersCount: number;
  ordersCount: number;
  trackingData: TrackingData;
  totalSales: number;
}
