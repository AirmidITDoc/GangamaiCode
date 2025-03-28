import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';

import { AdmissionService } from '../admission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from '../admission.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';


@Component({
  selector: 'app-mlcinformation',
  templateUrl: './mlcinformation.component.html',
  styleUrls: ['./mlcinformation.component.scss']
})
export class MLCInformationComponent implements OnInit {

  MlcInfoFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  Personaldata=new AdmissionPersonlModel({});
  registerObj = new MlcDetail({})
 AdmissionId: any;
  public value = new Date();
  date: string;
  dateValue: any = new Date().toISOString();
  mlcid = 0;
 

  // DetailGiven: any;
  // Remark: any;
  Mlcdate: any;
  isTimeChanged: boolean = false;
  minDate: Date;
  timeflag=0;
  public now: Date = new Date();
  dateTimeString: any;
  phdatetime: any;
  constructor(public _AdmissionService: AdmissionService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
     private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<MLCInformationComponent>,
    private router: Router
  ) {
    this.date = new Date().toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    console.log(this.data);
    this.MlcInfoFormGroup = this.createmlcForm();
    if (this.data) {
      this.Personaldata = this.data;
      this.AdmissionId = this.Personaldata.admissionId;
   
      if ((this.data?.admissionId?? 0) > 0) {
        setTimeout(() => {
            this._AdmissionService.getMLCById(this.data.admissionId).subscribe((response) => {
              if(response.mlcid>0)
                this.registerObj = response;
               console.log(this.registerObj)
              
               });
        }, 500);
    }
   
    }
    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      if (!this.isTimeChanged) {
        this.MlcInfoFormGroup.get('reportingTime').setValue(this.now);
        if (this.MlcInfoFormGroup.get('reportingTime'))
          this.MlcInfoFormGroup.get('reportingTime').setValue(this.now);
      }
    }, 1);
  }

  createmlcForm() {
    return this.formBuilder.group({

      mlcid: 0,
      admissionId: 0,
      mlcno: "",
      reportingDate:  [(new Date()).toISOString()],
      reportingTime:[""],
      authorityName: "",
      buckleNo: "",
      policeStation: "",
      // Given:"",
      // Remark:""

    });
  }

  onSubmit() {
console.log(this.MlcInfoFormGroup.value)
this.MlcInfoFormGroup.get('reportingDate').setValue(this.datePipe.transform(this.MlcInfoFormGroup.get('reportingDate').value, 'yyyy-MM-dd'))
if(!this.MlcInfoFormGroup.invalid){
    this._AdmissionService.MlcInsert(this.MlcInfoFormGroup.value).subscribe((response) => {
        this.toastr.success(response.message);
      this.getMLCdetailview(response)
        this._matDialog.closeAll();
        this.onClear();
      }, (error) => {
        this.toastr.error(error.message);
      });
    }else {
      let invalidFields = [];
  
      if (this.MlcInfoFormGroup.invalid) {
        for (const controlName in this.MlcInfoFormGroup.controls) {
          if (this.MlcInfoFormGroup.controls[controlName].invalid) {
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
  getValidationMessages() {
    return {
      mlcno: [
        { name: "required", Message: "mlcno is required" }
      ],
      authorityName: [
        { name: "required", Message: "authorityName is required" }
      ],
      buckleNo: [
        { name: "required", Message: "buckleNo is required" }
      ],
      policeStation: [
        { name: "required", Message: "policeStation is required" }
      ]
    };
  }
  getMLCdetailview(AdmissionId=10){
    this.commonService.Onprint("AdmissionID", AdmissionId, "IpMLCCasePaperPrint");
  }


  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
    isDatePckrDisabled: boolean = false;
  
    onChangeDate(value) {
      if (value) {
        const dateOfReg = new Date(value);
        let splitDate = dateOfReg.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
        let splitTime = this.MlcInfoFormGroup.get('reportingDate').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
       this.eventEmitForParent(splitDate[0], splitTime[1]);
      }
    }
   
    onChangeTime(event) {
      this.timeflag=1
      if (event) {
  
        let selectedDate = new Date(this.MlcInfoFormGroup.get('reportingTime').value);
        let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
        let splitTime = this.MlcInfoFormGroup.get('reportingTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
        this.isTimeChanged = true;
        this.phdatetime=splitTime[1]
        console.log(this.phdatetime)
        this.eventEmitForParent(splitDate[0], splitTime[1]);
          }
    }
  
    eventEmitForParent(actualDate, actualTime) {
      let localaDateValues = actualDate.split('/');
      let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
      this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
    }
  onClear() { }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    this.dialogRef.close();
  }

}



export class MlcDetail {
  mlcid: any;
  admissionId: any;
  mlcno: any;
  reportingDate:any;
  reportingTime: any;
  authorityName: any;
  buckleNo: any;
  policeStation: any;
  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(MlcDetail) {
    {
      this.mlcid = MlcDetail.mlcid || 0;
      this.admissionId = MlcDetail.admissionId || 0;
      this.mlcno = MlcDetail.mlcno || '';
      this.reportingDate = MlcDetail.reportingDate || '';
      this.reportingTime = MlcDetail.reportingTime || '';
      this.authorityName = MlcDetail.authorityName || '';
      this.buckleNo = MlcDetail.buckleNo || '';
      this.policeStation = MlcDetail.policeStation || '';

    }
  }
}