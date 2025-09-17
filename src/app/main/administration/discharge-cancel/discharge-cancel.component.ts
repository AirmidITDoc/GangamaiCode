import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DischargeCancelService } from './discharge-cancel.service';

@Component({
  selector: 'app-discharge-cancel',
  templateUrl: './discharge-cancel.component.html',
  styleUrls: ['./discharge-cancel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DischargeCancelComponent implements OnInit {

  date: any;
  Currentdate: any;
  dateTimeObj: any;
  // sIsLoading: string = '';
  // isLoading = true;
  isRegIdSelected: boolean = false;
  // filteredOptions: any;
  // noOptionFound: any;
  vRegNo: any;
  vPatientName: any;
  vAdmissionDate: any;
  vMobileNo: any;
  vIPDNo: any;
  vTariffName: any;
  vCompanyName: any;
  vDoctorName: any;
  vRoomName: any;
  vBedName: any;
  vAge: any;
  vGenderName: any;
  vAdmissionTime: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartment: any;
  vRefDocName: any;
  vPatientType: any;
  screenFromString = 'admission-form';
  vCheckBox: boolean = false;
  vIpdnoCheckBox = false;
  vAdmissonDateCheckBox = false;
  AdmissionId: any;
  convertedDate: Date;
  formattedTime: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  registerObj: any;
  registerObjAM: any;



  isDatePckrDisabled: boolean = false;

  constructor(
    public _DischargeCancelService: DischargeCancelService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this._DischargeCancelService.DischargeForm.get('RegID').setValue('');
  }


  getDischargedList(event) {
    if (event.checked == true) {
      this.vCheckBox = true;
      this.patientInfoReset()
    }
    else
      this.vCheckBox = false;
    this._DischargeCancelService.DischargeForm.get('RegID').setValue('');
  }


  getvIpdnoCheckBox(event) {

    if (this._DischargeCancelService.DischargeForm.get("IsIPDnoEdit").value)
      this.vIpdnoCheckBox = true
    else
      this.vIpdnoCheckBox = false

  }

  getAdmissionDateEdit(event) {

    if (this._DischargeCancelService.DischargeForm.get("AdmissionDateEdit").value)
      this.vAdmissonDateCheckBox = true

    else
      this.vAdmissonDateCheckBox = false


  }

  getSelectedObjDC(obj) {
    console.log(obj)
    if ((obj.regID ?? 0) > 0) {
      console.log("Discharge patient:", obj)
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vDepartment = obj.departmentName
      this.vAdmissionDate = obj.admissionDate
      this.vAdmissionTime = obj.admissionTime
      this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
      this.vRefDocName = obj.refDocName
      this.vRoomName = obj.roomName
      this.vBedName = obj.bedName
      this.vPatientType = obj.patientType
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.AdmissionId = obj.admissionID

      this._DischargeCancelService.DischargeForm.get('NewIpdNo').setValue(this.vIPDNo)
     
  this.date = (this.datePipe.transform(new Date(),"MM-dd-YYYY hh:mm tt"));
      debugger
      var now = new Date(obj.admissionTime);
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      this.date = now.toISOString().slice(0, 16);

    }
  }



  DischargeCancel() {
    Swal.fire({
      title: 'Do you want to cancel the Discharge ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {
      if (result.isConfirmed) {

        let SubmitDate = {
          "admissionID": this.AdmissionId
        }
        this._DischargeCancelService.SaveDischargeCancel(SubmitDate).subscribe(response => {
          this.resetform();
        });
      }
    })
  }
  AdmisssionCancel() {
    if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
      this.toastr.success('Please select patient', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      return
    }

    Swal.fire({
      title: 'Do you want to Update IPDNO ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        var data = {
          'admissionID': this.AdmissionId,
          'admissionDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
          // 'admissionTime':formattedDate+this.dateTimeObj.time
        }
        console.log(data);
        this._DischargeCancelService.IpdNoupdate(data).subscribe(response => {
          this.resetform()

        });

      }
    });
  }


  today: Date = new Date();
  formattedDate: string;

  public now: Date = new Date();
  OnAdmDateTimeUpdate() {
    if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
      this.toastr.success('Please select patient', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      return
    }

    // const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    // const formattedTime = formattedDate + this.dateTimeObj.time;//this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd")+this.dateTimeObj.time;  

    Swal.fire({
      title: 'Do you want to Update Admission Date & Time ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        var data = {
          'admissionID': this.AdmissionId,
          'admissionDate': this.datePipe.transform(this._DischargeCancelService.DischargeForm.get('AdmissionDate').value, "yyyy-MM-dd"),
          'admissionTime': this.datePipe.transform(this._DischargeCancelService.DischargeForm.get('AdmissionDate').value, 'HH:mm'),
          'ipdno': this._DischargeCancelService.DischargeForm.get('NewIpdNo').value
        }
        console.log(data);
        this._DischargeCancelService.getDateTimeChange(data).subscribe(response => {
          this.resetform()

        });

      }
    });
  }



  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    // this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }


  // OnIpdNoUpdate() {
  //   if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
  //     this.toastr.success('Please select patient', 'Save !', {
  //       toastClass: 'tostr-tost custom-toast-success',
  //     });
  //     return
  //   }

  //   Swal.fire({
  //     title: 'Do you want to Update IPDNO ',
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, Update it!"
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       var data = {
  //         'admissionID': this.AdmissionId,
  //         'admissionDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
  //         // 'admissionTime':formattedDate+this.dateTimeObj.time
  //       }
  //       console.log(data);
  //       this._DischargeCancelService.IpdNoupdate(data).subscribe(response => {

  //         this.resetform()

  //       });

  //     }
  //   });
  // }

  resetform() {
    this._DischargeCancelService.DischargeForm.reset();
    this._DischargeCancelService.DischargeForm.get('Op_ip_id').setValue('1')
    this._DischargeCancelService.DischargeForm.get('RegID').setValue('');
    this._DischargeCancelService.DischargeForm.get('RegID').reset();
    this.vRegNo = ""
    this.vDoctorName = ""
    this.vPatientName = ""
    this.vDepartment = ""

    this.vIPDNo = ""
    this.vAge = ""
    this.vAgeMonth = ""
    this.vAgeDay = ""
    this.vGenderName = ""
    this.vRefDocName = ""
    this.vRoomName = ""
    this.vBedName = ""
    this.vPatientType = ""
    this.vTariffName = ""
    this.vCompanyName = ""
    // this.AdmissionId=obj.admissionID
  }
  onClear() {
    this._DischargeCancelService.DischargeForm.reset();
    this._DischargeCancelService.DischargeForm.get('Op_ip_id').setValue('1')
    this.patientInfoReset();
  }
  patientInfoReset() {
    this._DischargeCancelService.DischargeForm.get('RegID').setValue('');
    this._DischargeCancelService.DischargeForm.get('RegID').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vAdmissionDate = '';
    this.vAdmissionTime = '';
    this.vMobileNo = '';
    this.vIPDNo = '';
    this.vDoctorName = '';
    this.vTariffName = '';
    this.vCompanyName = '';
    this.vRoomName = '';
    this.vBedName = '';
    this.vGenderName = '';
    this.vAge = '';
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }

} 