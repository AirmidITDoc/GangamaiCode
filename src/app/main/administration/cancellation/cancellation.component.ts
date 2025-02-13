import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CancellationService } from './cancellation.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import Swal from 'sweetalert2';
import { IPBrowseBillService } from 'app/main/ipd/ip-bill-browse-list/ip-browse-bill.service';

import { ToastrService } from 'ngx-toastr';
import { BillDateUpdateComponent } from './bill-date-update/bill-date-update.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CancellationComponent implements OnInit {
dsRefundOfBillList: any;
displayedRefundBillColumn: any;
getSearchRefOfAdvList: any;
dsRefundOfAdvList: any;
displayedRefundAdvColumn: any;
getSearchRefOfBillList() {
throw new Error('Method not implemented.');
}

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "MReportConfig/List",
        columnsList: [
            { heading: "BillDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "UHIDNo", key: "uHIDNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName ", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillAmount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DiscountAmt", key: "discountAmt", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CancellationService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "ReportName",
        sortOrder: 0,
        filters: [
            { fieldName: "Date", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "RegistrationNo", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "FirstName", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "LastName", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    gridConfig1: gridModel = {
      apiUrl: "MReportConfig/List",
      columnsList: [
          { heading: "Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "UHID", key: "uHIDNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "PatientName ", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Advance Amt ", key: "advanceAmt", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Balance Amt ", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "RefundAmount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
          {
              heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                  {
                      action: gridActions.edit, callback: (data: any) => {
                          this.onSave(data);
                      }
                  }, {
                      action: gridActions.delete, callback: (data: any) => {
                          this._CancellationService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                              this.toastr.success(response.message);
                              this.grid.bindGridData();
                          });
                      }
                  }]
          } //Action 1-view, 2-Edit,3-delete
      ],
      sortField: "ReportName",
      sortOrder: 0,
      filters: [
          { fieldName: "Date", fieldValue: "", opType: OperatorComparer.Contains },
          { fieldName: "RegistrationNo", fieldValue: "", opType: OperatorComparer.Contains },
          { fieldName: "FirstName", fieldValue: "", opType: OperatorComparer.Equals },
          { fieldName: "LastName", fieldValue: "", opType: OperatorComparer.Equals },
      ],
      row: 25
  }

    gridConfig2: gridModel = {
        apiUrl: "MReportConfig/List",
        columnsList: [
            { heading: "RefundDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UHIDNo", key: "uHIDNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName ", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RefundAmount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CancellationService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "ReportName",
        sortOrder: 0,
        filters: [
            { fieldName: "Date", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "RegistrationNo", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "FirstName", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "LastName", fieldValue: "", opType: OperatorComparer.Equals },
        ],
        row: 25
    }
     
    gridConfig3: gridModel = {
        apiUrl: "MReportConfig/List",
        columnsList: [
            { heading: "RefundDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UHIDNo", key: "uHIDNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName ", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AdvanceAmount", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AdvanceUsedAmt", key: "advanceUsedAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BalanceAmount", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RefundAmount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA'},
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CancellationService.deactivateTheStatus(data.storeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "ReportName",
        sortOrder: 0,
        filters: [
            { fieldName: "Date", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "RegistrationNo", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "FirstName", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "LastName", fieldValue: "", opType: OperatorComparer.Equals },
        ],
        row: 25
    }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        // const dialogRef = this._matDialog.open( NewcreateUserComponent, 
        //     {
        //         maxHeight: '95vh',
        //         width: '90%',
        //         data: row
        //     });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         that.grid.bindGridData();
        //     }
        // });
    }
  

  sIsLoading: string = '';
  isLoading = true;

  dsCancellation = new MatTableDataSource<CancellationList>();
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 

  constructor(
    public _CancellationService:CancellationService,
    private _fuseSidebarService: FuseSidebarService, 
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public _IpBillBrowseListService: IPBrowseBillService,
    // public _BrowseOPDBillsService: BrowseOPBillService,
  ) { }

  ngOnInit(): void {
    this.getSearchList(); 
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
 
  getSearchList(){
    if(this._CancellationService.UserFormGroup.get('OP_IP_Type').value  == '1'){
      this.getIpdBillList();
    }else{
      this.getOPDBillsList();
    }
  }
  resultsLength = 0;
  getOPDBillsList() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name":  this._CancellationService.UserFormGroup.get('FirstName').value || '%',
      "L_Name": this._CancellationService.UserFormGroup.get('LastName').value || '%',
      "From_Dt": this.datePipe.transform(this._CancellationService.UserFormGroup.get('startdate').value, "MM-dd-yyyy") || '01/01/1900',
      "To_Dt ": this.datePipe.transform(this._CancellationService.UserFormGroup.get('enddate').value, "MM-dd-yyyy") || '01/01/1900',
      "Reg_No": this._CancellationService.UserFormGroup.get('RegNo').value || 0,
      "PBillNo": this._CancellationService.UserFormGroup.get('PBillNo').value + '%' || "%",
      "Start":(this.paginator?.pageIndex??0),
      "Length":(this.paginator?.pageSize??35) 
    }
    this._CancellationService.getOPDBillsList(D_data).subscribe(Visit => { 
      this.dsCancellation.data = Visit as CancellationList[];
      console.log(this.dsCancellation.data);
      this.dsCancellation.data = Visit["Table1"] ?? [] as CancellationList[];
      console.log(this.dsCancellation.data)
      this.resultsLength = Visit["Table"][0]["total_row"];
      this.sIsLoading = this.dsCancellation.data.length == 0 ? 'no-data' : '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  
  getIpdBillList() { 
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name":  this._CancellationService.UserFormGroup.get('FirstName').value || '%',
      "L_Name": this._CancellationService.UserFormGroup.get('LastName').value || '%',
      "From_Dt": this.datePipe.transform(this._CancellationService.UserFormGroup.get('startdate').value, "MM-dd-yyyy") || '01/01/1900',
      "To_Dt ": this.datePipe.transform(this._CancellationService.UserFormGroup.get('enddate').value, "MM-dd-yyyy") || '01/01/1900',
      "Reg_No": this._CancellationService.UserFormGroup.get('RegNo').value || 0,
      "PBillNo": this._CancellationService.UserFormGroup.get('PBillNo').value + '%' || "%",
      "Start":(this.paginator?.pageIndex??0),
      "Length":(this.paginator?.pageSize??35) 
    }
    console.log(D_data);
    this._CancellationService.getIpBillList(D_data).subscribe(Visit => {
      this.dsCancellation.data = Visit as CancellationList[]; 
      console.log(this.dsCancellation.data)
      this.dsCancellation.data = Visit["Table1"] ?? [] as CancellationList[];
      console.log(this.dsCancellation.data)
      this.resultsLength = Visit["Table"][0]["total_row"];
      this.sIsLoading = this.dsCancellation.data.length == 0 ? 'no-data' : ''; 
    },
      error => {
        this.sIsLoading = '';
      });
  }
  
 
 
  isLoading123:boolean=false;
  BillCancel(contact){ 
    Swal.fire({
      title: 'Do you want to cancel the Final Bill ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!" 
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {  
        this.isLoading123 = true;
        let billCancellationParamObj = {};
        billCancellationParamObj['oP_IP_type'] = contact.OPD_IPD_Type;
        billCancellationParamObj['billNo'] = contact.BillNo || 0;

        let SubmitDate ={
          "billCancellationParam":billCancellationParamObj
        }
        this._CancellationService.SaveCancelBill(SubmitDate).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Bill Cancel Successfully !', 'success').then((result) => {
              if (result.isConfirmed) { 
                this.getSearchList(); 
                this.isLoading123 = false;
              }
            });
          } else {
            Swal.fire('Error !', 'Discharge  not saved', 'error');
            this.isLoading123 = false;
          } 
          this.isLoading123 = false;
        });  
      }else{
        this.getSearchList(); 
      }
    })
  }
  getRecord(contact, m): void {
    if(this._CancellationService.UserFormGroup.get('OP_IP_Type').value  == '1'){
      if (!contact.InterimOrFinal){
        this.viewgetBillReportPdf(contact.BillNo)
      } else{
        this.viewgetInterimBillReportPdf(contact.BillNo)
      }
    }else{
      this.viewgetOPBillReportPdf(contact)
    }  
  }
  Billdateupdate(contact) { 
    this.isLoading123 = true;
    const dialogRef = this._matDialog.open(BillDateUpdateComponent,
      {
        height: "35%",
        width: '35%',
        data: {
          obj:contact.BillNo
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getSearchList();
      this.isLoading123 = false;
    });
  }

  viewgetBillReportPdf(BillNo) { 
    setTimeout(() => {
      // this.SpinLoading =true;  
      this._IpBillBrowseListService.getIpFinalBillReceipt(
        BillNo
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Bill  Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          // this.SpinLoading = false; 
        });
      });

    }, 100);
  }
  viewgetInterimBillReportPdf(BillNo) {
    setTimeout(() => {
      this._IpBillBrowseListService.getIpInterimBillReceipt(
        BillNo
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Interim Bill  Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
        });
      });

    }, 100);
  }
  viewgetOPBillReportPdf(contact) { 
    setTimeout(() => {
      // this.SpinLoading =true; 
      // this._BrowseOPDBillsService.getOpBillReceipt(
      //   contact.BillNo
      // ).subscribe(res => {
      //   const matDialog = this._matDialog.open(PdfviewerComponent,
      //     {
      //       maxWidth: "85vw",
      //       height: '750px',
      //       width: '100%',
      //       data: {
      //         base64: res["base64"] as string,
      //         title: "OP BILL Viewer"
      //       }
      //     });
      //   matDialog.afterClosed().subscribe(result => {  
      //   });
      // });

    }, 100);
  }
 
}
export class CancellationList{
  RegNo:any;
  PatientName:string;
  BillAmt:number;
  ConAmt: Number;
  NetpayableAmt: number;
  BillDate:number;
  PBillNo:number;

  constructor(PaymentPharmayList) {
    {
      this.RegNo = PaymentPharmayList.RegNo || 0;
      this.PatientName = PaymentPharmayList.PatientName || "";
      this.BillAmt = PaymentPharmayList.BillAmt || 0;
      this.ConAmt = PaymentPharmayList.ConAmt || 0;
      this.NetpayableAmt = PaymentPharmayList.NetpayableAmt || 0;
      this.BillDate = PaymentPharmayList.BillDate || 0;
      this.PBillNo = PaymentPharmayList.PBillNo || 0;   
    }
  }
}
