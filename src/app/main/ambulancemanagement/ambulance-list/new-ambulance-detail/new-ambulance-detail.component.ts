import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AmbulanceListService } from '../ambulance-list.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from 'app/main/opd/registration/registration.component';

@Component({
  selector: 'app-new-ambulance-detail',
  templateUrl: './new-ambulance-detail.component.html',
  styleUrls: ['./new-ambulance-detail.component.scss']
})
export class NewAmbulanceDetailComponent {
  AmbulanceFormGroup: FormGroup;
  searchFormGroup: FormGroup
  registerObj = new RegInsert({});
  PatientName: any
  RegId1: any
  public now: Date = new Date();
   minDate: Date;
  dateTimeString: any;
  dateTimeObj: any;
  screenFromString = 'Common-form';

    @Output() dateTimeEventEmitter = new EventEmitter<{}>();
    isDatePckrDisabled: boolean = false;
  

  constructor(public _AmbulanceListService: AmbulanceListService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<NewAmbulanceDetailComponent>,
    // private router: Router

  ) {
    // this.date = new Date().toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    console.log(this.data);
    this.AmbulanceFormGroup = this.ambulanceallocaterForm();
    this.AmbulanceFormGroup.markAllAsTouched();
    this.searchFormGroup = this.createSearchForm();
    if (this.data) {
      // this.Personaldata = this.data;
      // this.AdmissionId = this.Personaldata.admissionId;
    }

      setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
     
    }, 1);
  }

  createSearchForm() {
    return this.formBuilder.group({
      RegId: 0

    });
  }

  ambulanceallocaterForm(): FormGroup {
    return this.formBuilder.group({
      BillNo: '',
      admissionId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      PatientName: '',
    
      VechicleNo: ['',Validators.required],
      VechicleModel:['',Validators.required],
      DriverName:['',Validators.required],
      driverContactno:['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
      PatientAddress:['',Validators.required],
      Date: [(new Date()).toISOString()],
      Amount: '',
      PaidAmt: '',
      BalAmt: '',
      Remark:'',
      reportingDate: [(new Date()).toISOString()],
      reportingTime:['']
    });
  }



  getSelectedObj(obj) {
    console.log(obj)
    this.RegId1 = obj.regID;
    this.registerObj = obj;
    this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName
   
  }

  onSubmit(){}
  onClose(){}
  getValidationMessages() {
    return {
      VechicleNo: [
        { name: "required", Message: "VechicleNo is required" }
      ],
      VechicleModel: [
        { name: "required", Message: "VechicleModel is required" }
      ],
      DriverName: [
        { name: "required", Message: "DriverName is required" }
      ],
      driverContactno: [
        { name: "required", Message: "driverContactno is required" }
      ],
       PatientAddress: [
        { name: "required", Message: "PatientAddress is required" }
      ],
      BillNo: [
        { name: "required", Message: "BillNo is required" }
      ],
      // DriverName: [
      //   { name: "required", Message: "DriverName is required" }
      // ],
      // driverContactno: [
      //   { name: "required", Message: "driverContactno is required" }
      // ]
    };
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
   onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.AmbulanceFormGroup.get('reportingDate').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  onChangeTime(event) {
    
    if (event) {

      let selectedDate = new Date(this.AmbulanceFormGroup.get('reportingTime').value);
      let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.AmbulanceFormGroup.get('reportingTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }
  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }
}
