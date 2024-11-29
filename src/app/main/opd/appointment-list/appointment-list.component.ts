import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from './appointmentlist.service';
import { EditRefranceDoctorComponent } from './edit-refrance-doctor/edit-refrance-doctor.component';
import { EditConsultantDoctorComponent } from './edit-consultant-doctor/edit-consultant-doctor.component';
import { CrossConsultationComponent } from './cross-consultation/cross-consultation.component';
import { fuseAnimations } from '@fuse/animations';
import { DischargeComponent } from 'app/main/ipd/ip-search-list/discharge/discharge.component';
import { BedTransferComponent } from 'app/main/ipd/ip-search-list/bed-transfer/bed-transfer.component';
import { NewOPBillingComponent } from '../OPBilling/new-opbilling/new-opbilling.component';
import { NewRegistrationComponent } from '../registration/new-registration/new-registration.component';
import { DatePipe } from '@angular/common';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';


@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AppointmentListComponent implements OnInit {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    fromDate= this.datePipe.transform(new Date(), "dd/MM/yyyy")
    toDate=this.datePipe.transform(new Date(), "dd/MM/yyyy")
    gridConfig: gridModel = {
        apiUrl: "VisitDetail/AppVisitList",
        columnsList: [
            { heading: "Code", key: "visitId", sort: true, align: 'left', emptySign: 'NA' ,width:50},
            { heading: "visitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA' ,width:170,type:8},
            { heading: "RegId", key: "regId", sort: true, align: 'left', emptySign: 'NA' ,width:30},
            { heading: "PrefixId", key: "prefixId", sort: true, align: 'left', emptySign: 'NA' ,width:30},
            { heading: "FirstName", key: "firstName", sort: true, align: 'left', emptySign: 'NA' ,width:80 },
            { heading: "MiddleName", key: "middleName", sort: true, align: 'left', emptySign: 'NA' ,width:80 },
            { heading: "LastName", key: "lastName", sort: true, align: 'left', emptySign: 'NA' ,width:80 },
            { heading: "DateofBirth", key: "dateofBirth", sort: true, align: 'left', emptySign: 'NA' ,width:100,type:6},
            { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA' ,width:200,type:10},
            { heading: "MaritalStatusId", key: "maritalStatusId", sort: true, align: 'left', emptySign: 'NA' ,width:30},
            { heading: "PatientTypeId", key: "patientTypeId", sort: true, align: 'left', emptySign: 'NA' ,width:30},
            { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA' ,width:50 },
            { heading: "OpdNo", key: "opdNo", sort: true, align: 'left', emptySign: 'NA' ,width:30},
            { heading: "TariffId", key: "tariffId", sort: true, align: 'left', emptySign: 'NA' ,width:30},
            { heading: "TariffName", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' ,width:80},
            { heading: "DepartmentId", key: "departmentId", sort: true, align: 'left', emptySign: 'NA' ,width:30},
            { heading: "AppPurposeId", key: "appPurposeId", sort: true, align: 'left', emptySign: 'NA' ,width:50},
            { heading: "CompanyId", key: "companyId", sort: true, align: 'left', emptySign: 'NA' ,width:30 },
            { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' ,width:100},
           
            {
                heading: "Action", key: "action", align: "right",width:300,type: gridColumnTypes.action, actions: [
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
                        action: gridActions.edit, callback: (data: any) => {
                            this.Editcrossconsult(data);
                        }
                    },
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.EditBedtransfer();
                        }
                    },
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.viewgetPatientAppointmentReportPdf(data);
                        }
                    },
                    {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._AppointmentlistService.deactivateTheStatus(data.visitId).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "VisitId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
            // { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: "11/11/2023", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: "11/01/2024", opType: OperatorComparer.Equals },
            { fieldName: "IsMark", fieldValue: "1", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "1", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
           // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _AppointmentlistService: AppointmentlistService, public _matDialog: MatDialog,
        public toastr : ToastrService, public datePipe: DatePipe) {}

        onChangeDate(selectDate){
            if (selectDate) {
                debugger
                this.fromDate= this.datePipe.transform(this.gridConfig.filters[4].fieldValue, "MM/dd/yyyy")
                console.log(this.fromDate);
                this.gridConfig.filters[4].fieldValue=this.fromDate
            }
        }
        onChangeDate1(selectDate){
            if (selectDate) {
             
                this.toDate= this.datePipe.transform(this.gridConfig.filters[5].fieldValue, "MM/dd/yyyy")
                console.log(this.toDate);
                this.gridConfig.filters[5].fieldValue=this.toDate
            }
        }

    ngOnInit(): void {
      
    }
    onSave(row: any = null) {
        debugger
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
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "95vw",
                height: '65%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }


    EditConsultdr(row){
        debugger
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

    Editrefrancedr(row){
        debugger
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

    Editcrossconsult(row){
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(CrossConsultationComponent,
            {
                maxWidth: "65vw",
                height: '60%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    EditBedtransfer(){
        debugger
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

    EditDischarge(){
        debugger
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

    EditOpBill(){
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewOPBillingComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '80%',
                // data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    
    viewgetPatientAppointmentReportPdf(obj) {
      var data=  {
        //     "searchFields": [
        //       {
        //         "fieldName": "FromDate",
        //         "fieldValue": "11-11-2023",
        //         "opType": "13"
        //       },
        //    {
        //         "fieldName": "ToDate",
        //         "fieldValue": "11-15-2023",
        //         "opType": "13"
        //       }
        //     ],
        //     "mode": "Registrationreport"
        //   }

      
          searchFields: [
                { fieldName: "FromDate", fieldValue: "11/11/2023", opType: OperatorComparer.Equals },
              { fieldName: "ToDate", fieldValue: "11/01/2024", opType: OperatorComparer.Equals },
            
          ],
        "mode": "Registrationreport"
        }
console.log(data)
        setTimeout(() => {
            
            this._AppointmentlistService.getAppointmenttemplateReport(data
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
        // this.chkprint = false;

    }
}