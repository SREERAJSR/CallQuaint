import { Component, ViewChild } from '@angular/core';
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
export class AdminDashboardComponent {

  @ViewChild("chart") chart?: ChartComponent; 
  public chartOptions: Partial<ChartOptions>;

   @ViewChild("piechart") piechart?: ChartComponent;
  public pieChartOptions: Partial<PieChartOptions>;
  constructor() {

    this.pieChartOptions = {
         series: [1,100],
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
    }

    this.chartOptions = {
  series: [
    {
      name: "Total Sales",
      data: [500, 700, 650, 800, 900, 750, 850, 950, 650, 780, 820, 90]
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

}
