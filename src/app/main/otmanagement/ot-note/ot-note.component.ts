import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import Swal from 'sweetalert2';
import { OTReservationDetail } from '../ot-reservation/ot-reservation.component';
import { ReplaySubject, Subject } from 'rxjs';
import { OTManagementServiceService } from '../ot-management-service.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatTableDataSource } from '@angular/material/table';
import { debug } from 'console';

@Component({
  selector: 'app-ot-note',
  templateUrl: './ot-note.component.html',
  styleUrls: ['./ot-note.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OTNoteComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '25rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };
  onBlur(e: any) {
    this.vDescription = e.target.innerHTML;
  }

  displayedColumns = [
    'DoctorId',
    'DoctorName',
    'Amount'
  ]; 

  personalFormGroup: FormGroup; 
  now = Date.now(); 
  selectedAdvanceObj: OPIPPatientModel; 
  registerObj = new OPIPPatientModel({}); 
  OPDate: any;
  ID: any;
  registerObj1 = new OTReservationDetail({}); 
  OPIP: any = ''; 
  Bedname: any = ''; 
  wardname: any = '';
  classname: any = '';
  tariffname: any = '';
  AgeYear: any = '';
  ipno: any = ''; 
  Adm_Vit_ID: any = 0;
  public dateValue: Date = new Date();
  options = []; 
  vSelectedOption: any = '';
  vPatientName: any = '';
  vAgeYear: any = '';
  vAge: any = '';
  vGenderName: any = '';
  vDepartmentName: any = '';
  vOP_IP_MobileNo: any = '';
  vDoctorName: any = '';
  vTariffName: any = '';
  vCompanyName: any = '';
  vWardName: any = '';
  vBedNo: any = '';
  RegId: any = '';
  vAdmissionID: any = '';
  vRegNo: any = '';
  vIPDNo: any = '';
  vOPIP_ID: any = '';
  OP_IPType: any = 2;
  vOPDNo: any = '';
  vDescription:any;
  vDoctor:any;
  isDoctorSelected: boolean = false; 
  filteredOptionsDoctorsearch:any;
  noOptionFound: boolean = false; 
  screenFromString = 'otBooking-form'; 
  selectedDoctor: any;  
  sIsLoading: string = '';
  isLoading = true;
 
  dataSource = new MatTableDataSource<OTNoteDetail>();

  constructor(
    public _OtManagementService: OTManagementServiceService, 
    private accountService: AuthenticationService, 
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OTNoteComponent>, 
    private advanceDataStored: AdvanceDataStored
    ) { } 

  ngOnInit(): void {
    console.log(this.data)
    this.personalFormGroup = this._OtManagementService.createOtNoteForm(); 
    this.vSelectedOption = this.OP_IPType === true ? 'IP' : 'OP';

    if (this.data) {
      debugger
      this.registerObj1 = this.data.Obj; 
      // ip and op edit
      if (this.registerObj1.OP_IP_Type === true) {
        // Fetch IP-specific information
        console.log("IIIIIIIIIIIIIPPPPPPPPP:", this.registerObj1);
        this.vWardName = this.registerObj1.RoomName;
        this.vBedNo = this.registerObj1.BedName;
        this.vGenderName = this.registerObj1.GenderName;
        this.vPatientName = this.registerObj1.PatientName;
        this.vAgeYear = this.registerObj1.AgeYear;
        this.RegId = this.registerObj1.RegID;
        this.vAdmissionID = this.registerObj1.AdmissionID
        this.vAge = this.registerObj1.AgeYear;
        this.vRegNo = this.registerObj1.RegNo;
        this.vIPDNo = this.registerObj1.OPDNo;
        this.vCompanyName = this.registerObj1.CompanyName;
        this.vTariffName = this.registerObj1.TariffName;
        this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
        this.vDoctorName = this.registerObj1.DoctorName;
        this.vDepartmentName = this.registerObj1.DepartmentName;
        this.vSelectedOption = 'IP';
        this.vOPIP_ID = this.registerObj1.OP_IP_ID;

     
      } else if (this.registerObj1.OP_IP_Type === false) {
        // Fetch OP-specific information
        console.log("OOOOOOOPPPPPPPPP:", this.registerObj1);
        this.vWardName = this.registerObj1.RoomName;
        this.vBedNo = this.registerObj1.BedName;
        this.vGenderName = this.registerObj1.GenderName;
        this.vPatientName = this.registerObj1.PatientName;
        this.vAgeYear = this.registerObj1.AgeYear;
        this.RegId = this.registerObj1.RegID;
        this.vAdmissionID = this.registerObj1.AdmissionID
        this.vAge = this.registerObj1.AgeYear;
        this.vRegNo = this.registerObj1.RegNo;
        this.vOPDNo = this.registerObj1.OPDNo;
        this.vCompanyName = this.registerObj1.CompanyName;
        this.vTariffName = this.registerObj1.TariffName;
        this.vOP_IP_MobileNo = this.registerObj1.MobileNo;
        this.vDoctorName = this.registerObj1.DoctorName;
        this.vDepartmentName = this.registerObj1.DepartmentName;
        this.vSelectedOption = 'OP';
        this.vOPIP_ID = this.registerObj1.OP_IP_ID; 
      } 
      console.log(this.registerObj1);  
    } 
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.vPatientName = this.selectedAdvanceObj.PatientName;
      this.OPIP = this.selectedAdvanceObj.IP_OP_Number;
      this.AgeYear = this.selectedAdvanceObj.AgeYear;
      this.classname = this.selectedAdvanceObj.ClassName;
      this.tariffname = this.selectedAdvanceObj.TariffName;
      this.ipno = this.selectedAdvanceObj.IPNumber;
      this.Bedname = this.selectedAdvanceObj.Bedname;
      this.wardname = this.selectedAdvanceObj.WardId;
      // this.Adm_Vit_ID = this.selectedAdvanceObj.OP_IP_ID;
    }
    console.log(this.selectedAdvanceObj);  
    this.getDoctorNameCombobox(); 
  } 
 

  addDoctor() {
    debugger
    if (this.selectedDoctor) {
      // Add the selected doctor to the data source
      this.dataSource.data.push({
        DoctorId: this.selectedDoctor.DoctorId,
        DoctorName: this.selectedDoctor.Doctorname,
        Amount:0
      });
      this.dataSource._updateChangeSubscription(); // Update the data source
      this.clearSelection(); // Clear the selection after adding
    }
  }
  clearSelection() {
    this.personalFormGroup.get('DoctorId').setValue('');
    this.selectedDoctor = null;
  } 
    //Doctor list 
    getDoctorNameCombobox() {
      debugger
      var vdata = {
          "@Keywords": `${this.personalFormGroup.get('DoctorId').value}%`
      }
      console.log(vdata)
      this._OtManagementService.getDoctorMasterComboList(vdata).subscribe(data => {
          this.filteredOptionsDoctorsearch = data;
          console.log(this.filteredOptionsDoctorsearch)
          if (this.filteredOptionsDoctorsearch.length == 0) {
              this.noOptionFound = true;
          } else {
              this.noOptionFound = false;
          }
      });
  }
  onDoctorSelect(option){
    debugger
    console.log("selectedDoctorOption:", option)
    this.selectedDoctor=option;
  }
  getOptionTextDoctor(option) {
      return option && option.Doctorname ? option.Doctorname : '';
  } 
  onSubmit() {
    debugger;
    let otBookingID = this.registerObj1.OTBookingID;  
    if (this.Adm_Vit_ID) {
      if (!otBookingID) {
        var m_data = {
          "otNoteTemplateInsert": {
            "otTemplateName": "string",
            "otDate": this.dateTimeObj.date,
            "otTime":this.dateTimeObj.time,
            "surgeryName": this.registerObj1.Surgeryname,
            "surgeonID": this.registerObj1.SurgeonId,
            "surgeonID1": this.registerObj1.SurgeonId1,
            "assistant": "string",
            "anesthetishID": 0,
            "anesthetishID1": 0,
            "anesthetishID2": 0,
            "anesthetishType": "string",
            "incision": "string",
            "operativeDiagnosis": "string",
            "operativeFindings": "string",
            "operativeProcedure": "string",
            "extraProPerformed": "string",
            "closureTechnique": "string",
            "postOpertiveInstru": "string",
            "detSpecimenForLab": "string",
            "addedby": this.accountService.currentUserValue.user.id,
            "surgeryType": "string",
            "fromTime":this.dateTimeObj.date,
            "toTime":this.dateTimeObj.time,
            "otReservationId": 0,
            "bloodLoss": "string",
            "surgeryID": 0,
            "sorubNurse": "string",
            "histopathology": "string",
            "bostOPOrders": "string",
            "anestTypeId": 0,
            "siteDescID": 0,
            "complicationMode": "string",
            "serviceId": 0,
            "procedureId": 0,
            "otNoteTempId": 0
          }, 
        }
        console.log(m_data);
        this._OtManagementService.InsertOTNotes(m_data).subscribe(response => {
          if (response) {
            this._OtManagementService
            Swal.fire('Congratulations !', 'OT Note  Data save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
                //  this.addEmptyRow();

              }
            });
          } else {
            Swal.fire('Error !', 'Ot Note Data  not saved', 'error');
          }

        });
      }
      else {
        debugger;
        var m_data1 = {
          "otTableBookingDetailUpdate": {
            "OTBookingID": otBookingID,
            "tranDate": this.dateTimeObj.date, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
            "tranTime": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
            "opDate": this.dateTimeObj.date,// this.datePipe.transform(this.personalFormGroup.get('OPDate').value,"yyyy-Mm-dd") ,// this.dateTimeObj.date,//
            "opTime": this.dateTimeObj.time,
            "duration": this._OtManagementService.otreservationFormGroup.get('Duration').value || 0,
            "otTableID": this._OtManagementService.otreservationFormGroup.get('OTTableId').value.OTTableId || 0,
            "surgeonId": this._OtManagementService.otreservationFormGroup.get('SurgeonId').value.DoctorId || 0,
            "surgeonId1": this._OtManagementService.otreservationFormGroup.get('SurgeonId1').value.DoctorID || 0,
            "anestheticsDr": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr').value.DoctorId || 0,
            "anestheticsDr1": this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value ? this._OtManagementService.otreservationFormGroup.get('AnestheticsDr1').value.DoctorId : 0,
            "surgeryname": this._OtManagementService.otreservationFormGroup.get('SurgeryId').value.SurgeryName || 0,// ? this.personalFormGroup.get('SurgeryId').value.SurgeryId : 0,
            "procedureId": 0,
            "anesthType": this._OtManagementService.otreservationFormGroup.get('AnesthType').value || '',
            "instruction": this._OtManagementService.otreservationFormGroup.get('Instruction').value || '',
            // "PatientName": this.PatientName || '',
            "IsUpdatedBy": this.accountService.currentUserValue.user.id || 0,
            "unBooking": false,// Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",


          }
        }
        console.log(m_data1);
        this._OtManagementService.UpdateOTNotes(m_data1).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'OT NOTE Data Updated Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'OT Note Data  not saved', 'error');
          }

        });
      }
    }
  }

  onClose() {
    this.dataSource.data=[];
    this.personalFormGroup.reset();
    this.dialogRef.close();
    
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
    onAmountChange(contact: any, amount: number) {
    contact.Amount = amount;
  }
}
export class OTNoteDetail {
DoctorId:any;
DoctorName: any;
Amount:any; 
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OTNoteDetail) {
    {     
    this.DoctorId=OTNoteDetail.DoctorId || '',
    this.DoctorName=OTNoteDetail.DoctorName || ''
    this.Amount=OTNoteDetail.Amount || ''
    }
  }
}

