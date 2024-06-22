import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { AdminService } from 'src/app/services/admin.service';
import { ConnectService } from 'src/app/services/connect.service';
import { OrderDetail, SalesReport } from 'src/app/types/admin.intefaces';
import { ApiResponse } from 'src/app/types/api.interface';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
export const DAY_MODE_FORMATS = {
  parse: {
    dateInput: 'DD',
  },
  display: {
    dateInput: 'DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-day-report',
  templateUrl: './day-report.component.html',
  styleUrls: ['./day-report.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter ,deps:[MAT_DATE_LOCALE,MAT_MOMENT_DATE_ADAPTER_OPTIONS]},
    { provide: MAT_DATE_FORMATS, useValue: DAY_MODE_FORMATS },
  ],
})
export class DayReportComponent {
   @ViewChild(MatPaginator) paginator?: MatPaginator;
  dataSource: any
  toaxtrService = inject(ToastrService)
  adminServices = inject(AdminService)
  displayedColumns: string[] = ['index', 'fullname','amount','orderId','paymentmethod' ,'action'];
  salesReportList?: OrderDetail[];

  ngOnInit(): void {
    this.fetchReport()
  }
fetchReport() {
    const selectedDay = this.dayControl.value
    if (selectedDay) {
      const formattedDate = selectedDay.format('YYYY-MM-DD');
      this.adminServices.getSalesReport(formattedDate).subscribe({
        next: (response: ApiResponse) => {
          console.log(response);
          const salesReport = response.data[0] as SalesReport;
          if (!salesReport) {
            this.salesReportList = []
           this.dataSource = new MatTableDataSource<OrderDetail>(this.salesReportList)
            return
          }
          this.salesReportList = salesReport.details.map((order, index) => {
            return {
              index: index + 1,
              _id: order._id,
              amount: order.amount,
              createdAt: order.createdAt,
              email: order.email,
              fullname: order.fullname,
              mobile: order.fullname,
              orderId: order.orderId,
              paymentmethod: order.paymentmethod,
              paymentStatus: order.paymentStatus,
              planId: order.planId,
              updatedAt: order.updatedAt,
              userId: order.userId,
              paymentId: order.paymentId,
              receipt:order.receipt
            }
          })
          this.dataSource = new MatTableDataSource<OrderDetail>(this.salesReportList)
        }
      })
    }
  }




  dayControl = new FormControl(moment());

  onClosed() {
    if (this.dayControl.value) {
      const selectedDate = this.dayControl.value;
        this.dayControl.setValue(moment({ year: selectedDate.year(),
      month: selectedDate.month(),
      date: selectedDate.date()}));
    }
    this.fetchReport()
  }


  downloadPdf() {
    const element = document.getElementById('report');

    if (!element) {
      console.error('Element not found');
      return;
    }

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Salesreport.pdf');
    });
  }


 downloadCsvFromDiv(): void {
    const divElement = document.getElementById('report');
    if (!divElement) {
      console.error('Element not found!');
      return;
    }

    const csvData = this.extractDataFromDiv(divElement);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'salesreport.csv');
  }

  private extractDataFromDiv(element: HTMLElement): string {
    let csvContent = '';
    const rows = element.querySelectorAll('tr');
    rows.forEach(row => {
      const cols = row.querySelectorAll('td, th');
      const rowData = Array.from(cols).map(col => {
        return `"${col.textContent?.replace(/"/g, '""')}"`;
      }).join(',');
      csvContent += rowData + '\r\n';
    });
    return csvContent;
  }
}