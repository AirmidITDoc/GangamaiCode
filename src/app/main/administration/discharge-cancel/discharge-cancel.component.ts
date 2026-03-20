import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
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
  isTimeChanged: boolean = false;
  dateLabel: string = 'Admission Date';
  timeLabel: string = 'Admission Time';
  date: any;
  Currentdate: any;
  dateTimeObj: any;
  isRegIdSelected: boolean = false;
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
  AdmissionId = 0;
  convertedDate: Date;
  formattedTime: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  registerObj: any;
  registerObjAM: any;
  isDatePckrDisabled: boolean = false;
  dateTimeString: any;
  constructor(
    public _DischargeCancelService: DischargeCancelService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) {
    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US").split(',');
      if (!this.isTimeChanged) {
        this._DischargeCancelService.DischargeForm.get('AdmissionTime').setValue(this.now);
        if (this._DischargeCancelService.DischargeForm.get('AdmissionTime'))
          this._DischargeCancelService.DischargeForm.get('AdmissionTime').setValue(this.now);
      }
    }, 1);
  }

  ngOnInit(): void {
    this._DischargeCancelService.DischargeForm.get('RegID').setValue('');
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);

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
      this.vRefDocName = obj.refDoctorName
      this.vRoomName = obj.roomName
      this.vBedName = obj.bedName
      this.vPatientType = obj.patientType
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      const nameField = obj.formattedText;
      const extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.AdmissionId = obj.admissionID

      this._DischargeCancelService.DischargeForm.get('NewIpdNo').setValue(this.vIPDNo)

      this.date = (this.datePipe.transform(new Date(), "MM-dd-YYYY hh:mm tt"));
      
   debugger

     
          this._DischargeCancelService.DischargeForm.get('AdmissionDate').setValue(obj.admissionTime);
          this._DischargeCancelService.DischargeForm.get('AdmissionTime').setValue(this.date,"HH:mm:ss");
     
    }

  }
  myFilter = (d: Date | null): boolean => {
    return this.isDisableFuture ? d <= new Date() : true;
  };
  today: Date = new Date();
  formattedDate: string;
  @Input() isDisableFuture: boolean = false;

  DischargeCancel() {
    if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-Warning',
      });
      return
    }

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

        const SubmitDate = {
          "admissionID": this.AdmissionId
        }
        console.log(SubmitDate)
        this._DischargeCancelService.SaveDischargeCancel(SubmitDate).subscribe(response => {
          this.resetform();
        });
      }
    })
  }
  AdmisssionCancel() {
    if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-Warning',
      });
      return
    }

    Swal.fire({
      title: 'Do you want to Admission Cancel ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          'admissionID': this.AdmissionId,
          // 'admissionDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
          // 'admissionTime':formattedDate+this.dateTimeObj.time
        }
        console.log(data);
        this._DischargeCancelService.AdmissionCancel(data).subscribe(response => {
          this.resetform()

        });

      }
    });
  }


  public now: Date = new Date();
  OnAdmDateTimeUpdate() {
    if (this.vRegNo == '0' || this.vRegNo == '' || this.vRegNo == undefined || this.vRegNo == null) {
      this.toastr.success('Please select patient', 'Save !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      return
    }
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

           const formattedDate = this.datePipe.transform(this._DischargeCancelService.DischargeForm.get('AdmissionDate').value, "yyyy-MM-dd");
        const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
        this._DischargeCancelService.DischargeForm.get('AdmissionDate').setValue(formattedDate);
        // this._DischargeCancelService.DischargeForm.get('AdmissionTime').setValue(formattedDate + ' ' + formattedTime);
        const Admissiontime=formattedDate + ' ' + formattedTime



        debugger
        if (!this._DischargeCancelService.DischargeForm.invalid) {
          const data = {
            'admissionID': this.AdmissionId,
            'admissionDate':formattedDate,// this.datePipe.transform(this._DischargeCancelService.DischargeForm.get('AdmissionDate').value, "yyyy-MM-dd"),
            'admissionTime':Admissiontime,// this.datePipe.transform(this._DischargeCancelService.DischargeForm.get('AdmissionTime').value, 'yyyy-MM-dd HH:mm'),
            'ipdno': this._DischargeCancelService.DischargeForm.get('NewIpdNo').value
          }
          console.log(data);
          this._DischargeCancelService.getDateTimeChange(data).subscribe(response => {
            this.resetform()

          });
        } else {
          const invalidFields = [];

          if (this._DischargeCancelService.DischargeForm.invalid) {
            for (const controlName in this._DischargeCancelService.DischargeForm.controls) {
              if (this._DischargeCancelService.DischargeForm.controls[controlName].invalid) {
                invalidFields.push(`MlcInfo Form: ${controlName}`);
              }
            }
          }
          if (invalidFields.length > 0) {
            invalidFields.forEach(field => {
              this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
              );
            });
          }
        }
      }
    });
  }

  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      const splitDate = dateOfReg.toLocaleString("en-US").split(',');
      const splitTime = this._DischargeCancelService.DischargeForm.get('AdmissionTime').value.toLocaleString("en-US").split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }
  onChangeTime(event) {
    if (event) {
      const selectedDate = new Date(this._DischargeCancelService.DischargeForm.get('AdmissionDate').value);
      const splitDate = selectedDate.toLocaleString("en-US").split(',');
      const splitTime = this._DischargeCancelService.DischargeForm.get('AdmissionTime').value.toLocaleString("en-US").split(',');
      this.isTimeChanged = true;
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    const localaDateValues = actualDate.split('/');
    const localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    // this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }



  resetform() {
    this._DischargeCancelService.DischargeForm.reset();
    this._DischargeCancelService.DischargeForm.get('Op_ip_id').setValue('1')
  
    this.patientInfoReset();
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
    this.vDepartment = ''
    this.vAgeMonth = ''
    this.vAgeDay = ''
    this.vRefDocName = ''
    this.vPatientType = ''
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }

} 