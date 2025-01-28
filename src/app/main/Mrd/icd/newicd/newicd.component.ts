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

      // this.dataSource2.data = [this.registerObj1];
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

      // this.vShowData = this.registerObj1.PatientName;

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

  // imp
  // getICDCodeDetailList(row: any) {
  //   console.log('Selected Row Data:', row);

  //   this.selectedRow = row;

  //   const currentData = this.dataSource2.data;

  //   const isRowExists = currentData.some(data => data.ICDCodingId === row.ICDCodingId);

  //   if (isRowExists) {
  //     console.log('Row already exists in Table 2:', row);
  //   } else {
  //     currentData.push(row);
  //     this.dataSource2.data = [...currentData];

  //     console.log('Updated DataSource for Table 2:', this.dataSource2.data);
  //   }
  // }

  // demo
//   getICDCodeDetailList(row: any) {
//     console.log('Selected Row Data:', row);
//     this.selectedRow = row;
//     if (this.dataSource2.data.length > 0) {
//         this.dataSource2.data = [];
//         console.log('Existing data cleared from Table 2');
//     }
//     this.dataSource2.data = [row];
//     console.log('Added new row to Table 2:', this.dataSource2.data);

//     if (this.registerObj1) {
//       this.dataSource2.data = [this.registerObj1];
//     }
// }

tablelist:any=[];
// 1
// getICDCodeDetailList(row: any) {
//   debugger
//   console.log('Selected Row Data:', row);

//   // If `this.registerObj1` exists, restore its data
//   if (this.registerObj1) {
//       this.dataSource2.data = [this.registerObj1];
//       console.log('Restored data from registerObj1:', this.dataSource2.data);
//   } else {
//       // Otherwise, handle the newly selected row
//       if (this.dataSource2.data.length > 0) {
//           this.dataSource2.data = [];
//           console.log('Existing data cleared from Table 2');
//       }
//       this.dataSource2.data = [row];
//       console.log('Added new row to Table 2:', this.dataSource2.data);
//   }
// }

getICDCodeDetailList(row: any) {
  debugger
  this.tablelist=[];
  this.selectedRow=row;
  if(this.tablelist.length){
    if(this.tablelist.some(item=>item.ICDCode==row.ICDCode)){
      this.toastr.warning('Record Saved Successfully.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-Warning',
      });
      return
    }
    this.tablelist.push(
      {
        MainCName:row.MainCName,
        ICDCode:row.ICDCode,
        ICDCodeName:row.ICDCodeName
      }
    )
  }
  else{
    this.tablelist.push(
      {
        MainCName:row.MainCName,
        ICDCode:row.ICDCode,
        ICDCodeName:row.ICDCodeName
      }
    )
  }  
  this.dataSource2.data=this.tablelist
}


// demo end

  removeRow(row: any) {
    // Get the current data from dataSource2
    const currentData = this.dataSource2.data;

    // Filter out the row to be removed
    const updatedData = currentData.filter(data => data.ICDCodingId !== row.ICDCodingId);

    // Update dataSource2 with the new data
    this.dataSource2.data = updatedData;

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

      let insertPatICDCodeDetails = {
        "dId": 0,
        "hId": 0,
        "icdCode": this.selectedRow.ICDCode,
        "icdCodeDesc": this.selectedRow.ICDCodeName,
        "icdCdeMainName": this.selectedRow.MainCName,
        "mainICDCdeId": this.selectedRow.MainICDCdeId,
        "createdBy": this._loggedService.currentUserValue.user.id,
      }

      let submitData = {
        "insertPatICDCodeParamHeader": insertPatICDCodeHeader,
        "insertPatICDCodeParamDetails": insertPatICDCodeDetails
      }
      console.log("insertJson:", submitData);

      this._MrdService.icdInsert(submitData).subscribe(response => {
        console.log("API Response:", response);
  //       let generatedPatICDCodeId = response?.PatICDCodeId || 0; 
  // insertPatICDCodeDetails.hId = generatedPatICDCodeId;

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

      let updatePatICDCodeHeader = {
        "patICDCodeId": this.vpatICDCodeId,
        "reqDate": formattedDate,
        "reqTime": formattedTime,
        "oP_IP_Type": 1,
        "oP_IP_ID": this.vAdmissionID,
        "modifiedBy": this._loggedService.currentUserValue.user.id
      }

      let updatePatICDCodeDetails = {
        "dId": this.vdId,
        "hId": 0,
        "icdCode": this.selectedRow.ICDCode,
        "icdCodeDesc": this.selectedRow.ICDCodeName,
        "icdCdeMainName": this.selectedRow.MainCName,
        "mainICDCdeId": this.selectedRow.MainICDCdeId,
        "modifiedBy": this._loggedService.currentUserValue.user.id
      }

      let updateData = {
        "updatePatICDCodeParamHeader": updatePatICDCodeHeader,
        "updatePatICDCodeParamDetails": updatePatICDCodeDetails
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
      start: new Date(),
      end: new Date(),
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

