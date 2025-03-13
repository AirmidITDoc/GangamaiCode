import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDetailObj, Discharge, IPSearchListComponent } from '../ip-search-list.component';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IPSearchListService } from '../ip-search-list.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { DatePipe } from '@angular/common';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { T, V } from '@angular/cdk/keycodes';
import { ConfigService } from 'app/core/services/config.service';
import { AdmissionPersonlModel, RegInsert } from '../../Admission/admission/admission.component';
import { InitiateDischargeComponent } from './initiate-discharge/initiate-discharge.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
  selector: 'app-discharge',
  templateUrl: './discharge.component.html',
  styleUrls: ['./discharge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargeComponent implements OnInit {


  isLoading: string = '';
  DischargeForm: FormGroup;
  currentDate = new Date();
  // screenFromString = 'discharge';
  screenFromString = 'OP-billing';
  selectedAdvanceObj: AdvanceDetailObj;
  DischargeId: any = 0;
  Today: Date = new Date();


  RtrvDischargeList: any = [];
  vComments: any;
  IsCancelled: any;
  dateTimeObj: any;
  vAdmissionId: any;
  vMode: any = 0;
  vDoctorId: any = 0;
  vDescType: any = 0;
  vBedId = 0;

  isTimeChanged: boolean = false;
  dateTimeString: any;
  timeflag = 0
  public now: Date = new Date();
  minDate: Date;
  ChkConfigInitiate: boolean = false;

  registerObj1 = new AdmissionPersonlModel({});
  registerObj = new RegInsert({});


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  // New Api
  autocompletcondoc: string = "ConDoctor";
  autocompletedichargetype: string = "DichargeType";
  autocompletemode: string = "Mode";

  constructor(
    public _IpSearchListService: IPSearchListService,
    private _formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<DischargeComponent>,
    public toastr: ToastrService,
    public _ConfigService: ConfigService,
     private commonService: PrintserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      if (!this.isTimeChanged) {
        this.DischargeForm.get('dischargeTime').setValue(this.now);
        if (this.DischargeForm.get('dischargeTime'))
          this.DischargeForm.get('dischargeTime').setValue(this.now);
      }
    }, 1);

  }

  ngOnInit(): void {
    this.DischargeForm = this.DischargesaveForm();
    console.log(this.data)
    if (this.data) {
      this.vAdmissionId = this.data.admissionId;
      this.vBedId = this.data.bedId
      this.getdischargeIdbyadmission()
    }

    if ((this.data?.regId ?? 0) > 0) {

      setTimeout(() => {
        this._IpSearchListService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)

        });

        // this._IpSearchListService.getAdmissionById(this.data.admissionId).subscribe((response) => {
        //   this.registerObj1 = response;
        //   if (this.registerObj1) {
        //     this.registerObj1.phoneNo = this.registerObj1.phoneNo.trim()
        //     this.registerObj1.mobileNo = this.registerObj1.mobileNo.trim()
        //     this.registerObj1.admissionTime = this.datePipe.transform(this.registerObj1.admissionTime, 'hh:mm:ss a')
        //     this.registerObj1.dischargeTime = this.datePipe.transform(this.registerObj1.dischargeTime, 'hh:mm:ss a')

        //   }
        //   console.log(this.registerObj1)

        // });


      }, 500);
    }



    // if(this._ConfigService.configParams.IsDischargeInitiateflow == 1){
    //   this.ChkConfigInitiate = false
    // }else{
    //   this.ChkConfigInitiate = true
    // }

    this.getchkConfigInitiate();
  }


  getdischargeIdbyadmission() {
    debugger
    this._IpSearchListService.getDischargeId(this.data.admissionId).subscribe(data => {
      console.log(data)

      if (data) {
        this.IsCancelled = data.isCancelled || 0
        // if (this.IsCancelled == '1') {
        // this.DischargeId = 0
        // } else {
        this.DischargeId = data.dischargeId || 0
        // }


        this.DischargeForm.get("dischargedDocId").setValue(data.dischargedDocId)
        this.DischargeForm.get("dischargeTypeId").setValue(data.dischargeTypeId)
        this.DischargeForm.get("dischargedRmoid").setValue(data.dischargedRmoid)

      }

    });
  }


  DischargesaveForm(): FormGroup {
    return this._formBuilder.group({

      dischargeId: this.DischargeId,
      // admissionId: this.data.admissionId,
      dischargeDate: "2029-09-07",
      dischargeTime: "",
      dischargeTypeId: 0,
      dischargedDocId: 0,
      dischargedRmoid: 10,
      addedBy: 1
    });
  }

  onDischarge() {
    console.log(this.DischargeForm.value)

    let dischargModeldata = {};

    dischargModeldata['dischargeDate'] = (this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd')),
      dischargModeldata['dischargeTime'] = this.dateTimeObj.time
    dischargModeldata['dischargeTypeId'] = this.DischargeForm.get("dischargedDocId").value || 0,
      dischargModeldata['dischargedDocId'] = this.DischargeForm.get("dischargeTypeId").value || 0,
      dischargModeldata['dischargedRmoid'] = 1,//this.DischargeForm.get("dischargedRmoid").value || 0,
      dischargModeldata['addedBy'] = 1
    dischargModeldata['dischargeId'] = this.DischargeId
    dischargModeldata['admissionId'] = this.vAdmissionId
    debugger
    if (this.DischargeId == 0){
      dischargModeldata['admissionId'] = this.vAdmissionId
    var m_data = {
      "discharge": dischargModeldata,
      "admission": {
        "admissionId": this.vAdmissionId,
        "isDischarged": 1,
        "dischargeDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
        "dischargeTime": this.dateTimeObj.time
      },
      "bed": {
        "bedId": this.vBedId,
      }
    }
    console.log(m_data)

    this._IpSearchListService.DichargeInsert(m_data).subscribe((response) => {
      this.toastr.success(response.message);
      console.log(response)
      this.viewgetDischargeSlipPdf(response.admissionId)
      this._matDialog.closeAll();
    }, (error) => {
      this.toastr.error(error.message);
    });
  }else if (this.DischargeId != 0){
      dischargModeldata['modeOfDischargeId'] = 1
      dischargModeldata['modifiedBy'] = 1

      var m_data1 = {
        "discharge": dischargModeldata,
        "admission": {
          "admissionId": this.vAdmissionId,
          "isDischarged": 1,
          "dischargeDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
          "dischargeTime": this.dateTimeObj.time
        }
      }
  
        this._IpSearchListService.DichargeUpdate(m_data1).subscribe((response) => {
        this.toastr.success(response.message);
        console.log(response)
        this.viewgetDischargeSlipPdf(response.admissionId)
        this._matDialog.closeAll();
      }, (error) => {
        this.toastr.error(error.message);
      });
    }
    this.DischargeForm.reset();
  }

  viewgetDischargeSlipPdf(data) {

    this.commonService.Onprint("AdmId", data, "IpDischargeReceipt");
}
  getValidationMessages() {
    return {
      dischargeTypeId: [
        { name: "required", Message: "dischargeType Name is required" }
      ],
      dischargedDocId: [
        { name: "required", Message: "Doctor Name is required" }
      ],
      dischargedRmoid: [
        { name: "required", Message: "Mode Name is required" }
      ]
    };
  }

  onClose() {
    this.DischargeForm.reset();
    this.dialogRef.close();
  }

  onClear(val: boolean) {
    // this.personalform.reset();

  }

  vApproved_Cnt:any;
  vDeptCount:any;
  getchkConfigInitiate() {
   var data={

   }
    this._IpSearchListService.getchkConfigInitiate(data).subscribe((data) => {
      console.log(data)
      if(data){
        this.vApproved_Cnt = data[0]?.Approved_Cnt
        this.vDeptCount = data[0]?.DeptCount
        console.log(this.vApproved_Cnt)
        console.log(this.vDeptCount)
      } 
    })
  }


  DischargeInitiate() {
    // if(this.selectedAdvanceObj.IsInitinatedDischarge == '1'){
    //   this.toastr.warning('selected patient already Initiated ', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    
    const dialogRef = this._matDialog.open(InitiateDischargeComponent,
      {
        maxWidth: "50vw",
        height: '72%',
        width: '100%',
        data: {
          Obj: this.data
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}



