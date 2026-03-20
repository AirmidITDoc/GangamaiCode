import { DatePipe } from '@angular/common';
import { Component, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ReplaySubject, Subject } from 'rxjs';
import { MrdService } from '../mrd.service';
import { NewCertificateComponent } from './new-certificate/new-certificate.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CertificateComponent implements OnInit {
  myFilterform: FormGroup;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    mobileno: any = "%"
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    photo: PageNames=PageNames.PATIENT_PHOTO;
    signature: PageNames=PageNames.PATIENT_SIGNATURE;
    
    constructor(
        public _MrdService: MrdService,
        public _matDialog: MatDialog,
        private commonService: PrintserviceService,
        public toastr: ToastrService, public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.myFilterform = this._MrdService.filterForm();
    }

    onChangeStartDate(value) {
        this.gridConfig.filters[2].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[3].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    allcolumns = [
        { heading: "AdmissionDate", key: "admissionDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 130 },
        { heading: "DischargeDate", key: "dischargeDate", sort: true, align: 'left', emptySign: 'NA', type: 7 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Age", key: "ageYear", sort: true, align: 'left', emptySign: 'NA', width: 50 },
        { heading: "Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Adddress", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Annual Income", key: "annualIncome", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA',width:150},
        { heading: "TotalAmt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "ConcessionAmt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "NetPayableAmt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA',width:150 },
        { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', },
        // { heading: "Created Date", key: "createdDate",  sort: true, align: 'left', emptySign: 'NA', type: 8 ,width:170},
        // { heading: "Updated By", key: "updatedBy", sort: true, align: 'left', emptySign: 'NA', },
        // { heading: "Modify Date", key: "modifiedDate",  sort: true, align: 'left', emptySign: 'NA', type: 8 ,width:170},
        {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }

        // {
        //     heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.action, actions: [
        //         {action: gridActions.edit, callback: (data: any) => {
        //                 this.onEdit(data);
        //                 this.grid.bindGridData();
        //             }},]
        // }
    ];

    gridConfig: gridModel = {
        apiUrl: "MRD/MRDList",
        columnsList: this.allcolumns,
        sortField: "RegId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
           
        ]
    }

    OnNew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button 
        const that = this;
        const dialogRef = this._matDialog.open(NewCertificateComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data:row

            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }

    capturedImage = '';
     onPhotoCaptured(photoBase64: string) {
        if (photoBase64) {
            this.capturedImage = photoBase64;
            // Save or display
        }
    }

    OnPrint(Param) {
        // this.commonService.Onprint("RegId", Param.regId, "RegistrationForm");
    }
    onNew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        const that = this;
        const dialogRef = this._matDialog.open(NewCertificateComponent,
            {
                maxWidth: "95vw",
                maxHeight: '90%',
                width: '90%',

            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.grid.bindGridData();
            }
        });
    }


   
    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
       this.getfilterdata();
    }

    getfilterdata() {
        this.gridConfig = {
            apiUrl: "OutPatient/RegistrationList",
            columnsList: this.allcolumns,
            sortField: "RegId",
            sortOrder: 0,
            filters: [
                 { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
           
            ],
            row: 25
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }
    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")
       
        this.onChangeFirst();
    }

    getValidationMessages() {
        return {
            FirstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            LastName: [
                { name: "pattern", Message: "only char allowed." }
            ]
        }
    }

    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

}





export class CharityPatientdetail {
  RegNo: any;
  IPDNo: any;
  PatientName: string;
  Address: any;
  GenderName: any;
  AgeYear: any;
  DepartmentName: any;
  AdmissionDate: any;
  Ischarity:any;
  PaidAmount:any;
  TotalAmt:any;
  ConcessionAmt:any;
  NetPayableAmt:any;
  PBillNo:any ;
  ConcessionReason: any;
  AnnualIncome: any;
  RationCardNo: any;
  IsIndientOrWeaker: any;

  BillNo: any;

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(CharityPatientdetail) {
    {
     
      this.RegNo = CharityPatientdetail. RegNo || '';
      this.PatientName = CharityPatientdetail.PatientName || '';
      this.IPDNo = CharityPatientdetail.IPDNo || 0;
      this.Address = CharityPatientdetail.Address || '';
      this.GenderName = CharityPatientdetail.GenderName || '';
      this.AgeYear = CharityPatientdetail.AgeYear || '';
      this.DepartmentName = CharityPatientdetail.DepartmentName || 0;
      this.AdmissionDate = CharityPatientdetail.AdmissionDate || '';
      this.Ischarity = CharityPatientdetail.Ischarity || '';
      this.PaidAmount = CharityPatientdetail.PaidAmount || '';
      this.TotalAmt = CharityPatientdetail.TotalAmt || '';
      this.ConcessionAmt = CharityPatientdetail.ConcessionAmt || '';
      this.NetPayableAmt = CharityPatientdetail.NetPayableAmt || '';
      this.PBillNo = CharityPatientdetail.PBillNo || '';
      this.ConcessionReason = CharityPatientdetail.ConcessionReason || '';
      this.AnnualIncome = CharityPatientdetail.AnnualIncome || '';
      this. RationCardNo = CharityPatientdetail. RationCardNo || '';
      this.IsIndientOrWeaker = CharityPatientdetail.IsIndientOrWeaker || '';
      this.BillNo = CharityPatientdetail.BillNo || '';
     
    }
  }
}
