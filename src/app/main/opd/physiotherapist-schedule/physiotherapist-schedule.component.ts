import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PhysiotherapistScheduleService } from './physiotherapist-schedule.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PhysioScheduleComponent } from './physio-schedule/physio-schedule.component';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { BrowseOPDBill } from '../browse-opbill/browse-opbill.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-physiotherapist-schedule',
  templateUrl: './physiotherapist-schedule.component.html',
  styleUrls: ['./physiotherapist-schedule.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PhysiotherapistScheduleComponent implements OnInit {
  displayedColumns = [
    'useraction',
    'BillDate',
    'PBillNo',
    'RegNo',
    'PatientName',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'PaidAmt',
    'BalanceAmt',
    'CashPay',
    'ChequePay',
    'CardPay',
    'AdvUsedPay',
    'OnlinePay',
    'PayCount',
    'RefundAmount',
    'CashCounterName',
    'PatientAge',
    'MobileNo',
    'VisitDate',
    'DoctorName',
    'RefDoctorName',
    'HospitalName',
    'PatientType',
    'TariffName',
    'CompanyName',
    'DepartmentName',
    'action'
  ];

  sIsLoading: string = ''
  resultsLength = 0;
  dsbillList = new MatTableDataSource<BrowseOPDBill>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _PhysiotherapistScheduleService: PhysiotherapistScheduleService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public datePipe: DatePipe,
  ) { }


  ngOnInit(): void {
    this.getBillsList(); 
  } 

  getBillsList() {
    var D_data = {
      "F_Name": (this._PhysiotherapistScheduleService.SearchForm.get("FirstName").value).trim() + '%' || "%",
      "L_Name": (this._PhysiotherapistScheduleService.SearchForm.get("LastName").value).trim() + '%' || "%",
      "From_Dt": this.datePipe.transform(this._PhysiotherapistScheduleService.SearchForm.get("start").value, "MM-dd-yyyy"),
      "To_Dt": this.datePipe.transform(this._PhysiotherapistScheduleService.SearchForm.get("end").value, "MM-dd-yyyy"),
      "Reg_No": this._PhysiotherapistScheduleService.SearchForm.get("RegNo").value || 0,
      "PBillNo": this._PhysiotherapistScheduleService.SearchForm.get("PBillNo").value || "%",
      "Start": (this.paginator?.pageIndex ?? 0),
      "Length": (this.paginator?.pageSize ?? 35)
    }
    this._PhysiotherapistScheduleService.getBillsList(D_data).subscribe(Visit => {
      this.dsbillList.data = Visit as BrowseOPDBill[];
      this.dsbillList.data = Visit["Table1"] ?? [] as BrowseOPDBill[];
      this.resultsLength = Visit["Table"][0]["total_row"];
      this.sIsLoading = this.dsbillList.data.length == 0 ? 'no-data' : '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 

  NewScheduler() {
    const dialogRef = this._matDialog.open(PhysioScheduleComponent,
      {
        maxWidth: "100%",
        width: '80%',
        height: '80%'
      }
    )
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  EditScheduler(row) {
    const dialogRef = this._matDialog.open(PhysioScheduleComponent,
      {
        maxWidth: "100%",
        width: '80%',
        height: '80%',
        data: row
      }
    )
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onClearBill() {
    this._PhysiotherapistScheduleService.SearchForm.get('FirstName').reset('');
    this._PhysiotherapistScheduleService.SearchForm.get('LastName').reset('');
    this._PhysiotherapistScheduleService.SearchForm.get('RegNo').reset('');
    this._PhysiotherapistScheduleService.SearchForm.get('PBillNo').reset('');
  }

  viewgetOPBillReportPdf(contact) {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      this._PhysiotherapistScheduleService.getBillReceipt(
        contact.BillNo
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OP BILL Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
      });

    }, 100);
  }
  getWhatsappshareSales(Obj) {

  }
}

















































