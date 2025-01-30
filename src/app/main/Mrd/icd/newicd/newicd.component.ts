import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { fuseAnimations } from '@fuse/animations';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { MrdService } from '../../mrd.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Icddetail } from '../icd.component';

@Component({
  selector: 'app-newicd',
  templateUrl: './newicd.component.html',
  styleUrls: ['./newicd.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewicdComponent implements OnInit {

  registerObj1: any;
  registerObj: any;
  PatientListfilteredOptions: any;
  RegId: any;
  vAdmissionID: any;
  isRegIdSelected: boolean = false;
  vRegNo: any;
  vIPDNo: any;
  vPatientName: any;
  vAge: any;
  vGenderName: any;
  vDepartmentName: any;
  vMobileNo: any;
  vDoctorName: any;
  vTariffName: any;
  vCompanyName: any;
  selectedTemplate: any;
  IP_Id: any;
  vAgeYear: any;
  vCertificateText: any;
  filteredOptions: any;
  noOptionFound: boolean = false;
  hasSelectedContacts: boolean;
  sIsLoading: string = '';

  vpatICDCodeId: any;
  vdId: any;
  selectedRow: any;
  vWardName:any;

  vShowData:any;
  vHId:any;

  displayedColumns: string[] = [
    "ICDCode",
    "mainCName",
    "ICDName",
  ];
  displayedColumns1: string[] = [
    "ICDCode",
    "mainCName",
    "Description",
    "action"
  ];

  DSIcdMasterList = new MatTableDataSource<IcdcodingMaster>();
  dataSource2 = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _MrdService: MrdService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewicdComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj1 = this.data.Obj;
      console.log("Icd RegisterObj:", this.registerObj1)

      // this.dataSource2.data = Array.isArray(this.registerObj1) ? [...this.registerObj1] : [this.registerObj1];

    //   if (this.registerObj1 && this.registerObj1.length > 0) {
    //     this.tablelist = [...this.registerObj1]; 
    //     this.dataSource2.data = [...this.tablelist]; 
    // }

    this.tablelist = Array.isArray(this.registerObj1) ? [...this.registerObj1] : [this.registerObj1];
this.dataSource2.data = [...this.tablelist];

      this.vpatICDCodeId=this.registerObj1.PatICDCodeId
      this.vdId=this.registerObj1.DId
      this.RegId = this.registerObj1.RegId;
      this.vAdmissionID = this.registerObj1.AdmissionID
      console.log("AdmittedListIP:", this.registerObj1)
      this.registerObj = this.registerObj1;
      this.vPatientName = this.registerObj1.PatientName;
      this.IP_Id = this.registerObj.AdmissionID;
      this.vIPDNo = this.registerObj1.IPDNo;
      this.vRegNo = this.registerObj1.RegNo;
      this.vDoctorName = this.registerObj1.AdmDoctorName;
      this.vTariffName = this.registerObj1.TariffName
      this.vCompanyName = this.registerObj1.CompanyName;
      this.vAgeYear = this.registerObj1.AgeYear;
      this.vMobileNo = this.registerObj1.MobileNo;
      this.vDepartmentName = this.registerObj1.DepartmentName;
      this.vAge = this.registerObj1.AgeYear;
      this.vGenderName = this.registerObj1.GenderName;
      this.vAdmissionID = this.registerObj1.AdmissionID;
      this.vWardName=this.registerObj1.WardName;
      this.vHId=this.registerObj1.HId;
    }
    this.getICDCodelist();
  }

  getSelectedObj(obj) {
    this.registerObj = obj;
    this.RegId = obj.RegID;
    this.vAdmissionID = obj.AdmissionID
    console.log("AdmittedListIP:", obj)
    this.registerObj = obj;
    this.vPatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
    this.RegId = obj.RegID;
    this.IP_Id = this.registerObj.AdmissionID;
    this.vIPDNo = obj.IPDNo;
    this.vRegNo = obj.RegNo;
    this.vDoctorName = obj.DoctorName;
    this.vTariffName = obj.TariffName
    this.vCompanyName = obj.CompanyName;
    this.vAgeYear = obj.AgeYear;
    this.vMobileNo = obj.MobileNo;
    this.vDepartmentName = obj.DepartmentName;
    this.vAge = obj.Age;
    this.vGenderName = obj.GenderName;
    this.vAdmissionID = obj.AdmissionID;
  }

  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  }

  getSearchList() {
    var m_data = {
      "Keyword": `${this._MrdService.icdForm.get('RegID').value}%`
    }
    if (this._MrdService.icdForm.get('RegID').value.length >= 1) {
      this._MrdService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }

      });
    }
  }

  getICDCodelist() {
    debugger
    const icdCode = this._MrdService.icdForm.get("ICDCodeSearch").value || '';
    const icdCodeName = this._MrdService.icdForm.get("ICDCodeNameSearch").value || '';

    var D_data = {
      "ICDCode": icdCode.trim() ? icdCode + '%' : '%',
      "ICDCodeName": icdCodeName.trim() ? icdCodeName + '%' : '%',
    };

    console.log("TypeList:", D_data);
    this._MrdService.geticdCodelist(D_data).subscribe((Menu) => {
      this.DSIcdMasterList.data = Menu as IcdcodingMaster[];
      this.DSIcdMasterList.sort = this.sort;
      this.DSIcdMasterList.paginator = this.paginator;
    });
  }

