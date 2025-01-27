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

  registerObj1:any;
  registerObj:any;
  PatientListfilteredOptions: any;
  RegId:any;
  vAdmissionID:any;
  isRegIdSelected :boolean=false;
  vRegNo:any;
  vIPDNo:any;
  vPatientName:any;
  vAge:any;
  vGenderName:any;
  vDepartmentName:any;
  vMobileNo:any;
  vDoctorName:any;
  vTariffName:any;
  vCompanyName:any;
  selectedTemplate:any;
  IP_Id:any;
  vAgeYear:any;
  vCertificateText:any;
  filteredOptions: any;
  noOptionFound: boolean = false;
  hasSelectedContacts: boolean;
  sIsLoading: string = '';


  displayedColumns: string[] = [
    "mainCName",
    "ICDCode",
    "ICDName",
];
displayedColumns1: string[] = [
  "mainCName",
  "ICDCode",
  "Description",
];

DSIcdMasterList=new MatTableDataSource();

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

  getICDCodelist(){
this.sIsLoading = 'loading-data';
  
    const ICDCodeName = this._MrdService.icdForm.get("ICDNameSearch").value;
    const ICDCode = this._MrdService.icdForm.get("ICDCodeSearch").value;
  
    // Prepare request payload
    const D_data = {
      "ICDCodeName": ICDCode || '',
      "ICDCode": ICDCodeName ? `${ICDCodeName}%` : '%',
    };
  
    console.log("Request Payload:", D_data);
  
    // Make API call
    this._MrdService.geticdCodelist(D_data).subscribe(
      (response) => {
        console.log("API Response:", response);
        
        if (response && Array.isArray(response)) {
          this.DSIcdMasterList.data = response as Icddetail[];
          this.DSIcdMasterList.sort = this.sort;
          this.DSIcdMasterList.paginator = this.paginator;
        } else {
          console.error("Invalid data format received:", response);
        }  
        this.sIsLoading = '';
      },
      (error) => {
        console.error("Error Fetching Data:", error);
        this.sIsLoading = '';
      }
    );
  }

  onClear() {
    this._MrdService.icdForm.reset({
      ICDNameSearch:"",
      ICDCodeSearch:"",
    });
    this.getICDCodelist();
  }
  onSave(){

  }
  onClose() {
    this._MrdService.icdForm.reset({ 
      start: new Date(),
      end: new Date(),
     });
    this.dialogRef.close();
   }
}

