import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PaymentmodechangesService } from './paymentmodechanges.service';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditPaymentmodeComponent } from '../paymentmodechangesfor-pharmacy/edit-paymentmode/edit-paymentmode.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DateUpdateComponent } from './date-update/date-update.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-paymentmodechanges',
  templateUrl: './paymentmodechanges.component.html',
  styleUrls: ['./paymentmodechanges.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PaymentmodechangesComponent implements OnInit {
  
  gridConfig: any;

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  ngAfterViewInit() {
          this.gridConfigOP.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateOP;  
          this.gridConfigOP.columnsList.find(col => col.key === 'label')!.template = this.ColorCodeOP; 

          this.gridConfigIP.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIP;  
          this.gridConfigIP.columnsList.find(col => col.key === 'label')!.template = this.ColorCodeIp; 
          
          this.gridConfigIPAdv.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIPAdv;  
          this.gridConfigIPAdv.columnsList.find(col => col.key === 'label')!.template = this.ColorCodeIPAdv; 
      }
      @ViewChild('actionButtonTemplateIP') actionButtonTemplateOP!: TemplateRef<any>;
      @ViewChild('ColorCodeIp') ColorCodeIp!: TemplateRef<any>;

      @ViewChild('actionButtonTemplateOP') actionButtonTemplateIP!: TemplateRef<any>;
      @ViewChild('ColorCodeOP') ColorCodeOP!: TemplateRef<any>;

      
      @ViewChild('actionButtonTemplateIPAdv') actionButtonTemplateIPAdv!: TemplateRef<any>;
      @ViewChild('ColorCodeIPAdv') ColorCodeIPAdv!: TemplateRef<any>;

    gridConfigOP: gridModel = {
        apiUrl: "paymentpharmacy/OPDPaymentReceiptList ",
        columnsList: [
          { heading: "-", key: "label", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "PayDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 200,type: 9 },
            { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UHIDNo ", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width:200 },
            { heading: "BillAmt", key: "billAmt", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CashAmount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ChequeAmount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "CardAmount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "NEFTPay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PayATM", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
            {
              heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
              template: this.actionButtonTemplateOP  // Assign ng-template to the column
          }
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
          { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
          { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
          { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
          { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
          { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals },
        ],
        row: 10
    }

    // IP Receipt

    gridConfigIP: gridModel = {
      apiUrl: "paymentpharmacy/IPDPaymentReceiptList",
      columnsList: [
        { heading: "-", key: "label", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
          { heading: "PayDate", key: "payDate", sort: true, align: 'left', emptySign: 'NA', width:200, type:9 },
          { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "UHIDNo ", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width:200},
          { heading: "BillAmt", key: "billAmt", sort: true, align: 'left', emptySign: 'NA'},
          { heading: "PaidAmount", key: "paidamount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "CashAmount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "ChequeAmount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA'},
          { heading: "CardAmount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "NEFTPay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "PayATM", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
          {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplateIP  // Assign ng-template to the column
        }
      ],
      sortField: "PaymentId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "52", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "1", opType: OperatorComparer.Equals },
        { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals },
      ],
      row: 25
  }

  // IP Advance

  gridConfigIPAdv: gridModel = {
    apiUrl: "paymentpharmacy/IPAdvPaymentReceiptList",
    columnsList: [
      { heading: "-", key: "label", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "PayDate", key: "payDate", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UHIDNo ", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width:200 },
        { heading: "BillAmt", key: "billAmt", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "CashAmount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ChequeAmount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "CardAmount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "NEFTPay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PayATM", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
        {
          heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
          template: this.actionButtonTemplateIPAdv  // Assign ng-template to the column
      } //Action 1-view, 2-Edit,3-delete
    ],
    sortField: "PaymentId",
    sortOrder: 0,
    filters: [
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals },
    ],
    row: 25
}
 
  sIsLoading: string = '';
  isLoading = true;

 dsPaymentChanges = new MatTableDataSource<PaymentChange>();
 
 @ViewChild(MatSort) sort: MatSort;
 @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _PaymentmodechangesService:PaymentmodechangesService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    // this.getsearchList(); 

    this.gridConfig = this.gridConfigOP;

    this._PaymentmodechangesService.UseFormGroup.get('Radio')?.valueChanges.subscribe((value) => {
      if (value === '0') {
        this.gridConfig = this.gridConfigOP;
      } else if (value === '1') {
        this.gridConfig = this.gridConfigIP;
      } else if (value === '2') {
        this.gridConfig = this.gridConfigIPAdv;
      }
    });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
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

 onEdit(row) {
  console.log(row)
  const dialogRef = this._matDialog.open(EditPaymentmodeComponent,
    { 
      height: "85%",
      width: '75%',
      data: {
        registerObj: row,
        FromName: "IP-PaymentModeChange"
      },
      
    });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed - Insert Action', result);
    // if(this._PaymentmodechangesService.UseFormGroup.get('Radio').value == '0')
      // this.getOPReceiptList();
    // else if(this._PaymentmodechangesService.UseFormGroup.get('Radio').value == '1')
      // this.getIPReceiptList();
    // else 
      // this.getIPAdvanceList(); 
  });  
}
PaymentDate(contact){ 
  console.log(contact)
    const dialogRef = this._matDialog.open(DateUpdateComponent,
      { 
        maxHeight: "35vh",
        maxWidth: '90vh',
        // height: "35%",
        width: '100%',
        data: { 
          obj:contact.PaymentId 
        }, 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result); 
    //  if(this._PaymentmodechangesService.UseFormGroup.get('Radio').value == '0')
    //   this.getOPReceiptList();
    // else if(this._PaymentmodechangesService.UseFormGroup.get('Radio').value == '1')
    //   this.getIPReceiptList();
    // else 
    //   this.getIPAdvanceList();
    });   
}
         


}
export class PaymentChange{
  PayDate:any;
  BillNo:any ;
  RegNo:number;
  PatientName:string;
  BillAmt:any;
  PaidAmt:any ;
  CashAmt:number;
  ChequeAmt:any ;
  CardAmt:number;
  User:any;

 constructor(PaymentChange){
  {
    this.PayDate = PaymentChange.PayDate || 0;
      this.BillNo = PaymentChange.BillNo || 0;
      this.RegNo = PaymentChange.RegNo || 0;
      this.PatientName = PaymentChange.PatientName || "";
      this.BillAmt = PaymentChange.BillAmt || 0;
      this.PaidAmt = PaymentChange.PaidAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.CardAmt = PaymentChange.CardAmt || 0;
      this.User = PaymentChange.User || '';
  }
 }

}
