import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from './appointmentlist.service';
import { EditConsultantDoctorComponent } from './edit-consultant-doctor/edit-consultant-doctor.component';
import { CrossConsultationComponent } from './cross-consultation/cross-consultation.component';
import { fuseAnimations } from '@fuse/animations';
import { DischargeComponent } from 'app/main/ipd/ip-search-list/discharge/discharge.component';
import { BedTransferComponent } from 'app/main/ipd/ip-search-list/bed-transfer/bed-transfer.component';
import { NewOPBillingComponent } from '../OPBilling/new-opbilling/new-opbilling.component';
import { NewRegistrationComponent } from '../registration/new-registration/new-registration.component';
import { DatePipe } from '@angular/common';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { VisitMaster } from '../appointment/appointment.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { EditRefraneDoctorComponent } from '../appointment/edit-refrane-doctor/edit-refrane-doctor.component';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawer } from '@angular/material/sidenav';
import { EditRefranceDoctorComponent } from './edit-refrance-doctor/edit-refrance-doctor.component';
import Swal from 'sweetalert2';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { OPBillingComponent } from '../op-search-list/op-billing/op-billing.component';
import { AirmidTable1Component } from 'app/main/shared/componets/airmid-table1/airmid-table1.component';
// const moment = _rollupMoment || _moment;

