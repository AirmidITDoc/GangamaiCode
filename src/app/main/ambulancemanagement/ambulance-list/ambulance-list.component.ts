import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { AmbulanceListService } from './ambulance-list.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { NewAmbulanceDetailComponent } from './new-ambulance-detail/new-ambulance-detail.component';

@Component({
  selector: 'app-ambulance-list',
  templateUrl: './ambulance-list.component.html',
  styleUrls: ['./ambulance-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AmbulanceListComponent implements OnInit {

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
          public _MrdService: AmbulanceListService,
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
        //   { heading: "AdmissionDate", key: "admissionDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 130 },
        //   { heading: "DischargeDate", key: "dischargeDate", sort: true, align: 'left', emptySign: 'NA', type: 7 },
          { heading: "Vehical Number", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
          { heading: "Vehical Model", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
          { heading: "Year Made", key: "ageYear", sort: true, align: 'left', emptySign: 'NA', width: 100 },
          { heading: "Driver Name", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width: 150  },
          { heading: "Driver Licence No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 150  },
          { heading: "Driver Contact", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 100 },
          { heading: "Note", key: "annualIncome", sort: true, align: 'left', emptySign: 'NA',  width: 150 },
          { heading: "Vehical Type ", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA',width:150},
          { heading: "Company Name", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', width: 150  },
        //   { heading: "ConcessionAmt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', },
        //   { heading: "NetPayableAmt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA',width:150 },
        //   { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', },
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
          const dialogRef = this._matDialog.open(NewAmbulanceDetailComponent,
              {
                  maxWidth: "95vw",
                  height: '85%',
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
          const dialogRef = this._matDialog.open(NewAmbulanceDetailComponent,
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
  