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
  registerObj:any;
  registerObjAM:any;
  
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
    console.log(this.dateTimeObj)
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
 
getSelectedObjAM(obj) {
  
  if ((obj.regID ?? 0) > 0) {
    console.log("Admitted patient:",obj)
    this.vRegNo=obj.regNo
    this.vDoctorName=obj.doctorName
    this.vPatientName=obj.firstName + " " + obj.middleName + " " + obj.lastName
    this.vDepartment=obj.departmentName
    this.vAdmissionDate=obj.admissionDate
    this.vAdmissionTime=obj.admissionTime
    this.vIPDNo=obj.ipdNo
    this.vAge=obj.age
    this.vAgeMonth=obj.ageMonth
    this.vAgeDay=obj.ageDay
    this.vGenderName=obj.genderName
    this.vRefDocName=obj.refDocName
    this.vRoomName=obj.roomName
    this.vBedName=obj.bedName
    this.vPatientType=obj.patientType
    this.vTariffName=obj.tariffName
    this.vCompanyName=obj.companyName
    setTimeout(() => {
      this._DischargeCancelService.getAdmittedpatientlist(obj.regID).subscribe((response) => {
        this.registerObjAM = response;        
        console.log(this.registerObjAM)
      });

    }, 500);
  }
}

getSelectedObjDC(obj) {
  
  if ((obj.regId ?? 0) > 0) {
    console.log("Discharge patient:",obj)
    this.vRegNo=obj.regNo
    this.vDoctorName=obj.doctorName
    this.vDepartment=obj.departmentName
    this.vAdmissionDate=obj.admissionDate
    this.vAdmissionTime=obj.admissionTime
    this.vIPDNo=obj.ipdNo
    this.vAge=obj.age
    this.vAgeMonth=obj.ageMonth
    this.vAgeDay=obj.ageDay
    this.vGenderName=obj.genderName
    this.vRefDocName=obj.refDocName
    this.vRoomName=obj.roomName
    this.vBedName=obj.bedName
    this.vPatientType=obj.patientType
    this.vTariffName=obj.tariffName
    this.vCompanyName=obj.companyName
    let nameField = obj.formattedText;
    let extractedName = nameField.split('|')[0].trim();
    this.vPatientName=extractedName;
    setTimeout(() => {
      this._DischargeCancelService.getVisitById(obj.regId).subscribe((response) => {
        this.registerObj = response;
        console.log(this.registerObj)
      });

    }, 500);
  }
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

  today: Date = new Date();
  formattedDate: string;
 
  OnAdmDateTimeUpdate() {
    if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
      this.toastr.success('Please select patient', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      return
    }  

    const formattedDate = this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd");
    const formattedTime = formattedDate+this.dateTimeObj.time;//this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd")+this.dateTimeObj.time;  
 
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
      Query = "update admission set AdmissionDate='"+formattedDate+"',AdmissionTime='"+formattedTime+"'where AdmissionID=" +this.AdmissionId 

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