tablelist:any=[];
getICDCodeDetailList(row: any) {
  debugger;
  if (!this.tablelist) {
    this.tablelist = [];
  }
  // Check if the record already exists
  if (this.tablelist.some(item => item.ICDCodingId === row.ICDCodingId)) {
    this.toastr.warning('Record Already Exist.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-Warning',
    });
    return;
  }
  // if (
  //   [...this.tablelist, ...this.registerObj].some(
  //     item => item.ICDCodingId === row.ICDCodingId
  //   )
  // ) {
  //   this.toastr.warning('Record Already Exists.', 'Warning!', {
  //     toastClass: 'tostr-tost custom-toast-Warning',
  //   });
  //   return;
  // }
  // Add the new row to tablelist
  this.tablelist.push({
    ICDCodingId: row.ICDCodingId,  // Ensure unique identifier is added
    MainCName: row.MainCName,
    ICDCode: row.ICDCode,
    ICDCodeName: row.ICDCodeName
  });

  // Update dataSource2 with the updated tablelist
  this.dataSource2.data = [...this.tablelist];
}

// demo end

  removeRow(row: any) {
    debugger
    if (!this.tablelist) return;
    // Filter out the row to be removed
    this.tablelist = this.tablelist.filter(data => data.ICDCodingId !== row.ICDCodingId);
    // Update dataSource2 with the new list
    this.dataSource2.data = [...this.tablelist];  
    console.log('Updated DataSource after Deletion:', this.dataSource2.data);
  }

  onClear() {
    this._MrdService.icdForm.reset({
      ICDNameSearch: "",
      ICDCodeSearch: "",
    });
    this.getICDCodelist();
  }

  onSave() {
    if (!this._MrdService.icdForm.get('RegID')?.value && !this.registerObj1?.RegId) {
      this.toastr.warning('Please Select Patient', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
  }
  
    if (!this.dataSource2 || this.dataSource2.data.length === 0) {
      this.toastr.warning('Please Select ICD Code', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;  // Stop the function if Table2 (dataSource2) is empty
    }

    Swal.fire({
      title: 'Do you want to Save the ICD Code Recode ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!",
      cancelButtonText: "No, Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSubmit();
      }
    });
  }

  onSubmit() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');


    if (!this.vpatICDCodeId && !this.vdId) {

      let insertPatICDCodeHeader = {
        "patICDCodeId": 0,
        "reqDate": formattedDate,
        "reqTime": formattedTime,
        "oP_IP_Type": 1,
        "oP_IP_ID": this.vAdmissionID,
        "createdBy": this._loggedService.currentUserValue.user.id,
      }

      // let insertPatICDCodeDetails = {
      //   "dId": 0,
      //   "hId": 0,
      //   "icdCode": this.selectedRow.ICDCode,
      //   "icdCodeDesc": this.selectedRow.ICDCodeName,
      //   "icdCdeMainName": this.selectedRow.MainCName,
      //   "mainICDCdeId": this.selectedRow.MainICDCdeId,
      //   "createdBy": this._loggedService.currentUserValue.user.id,
      // }

      let insertPatICDCodeDetailsArray = this.dataSource2.data.map((row: any) => ({
        "dId": 0,
        "hId": 0,
        "icdCode": row.ICDCode,
        "icdCodeDesc": row.ICDCodeName,
        "icdCdeMainName": row.MainCName,
        "mainICDCdeId": row.MainICDCdeId,
        "createdBy": this._loggedService.currentUserValue.user.id,
      }));

      let submitData = {
        "insertPatICDCodeParamHeader": insertPatICDCodeHeader,
        "insertPatICDCodeParamDetails": insertPatICDCodeDetailsArray
      }
      console.log("insertJson:", submitData);

      this._MrdService.icdInsert(submitData).subscribe(response => {
        console.log("API Response:", response);

        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
    else {

      let deletePatICDCodeParamHeader= {
        "patICDCodeId": this.vpatICDCodeId
    }

      let updatePatICDCodeHeader = this.DSIcdMasterList.data.map((row: any) => ({
        "patICDCodeId": this.vpatICDCodeId,
        "reqDate": formattedDate,
        "reqTime": formattedTime,
        "oP_IP_Type": 1,
        "oP_IP_ID": this.vAdmissionID,
        "modifiedBy": this._loggedService.currentUserValue.user.id
      }));

      // let updatePatICDCodeHeader = {
      //   "patICDCodeId": this.vpatICDCodeId,
      //   "reqDate": formattedDate,
      //   "reqTime": formattedTime,
      //   "oP_IP_Type": 1,
      //   "oP_IP_ID": this.vAdmissionID,
      //   "modifiedBy": this._loggedService.currentUserValue.user.id
      // }

      let updatePatICDCodeDetailsArray = this.dataSource2.data.map((row: any) => ({
        "dId": row.dId || this.vdId, // Use existing dId if available, otherwise use vdId
        "hId": row.HId || this.vHId,
        "icdCode": row.ICDCode,
        "icdCodeDesc": row.ICDCodeName,
        "icdCdeMainName": row.MainCName,
        "mainICDCdeId": row.MainICDCdeId,
        "modifiedBy": this._loggedService.currentUserValue.user.id
      }));

      // let updatePatICDCodeDetails = {
      //   "dId": this.vdId,
      //   "hId": 0,
      //   "icdCode": this.selectedRow.ICDCode,
      //   "icdCodeDesc": this.selectedRow.ICDCodeName,
      //   "icdCdeMainName": this.selectedRow.MainCName,
      //   "mainICDCdeId": this.selectedRow.MainICDCdeId,
      //   "modifiedBy": this._loggedService.currentUserValue.user.id
      // }

      let updateData = {
        "deletePatICDCodeParamHeader":deletePatICDCodeParamHeader,
        "updatePatICDCodeParamHeader": updatePatICDCodeHeader,
        "updatePatICDCodeParamDetails": updatePatICDCodeDetailsArray
      }

      console.log("UpdateJson:", updateData);

      this._MrdService.icdUpdate(updateData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }

  }

  onClose() {
    this._MrdService.icdForm.reset({
      // start: new Date(),
      // end: new Date(),
      start: this._MrdService.icdForm.get('start')?.value,
      end: this._MrdService.icdForm.get('end')?.value,
    });
    this.dialogRef.close();
  }
}
export class IcdcodingMaster {
  ICDCodingId: number;
  MainName: string;
  ICDDescription: string;
  IsActive: boolean;
  PatICDCodeId:number;

  /**
   * Constructor
   *
   * @param IcdcodingMaster
   */
  constructor(IcdcodingMaster) {
    {
      this.ICDCodingId = IcdcodingMaster.ICDCodingId || "";
      this.MainName = IcdcodingMaster.MainName || "";
      this.ICDDescription = IcdcodingMaster.ICDDescription || "";
      this.IsActive = IcdcodingMaster.IsActive || "false";
      this.PatICDCodeId=IcdcodingMaster.PatICDCodeId || '';
    }
  }
}

