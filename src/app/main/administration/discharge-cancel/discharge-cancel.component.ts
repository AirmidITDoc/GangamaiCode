import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DischargeCancelService } from './discharge-cancel.service';
import { element } from 'protractor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discharge-cancel',
  templateUrl: './discharge-cancel.component.html',
  styleUrls: ['./discharge-cancel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DischargeCancelComponent implements OnInit {
 

  dateTimeObj:any;
  sIsLoading: string = '';
  isLoading = true;
  isRegIdSelected:boolean=false;  
  filteredOptions:any;
  noOptionFound:any;  
  vRegNo:any;
  vPatientName:any; 
  vAdmissionDate:any;
  vMobileNo:any; 
  vIPDNo:any; 
  vTariffName:any;
  vCompanyName:any; 
  vDoctorName:any;
  vRoomName:any;
  vBedName:any;
  vAge:any;
  vGenderName:any;
  vAdmissionTime:any;
  vAgeMonth:any;
  vAgeDay:any;
  vDepartment:any;
  vRefDocName:any;
  vPatientType:any;
  screenFromString = 'admission-form';
  vCheckBox:boolean=false;
  AdmissionId:any;
  convertedDate: Date;
  formattedTime:any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public _DischargeCancelService: DischargeCancelService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  )
   {} 

  ngOnInit(): void { 
    this._DischargeCancelService.DischargeForm.get('RegID').setValue('');
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj; 
  } 
 
   getSearchList() {
    var m_data = {
      "Keyword": `${this._DischargeCancelService.DischargeForm.get('RegID').value}%`
    }
    if (this._DischargeCancelService.DischargeForm.get('RegID').value.length >= 1) {
      this._DischargeCancelService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData) 
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        } 
      });
    } 
  } 
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  } 
  getSelectedObj(obj){
    console.log(obj)
   this.vRegNo = obj.RegNo;
   this.vPatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
   this.vAdmissionDate = obj.AdmissionDate;
   this.vAdmissionTime = obj.AdmissionTime;
   this.vMobileNo = obj.MobileNo;  
   this.vIPDNo = obj.IPDNo; 
   this.vDoctorName = obj.DoctorName;
   this.vTariffName =obj.TariffName
   this.vCompanyName = obj.CompanyName 
   this.vRoomName = obj.RoomName;
   this.vBedName = obj.BedName
   this.vGenderName = obj.GenderName
   this.vAge = obj.Age  
   this.AdmissionId = obj.AdmissionID;
  }
  getDischargedList(event){
    if(event.checked == true){
      this.patientInfoReset();
      this.vCheckBox = true;
    }else{
      this.patientInfoReset(); 
      this.vCheckBox = false;
    } 
}
getDischargedSearchList() {
  var m_data = {
    "Keyword": `${this._DischargeCancelService.DischargeForm.get('RegID').value}%`
  }
  if (this._DischargeCancelService.DischargeForm.get('RegID').value.length >= 1) {
    this._DischargeCancelService.getDischargepatientlist(m_data).subscribe(resData => {
      this.filteredOptions = resData;
      console.log(resData) 
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      } 
    });
  } 
} 
getOptionDischargeText(option) {
  if (!option) return '';
  return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
} 
getSelectedDischargeObj(obj){
  console.log(obj)
 this.vRegNo = obj.RegNo;
 this.vPatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
 this.vAdmissionDate = obj.AdmissionDate;
 this.vAdmissionTime = obj.AdmissionTime;
 this.vMobileNo = obj.MobileNo;  
 this.vIPDNo = obj.IPDNo; 
 this.vDoctorName = obj.DoctorName;
 this.vTariffName =obj.TariffName
 this.vCompanyName = obj.CompanyName 
 this.vRoomName = obj.RoomName;
 this.vBedName = obj.BedName
 this.vGenderName = obj.GenderName
 this.vAge = obj.Age  
 this.AdmissionId = obj.AdmissionID;
}
 
  isLoading123:boolean=false;
  DischargeCancel(){ 
    Swal.fire({
      title: 'Do you want to cancel the Discharge ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!" 
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {  
        let iP_DischargeCancelParam = {};
        iP_DischargeCancelParam['admissionId'] = this.AdmissionId; 

        let SubmitDate ={
          "iP_DischargeCancelParam":iP_DischargeCancelParam
        } 
        this._DischargeCancelService.SaveDischargeCancel(SubmitDate).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Discharge Cancel Successfully !', 'success').then((result) => {
              if (result.isConfirmed) { 
                this.onClear();
              }
            });
          } else {
            Swal.fire('Error !', 'Discharge  not saved', 'error');
          } 
        });  
      } 
    })
  }
  AdmisssionCancel(){

  }


  OnAdmDateTimeUpdate() {
    if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
      this.toastr.success('Please select patient', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      return
    }
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd 00:00:00.000");
    // const formattedTime = this.datePipe.transform( this.formattedTime ,"yyyy-MM-dd 00:00:00.000");
    Swal.fire({
      title: 'Do you want to Update Admission Date & Time ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) { 
        let Query
        Query = "update admission set AdmissionDate= '"+formattedDate+"', AdmissionTime= '" +formattedDate+"' where AdmissionID= " + this.AdmissionId ;
          console.log(Query);
        this._DischargeCancelService.getDateTimeChange(Query).subscribe(response => {
          if (response) {
            this.toastr.success('Admission Date & Time Updated Successfuly', 'Updated !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.onClear();
          } else {
            this.toastr.error('API Error!', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        });
      }
    }); 
  }
  onClear(){
    this._DischargeCancelService.DischargeForm.reset(); 
    this._DischargeCancelService.DischargeForm.get('Op_ip_id').setValue('1')
    this.patientInfoReset();
  }
  patientInfoReset(){
    this._DischargeCancelService.DischargeForm.get('RegID').setValue('');
    this._DischargeCancelService.DischargeForm.get('RegID').reset();
    this.vRegNo = '';
    this.vPatientName ='';
    this.vAdmissionDate = '';
    this.vAdmissionTime = '';
    this.vMobileNo = '';
    this.vIPDNo ='';
    this.vDoctorName = '';
    this.vTariffName ='';
    this.vCompanyName = '';
    this.vRoomName = '';
    this.vBedName = '';
    this.vGenderName = '';
    this.vAge = '';
  }
}
 
