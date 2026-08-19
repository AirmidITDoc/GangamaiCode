import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { NewTallyInterfaceService } from './new-tally-interface.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-tally-inerface',
  templateUrl: './new-tally-inerface.component.html',
  styleUrls: ['./new-tally-inerface.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewTallyInerfaceComponent {

  myFilteropcashcounerform: FormGroup;

  myFilterIpBillform: FormGroup;
  myFilterIpAdvform: FormGroup;

  myFiltersalesform: FormGroup;


  hasSelectedContacts: boolean;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  
  modeOPbill: string = '';
  modeOPbillrefund: string = '';

  modeIPPay: string = '';
  modeIPBillPatientwise: string = '';
  modeIPbilldetail: string = '';
  modeIpbillrefund: string = '';
  modeSalesPaydetail: string = '';
  modeSalesdetail: string = '';
  modeSalesreturn: string = '';
  modeIPadv: string = '';
  modeAdvrefund: string = '';


  constructor(public _tallyService: NewTallyInterfaceService, public _matDialog: MatDialog,
    public toastr: ToastrService, public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _ConfigService: ConfigService,
    public _accountService: AuthenticationService, public permissionService: PagePermissionService,
    public _whatsppService: WhatsAppEmailService,
    private overlay: Overlay
  ) {
    // this.fromDate = "2026-01-01"
    // this.toDate = "2026-08-01"
  }
  filtersop: any
  filtersIP: any
  filtersAdv: any
  filterssales: any

  ngOnInit(): void {

    this.myFilteropcashcounerform = this._tallyService.myFilterOpcashcounerform();

    this.myFilterIpBillform = this._tallyService.myFilterrIPBillform();
    this.myFilterIpAdvform = this._tallyService.myFilterIPAdvanceform();

    this.myFiltersalesform = this._tallyService.myFiltersalesform();
    this.onChangeOpBill()
    this.onChangeOPBillRefund()

    this.onChangeIPBill()
    this.onChangeIPBillPatientwise()
    this.onChangeIPBillDetail()
    this.onChangeIPBillRefundPay()
    this.onChangeAdvanceRefund()
    this.onChangeIPAdvancePay()

    this.onChangePhSalesPayDetail()
    this.onChangePhSalesDetail()
    this.onChangePhSalesreurn()
  }



  //OP
  onChangeOpBill() {
    debugger
    this.fromDate = this.datePipe.transform(this.myFilteropcashcounerform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilteropcashcounerform.get('enddate').value, "yyyy-MM-dd")
    this.filtersop = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeOPbill = "OPPayment";
  }
  onChangeOPBillRefund() {
    debugger
    // this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    // this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.filtersop = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeOPbillrefund = "OPBillRefundPayment";
  }
  onChangeIPBill() {
    debugger
    // this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    // this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.filtersIP = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeIPPay = "IPBillPayment";
  }
  // IP?
  onChangeIPBillPatientwise() {
    debugger
    // this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    // this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.filtersIP = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeIPBillPatientwise = "IPBillPayment";
  }

  onChangeIPBillDetail() {
    debugger
    // this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    // this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.filtersIP = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeIPbilldetail = "IPBillDetailList";
  }
  onChangeIPBillRefundPay() {
    debugger
    // this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    // this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.filtersIP = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeIpbillrefund = "IPBillRefundPayment";
  }
  //IP Advance

  onChangeIPAdvancePay() {
    debugger
    // this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    // this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.filtersAdv = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeIPadv = "IPAdvancePayment";
  }
  onChangeAdvanceRefund() {
    debugger
    // this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    // this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.filtersAdv = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeAdvrefund = "IPAdvanceRefundPayment";
  }
  //Sales
  onChangePhSalesPayDetail() {
    debugger
    // this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    // this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.filterssales = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeSalesPaydetail = "OPIPSalsePayment";
  }
  onChangePhSalesDetail() {
    debugger
    // this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    // this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.filterssales = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeSalesdetail = "OPIPSalesDetailList";
  }

  onChangePhSalesreurn() {
    debugger
    // this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    // this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.filterssales = [
      {
        fieldName: "Fromdate",
        fieldValue: this.fromDate,
        opType: "Equals"
      },
      {
        fieldName: "Todate",
        fieldValue: this.toDate,
        opType: "Equals"
      }
    ];

    this.modeSalesreturn = "OPIPSalesReturnBillDetailList";
  }
  onChangeDateOP() {
    this.fromDate = this.datePipe.transform(this.myFilteropcashcounerform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilteropcashcounerform.get('enddate').value, "yyyy-MM-dd")


    this.onChangeOpBill()
    this.onChangeOPBillRefund()
  }


  onChangeDateIP() {
    this.fromDate = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")
    this.onChangeIPBill()
    this.onChangeIPBillPatientwise()
    this.onChangeIPBillDetail()
    this.onChangeIPBillRefundPay()



  }

  onChangeDateAdv() {
    this.fromDate = this.datePipe.transform(this.myFilterIpAdvform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterIpAdvform.get('enddate').value, "yyyy-MM-dd")

    this.onChangeIPAdvancePay()
    this.onChangeAdvanceRefund()

  }

  onChangeDatesales() {
    this.fromDate = this.datePipe.transform(this.myFiltersalesform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFiltersalesform.get('enddate').value, "yyyy-MM-dd")

    this.onChangePhSalesPayDetail()
    this.onChangePhSalesDetail()
    this.onChangePhSalesreurn()
  }


}