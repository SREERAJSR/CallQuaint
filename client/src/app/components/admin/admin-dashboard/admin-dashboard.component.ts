import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { DashboardData, LastSubscribedUser } from 'src/app/types/admin.intefaces';
import { ApiResponse } from 'src/app/types/api.interface';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit ,OnDestroy {

  @ViewChild("chart") chart?: ChartComponent; 
  public chartOptions?: Partial<ChartOptions>;

  @ViewChild("piechart") piechart?: ChartComponent;
  public pieChartOptions?: Partial<PieChartOptions>;

  adminServices = inject(AdminService)
  totalSalesBymonth: number[] = []
  totalUsersCount?: number
  totalSales?: number
  premiumMembersCount?: number
  randomCallsCount?: number
  normalUsers?: number
  last5subscribers?: LastSubscribedUser[];
  fetchDashobardDataSubscription?:Subscription
  constructor() {
    this.initializeChartDiagram()
    this.initializePieDiagram()
  }

  ngOnInit(): void {
    this.fetchDashboardData();
  }


  fetchDashboardData() {
   this.fetchDashobardDataSubscription= this.adminServices.fetchDashboardData().subscribe({
      next: (response: ApiResponse) => {
        const dashboardData = response.data as DashboardData;
        this.totalUsersCount = dashboardData.totalUsers;
        this.totalSales = dashboardData.successOrdersCount;
        this.premiumMembersCount = dashboardData.currentSubscribersCount;
        this.randomCallsCount = dashboardData.randomCallsCount;
        this.totalSalesBymonth = dashboardData.salesByMonth;
        this.normalUsers = dashboardData.normalUsers;
        this.last5subscribers = dashboardData.last5subscribedUsers
        this.initializeChartDiagram();
        this.initializePieDiagram();
      },
     error: (error) => {
       throw error;
      }
    });
  }

  initializeChartDiagram() {
    this.chartOptions = {
      series: [
        {
          name: "Total Sales",
          data: this.totalSalesBymonth
        }
      ],
      chart: {
        height: 350,
        type: "line"
      },
      stroke: {
        width: 7,
        curve: "smooth"
      },
      xaxis: {
        type: "category",
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      title: {
        text: "Monthly Sales",
        align: "left",
        style: {
          fontSize: "16px",
          color: "#666"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#FDD835"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 4,
        colors: ["#FFA41B"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      yaxis: {
        min: 0, // Adjust according to your data range
        title: {
          text: "Total Sales"
        }
      }
    };
  }

  initializePieDiagram() {
    this.pieChartOptions = {
      series: [this.premiumMembersCount!, this.normalUsers!],
      chart: {
        type: "donut"
      },
      labels: ["Premium users", "Normal users"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 100
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  ngOnDestroy(): void {
    this.fetchDashobardDataSubscription?.unsubscribe()
  }
}