@Component({
    selector: 'app-appointment-list',
    templateUrl: './appointment-list.component.html',
    styleUrls: ['./appointment-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class AppointmentListComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    myformSearch:FormGroup;
    @ViewChild(AirmidTableComponent) grid: AirmidTable1Component;

    nowdate = new Date();
    firstDay = new Date(this.nowdate.getFullYear(), this.nowdate.getMonth(), 1);
  
    fromDate ="2022-01-01"// this.datePipe.transform(this.firstDay, 'dd/MM/yyyy');
    toDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    
    DoctorId="0";
    autocompleteModedeptdoc: string = "ConDoctor";
  
    doctorID = "0";
    
    allfilters= [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue:this.DoctorId, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsMark", fieldValue: "2", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
        
    ]
    gridConfig: gridModel = {
        apiUrl: "VisitDetail/AppVisitList",
        columnsList: [
            { heading: "Code", key: "visitId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientOldNew", key: "patientOldNew", sort: true, align: 'left', emptySign: 'NA', type:17},
            { heading: "BillGenerated", key: "mPbillNo", sort: true, align: 'left', emptySign: 'NA', type:15 },
            { heading: "PhoneAppId", key: "phoneAppId", sort: true, align: 'left', emptySign: 'NA', width: 100, type:13 },
            { heading: "visitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', width: 170, type:8 },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 10 },
            { heading: "PatientType", key: "patientTypeId", sort: true, align: 'left', emptySign: 'NA',  type: 22 },
            { heading: "OpdNo", key: "opdNo", sort: true, align: 'left', emptySign: 'NA',  },
            { heading: "TariffName", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 80 },
            { heading: "DepartmentId", key: "departmentId", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "CrossConsulFlag", key: "crossConsulFlag", sort: true, align: 'left', emptySign: 'NA', width: 100, type:14 },
            { heading: "DoctorId", key: "doctorId", sort: true, align: 'left', emptySign: 'NA', width: 100 },

            {
                heading: "Action", key: "action", align: "right", width: 400 ,sticky:true, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onRegistrationEdit(data);
                        }
                    },
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.EditConsultdr(data);
                        }
                    },
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.Editrefrancedr(data);
                        }
                    },
                    {
                        action: gridActions.CossConsult, callback: (data: any) => {
                            this.Editcrossconsult(data);
                        }
                    },
                    {
                        action: gridActions.OPBill, callback: (data: any) => {
                            this.EditOpBill(data);
                        }
                    },
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.getAppointmentlistrview();
                        }
                    },
                    {
                        action: gridActions.delete, callback: (data: any) => {

                            this.AppointmentCancle(data);

                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],

        sortField: "VisitId",
        sortOrder: 0,
        filters:this.allfilters
        //  [
        //     { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        //     { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        //     { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        //     { fieldName: "Doctor_Id", fieldValue:this.DoctorId, opType: OperatorComparer.Equals },
        //     { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        //     { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        //     { fieldName: "IsMark", fieldValue: "2", opType: OperatorComparer.Equals },
        //     { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        //     { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
        //     { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        // ]
        ,
        row: 25
        
    }

    constructor(public _AppointmentlistService: AppointmentlistService, public _matDialog: MatDialog,
        public toastr: ToastrService, public datePipe: DatePipe) {
           
         }

    onChangeDate(selectDate) {
        if (selectDate) {
            
            // this.gridConfig.filters[4].fieldValue =this.datePipe.transform(selectDate, "dd-MM-yyyy")// this.fromDate
            this.fromDate=this.datePipe.transform(selectDate, "dd-MM-yyyy")
            debugger
            this.gridConfig.filters = [ { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
                { fieldName: "Doctor_Id", fieldValue:this.DoctorId, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsMark", fieldValue: "2", opType: OperatorComparer.Equals },
                { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
                { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }]
        }
        // this.getVisitList();
    }
    onChangeDate1(selectDate) {
        if (selectDate) {

            this.toDate = this.datePipe.transform(selectDate, "dd-MM-yyyy")
            console.log(this.toDate);
            // this.gridConfig.filters[5].fieldValue = this.toDate
            
            this.gridConfig.filters = [ { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
                { fieldName: "Doctor_Id", fieldValue:this.DoctorId, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsMark", fieldValue: "2", opType: OperatorComparer.Equals },
                { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
                { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }]
        }
        // this.getVisitList();
    }

    ngOnInit(): void {
       
        this.myformSearch=this._AppointmentlistService.filterForm();
        this.getVisitList();
           console.log(this.gridConfig)
    }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewAppointmentComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }



    onRegistrationEdit(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "95vw",
                height: '75%',
                width: '90%',
                data: {
                    data1: row,
                    Submitflag: true
                },
                
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    fname = "%"
    lname = "%"
    fromdate = "11/11/2022"
    todate = "11/11/2024"
    RegNo = "0"
    
    resultsLength = 0;
    dataSource = new MatTableDataSource<VisitMaster>();
    getVisitList() {

        // this.fname=this.myFilterform.get("FirstName").value
        // this.lname=this.myFilterform.get("LastName").value
        this.fromdate = this.gridConfig.filters[4].fieldValue,//this.myFilterform.get("startdate").value
        this.todate = this.gridConfig.filters[5].fieldValue//this.myFilterform.get("enddate").value
        // this.RegNo=this.myFilterform.get("RegNo").value
        // this.DoctorId=this.myFilterform.get("DoctorId").value
        console.log(this.fromdate)
        this.fromDate = this.datePipe.transform(this.fromdate, "MM/dd/yyyy")
        console.log(this.fromdate)

        var m_data = {
            "first": 0,
            "rows": 25,
            sortField: "VisitId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: this.RegNo, opType: OperatorComparer.Equals },
                { fieldName: "Doctor_Id", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: '01/01/2024', opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: '12/25/2024', opType: OperatorComparer.Equals },
                { fieldName: "IsMark", fieldValue: "1", opType: OperatorComparer.Equals },
                { fieldName: "Start", fieldValue: "1", opType: OperatorComparer.Equals },
                { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals },

            ],
            "exportType": "JSON"

        }

        console.log(m_data);
        this._AppointmentlistService.getAppointmentList(m_data).subscribe(Visit => {
            this.dataSource.data = Visit.data as VisitMaster[];
            console.log(Visit);
            if (this.dataSource.data.length > 0) {
                this.Appointdetail(this.dataSource.data);
                this.resultsLength = this.dataSource.data.length;
            }

        },
            error => {

            });
           
}


getAppointmentlistrview() { 

    setTimeout(() => {

let param={
      
        "searchFields": [
              {
                "fieldName": "FromDate",
                "fieldValue": this.fromDate,
                "opType": "13"
              },
          {
                "fieldName": "ToDate",
                "fieldValue": this.toDate,
                "opType": "13"
              }
            ],
            "mode": "AppointmentListReport"
          }
    
          console.log(param)
      this._AppointmentlistService.getPatientListView(param).subscribe(res => {
        console.log(res)
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,  
              title: "Appointment List  Viewer"
          
            }
            
          });

        matDialog.afterClosed().subscribe(result => {
        
        });
      });

    }, 100);
    }
    Vtotalcount = 0;
    VNewcount = 0;
    VFollowupcount = 0;
    VBillcount = 0;
    VCrossConscount = 0;


    Appointdetail(data) {
        debugger
        this.Vtotalcount = 0;
        this.VNewcount = 0;
        this.VFollowupcount = 0;
        this.VBillcount = 0;
        this.VCrossConscount = 0;
        console.log(data)
        this.Vtotalcount;

        for (var i = 0; i < data.length; i++) {
            if (data[i].patientOldNew== 1) {
                this.VNewcount = this.VNewcount + 1;
            }
            else if (data[i].patientOldNew == 2) {
                this.VFollowupcount = this.VFollowupcount + 1;
            }
            if (data[i].mPbillNo == 1 || data[i].mPbillNo == 2) {
                this.VBillcount = this.VBillcount + 1;
            }
            if (data[i].crossConsulFlag == 1) {
                this.VCrossConscount = this.VCrossConscount + 1;
            }

            this.Vtotalcount = this.Vtotalcount + 1;
        }

    }
    EditConsultdr(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(EditConsultantDoctorComponent,
            {
                maxWidth: "55vw",
                height: '55%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    Editrefrancedr(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(EditRefranceDoctorComponent,
            {
                maxWidth: "55vw",
                height: '55%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    Editcrossconsult(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(CrossConsultationComponent,
            {
                maxWidth: "65vw",
                height: '70%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    EditBedtransfer() {

        let that = this;
        const dialogRef = this._matDialog.open(BedTransferComponent,
            {
                maxWidth: "65vw",
                height: '45%',
                width: '80%',
                // data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    EditDischarge() {

        let that = this;
        const dialogRef = this._matDialog.open(DischargeComponent,
            {
                maxWidth: "75vw",
                height: '45%',
                width: '80%',
                // data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    EditOpBill(row) {

        let that = this;
        const dialogRef = this._matDialog.open(NewOPBillingComponent,
            {
                maxWidth: "99vw",
                height: '95%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
    AppointmentCancle(contact) {
        Swal.fire({
            title: 'Do you want to Cancle Appointment',
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'OK',

        }).then((flag) => {


            if (flag.isConfirmed) {
                // let appointmentcancle = {};
                // appointmentcancle['visitId'] = contact.VisitId;

                let submitData = {
                    "visitId": contact.visitId

                };
                console.log(submitData);
                this._AppointmentlistService.Appointmentcancle(submitData).subscribe(response => {
                    if (response) {
                        Swal.fire('Appointment cancelled !', 'Appointment cancelled Successfully!', 'success').then((result) => {

                        });
                        this.getVisitList();
                    } else {
                        Swal.fire('Error !', 'Appointment cancelled data not saved', 'error');
                    }

                });
            }
        });
        this.getVisitList();
    }


    getAppointmentrview() {
        // var data = {
          

        //     searchFields: [
        //         { fieldName: "FromDate", fieldValue: "11/11/2023", opType: OperatorComparer.Equals },
        //         { fieldName: "ToDate", fieldValue: "11/01/2024", opType: OperatorComparer.Equals },

        //     ],
        //     "mode": "Registrationreport"
        // }

        let param={
      
            "searchFields": [
                  {
                    "fieldName": "FromDate",
                    "fieldValue": "10-01-2024",
                    "opType": "13"
                  },
              {
                    "fieldName": "ToDate",
                    "fieldValue": "12-12-2024",
                    "opType": "13"
                  }
                ],
                "mode": "AppointmentListReport"
              }
        console.log(param)
        setTimeout(() => {

            this._AppointmentlistService.getAppointmenttemplateReport(param
            ).subscribe(res => {
                const dialogRef = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Appointment  Viewer"
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {

                });
            });

        }, 100);
       
    }
  
    selectChangedeptdoc(obj: any) {
        
        console.log(obj);
        this.DoctorId = String(obj)
        console.log(this.gridConfig.filters)
        this.gridConfig.filters = [ { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue:this.DoctorId, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsMark", fieldValue: "2", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }]
    }
    getValidationdoctorMessages() {
        return {
            DoctorId: [
                { name: "required", Message: "Doctor Name is required" }
            ]
        };
    }
    objICard = {};
    QrCode = "";
    printIcard(row) {

        this.objICard = row;
        this.QrCode = row.RegId.toString();
        setTimeout(() => {
            this.OnPrint();
        }, 100);
    }
    OnPrint() {

        const printContents = document.getElementById("i-card").innerHTML;
        const pageContent = `<!DOCTYPE html><html><head></head><body onload="window.print()">${printContents}</html>`;
        let popupWindow: Window;
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            popupWindow = window.open(
                '',
                '_blank',
                'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
            );
            popupWindow.window.focus();
            popupWindow.document.write(pageContent);
            popupWindow.document.close();
            popupWindow.onbeforeunload = event => {
                popupWindow.close();
            };
            popupWindow.onabort = event => {
                popupWindow.document.close();
                popupWindow.close();
            };
        } else {
            popupWindow = window.open('', '_blank', 'width=600,height=600');
            popupWindow.document.open();
            popupWindow.document.write(pageContent);
            popupWindow.document.close();
        }

    }

}


export class VisitMaster1 {
    visitId: Number;
    regId:number;
    visitDate: any;
    visitTime: any;
    unitId: number;
    patientTypeId: number;
    companyId: number;
    OPDNo: string;
    tariffId: number;
    consultantDocId: number;
    refDocId: number;
    departmentId: number;
    appPurposeId: number;
    patientOldNew: Boolean;
    phoneAppId: any;
    IsCancelled: any;
    classId: any;
    firstFollowupVisit:any;
    addedBy:any;
    updatedBy:any;
    /**
     * Constructor
     *
     * @param VisitMaster1
     */
    constructor(VisitMaster1) {
        {
            this.visitId = VisitMaster1.visitId || 0;
            this.regId= VisitMaster1.regId || 0;
            this.visitDate = VisitMaster1.visitDate || "";
            this.visitTime = VisitMaster1.visitTime || "";
            this.unitId = VisitMaster1.unitId || 1;
            this.patientTypeId = VisitMaster1.patientTypeId || 1;
            this.companyId = VisitMaster1.companyId || 1;
            this.tariffId = VisitMaster1.tariffId || 1;
            this.consultantDocId = VisitMaster1.consultantDocId || 1;
            this.refDocId = VisitMaster1.refDocId || 1;
            this.departmentId = VisitMaster1.departmentId || 1;
            this.patientOldNew = VisitMaster1.patientOldNew || 0;
            this.phoneAppId = VisitMaster1.phoneAppId || 0
            this.IsCancelled = VisitMaster1.IsCancelled || 0
            this.classId = VisitMaster1.classId || 1;
            this.firstFollowupVisit = VisitMaster1.firstFollowupVisit || "";
            this.addedBy = VisitMaster1.addedBy || 0
            this.updatedBy = VisitMaster1.updatedBy || 0;
        }
    }
  }


  export class Regdetail {
      RegId: Number;
      regId: Number;
      RegDate: Date;
      RegTime: Date;
      PrefixId: number;
      PrefixID: number;
      FirstName: string;
      MiddleName: string;
      LastName: string;
      firstName: string;
      middleName: string;
      lastName: string;
      
      Address: string;
      City: string;
      PinNo: string;
      RegNo: string;
      DateofBirth: Date;
      Age: any;
      GenderId: Number;
      PhoneNo: string;
      MobileNo: string;
      AddedBy: number;
      AgeYear: any;
      AgeMonth: any;
      AgeDay: any;
      CountryId: number;
      StateId: number;
      CityId: number;
      MaritalStatusId: number;
      IsCharity: Boolean;
      ReligionId: number;
      AreaId: number;
      VillageId: number;
      TalukaId: number;
      PatientWeight: number;
      AreaName: string;
      AadharCardNo: string;
      PanCardNo: string;
      currentDate = new Date();
      AdmissionID: any;
      VisitId: any;
      WardId: any;
      BedId: any;
      /**
       * Constructor
       *
       * @param RegInsert
       */
  
      constructor(RegInsert) {
          {
              this.RegId = RegInsert.RegId || 0;
              this.regId = RegInsert.regId || 0;
              this.RegDate = RegInsert.RegDate || "";
              this.RegTime = RegInsert.RegTime || "";
              this.PrefixId = RegInsert.PrefixId || "";
              this.PrefixID = RegInsert.PrefixID || "";
              this.FirstName = RegInsert.FirstName || "";
              this.MiddleName = RegInsert.MiddleName || "";
              this.LastName = RegInsert.LastName || "";
              this.firstName = RegInsert.firstName || "";
              this.middleName = RegInsert.middleName || "";
              this.lastName = RegInsert.lastName || "";
              this.Address = RegInsert.Address || "";
              this.City = RegInsert.City || "";
              this.PinNo = RegInsert.PinNo || "";
              this.DateofBirth = RegInsert.DateofBirth || this.currentDate;
              this.Age = RegInsert.Age || "";
              this.GenderId = RegInsert.GenderId || "";
              this.PhoneNo = RegInsert.PhoneNo || "";
              this.MobileNo = RegInsert.MobileNo || "";
              this.AddedBy = RegInsert.AddedBy || "";
              this.AgeYear = RegInsert.AgeYear || "";
              this.AgeMonth = RegInsert.AgeMonth || "";
              this.AgeDay = RegInsert.AgeDay || "";
              this.CountryId = RegInsert.CountryId || "";
              this.StateId = RegInsert.StateId || "";
              this.CityId = RegInsert.CityId || "";
              this.MaritalStatusId = RegInsert.MaritalStatusId || "";
              this.IsCharity = RegInsert.IsCharity || "";
              this.ReligionId = RegInsert.ReligionId || "";
              this.AreaId = RegInsert.AreaId || "";
              this.VillageId = RegInsert.VillageId || "";
              this.TalukaId = RegInsert.TalukaId || "";
              this.PatientWeight = RegInsert.PatientWeight || "";
              this.AreaName = RegInsert.AreaName || "";
              this.AadharCardNo = RegInsert.AadharCardNo || "";
              this.PanCardNo = RegInsert.PanCardNo || '';
              this.AdmissionID = RegInsert.AdmissionID || 0;
              this.VisitId = RegInsert.VisitId || 0;
              this.WardId = RegInsert.WardId || 0;
              this.BedId = RegInsert.BedId || 0;
          }
      }
  }