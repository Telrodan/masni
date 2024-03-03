import { Route } from '@angular/router';

const reportsComponent = () =>
  import('./reports.component').then((c) => c.ReportsComponent);

const reportChartsComponent = () =>
  import('./report-charts/report-charts.component').then(
    (c) => c.ReportChartsComponent
  );

const logsComponent = () =>
  import('./logs/logs.component').then((c) => c.LogsComponent);

export default [
  {
    path: '',
    redirectTo: 'summary',
    pathMatch: 'full'
  },
  {
    path: 'summary',
    loadComponent: reportsComponent
  },
  {
    path: 'charts',
    loadComponent: reportChartsComponent
  },
  {
    path: 'logs',
    loadComponent: logsComponent
  }
] as Route[];
