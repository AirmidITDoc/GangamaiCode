import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDetailObj, Discharge, IPSearchListComponent } from '../ip-search-list.component';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
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
import { T } from '@angular/cdk/keycodes';
import { ConfigService } from 'app/core/services/config.service';
import { AdmissionPersonlModel, RegInsert } from '../../Admission/admission/admission.component';
import { InitiateDischargeComponent } from './initiate-discharge/initiate-discharge.component';

@Component({
  selector: 'app-discharge',
  templateUrl: './discharge.component.html',
  styleUrls: ['./discharge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargeComponent implements OnInit {

  
  isLoading: string = '';
  DischargeForm:FormGroup;
  currentDate = new Date();
  // screenFromString = 'discharge';
  screenFromString = 'OP-billing';
  selectedAdvanceObj: AdvanceDetailObj;
  DischargeId: any;
  Today: Date = new Date();
  

  RtrvDischargeList:any=[];
  vComments:any;
  IsCancelled:any;
  dateTimeObj: any;
  vAdmissionId:any; 
  vMode:any=0;
  vDoctorId:any=0;
  vDescType:any=0;
  vAdmissionID:any=20;
  vBedId=101;

  isTimeChanged: boolean = false;
  dateTimeString: any;
  timeflag=0
  public now: Date = new Date();
  minDate: Date;
  ChkConfigInitiate:boolean=false;

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
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<DischargeComponent>,
    public toastr: ToastrService,
    public _ConfigService : ConfigService,
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
    this.DischargeForm=this._IpSearchListService.DischargesaveForm();
    if (this.data) { 
      this.vAdmissionId = this.data.admissionId;
   this.vBedId=this.data.bedId
    } 

    if ((this.data?.regId ?? 0) > 0) {
     
      setTimeout(() => {
        this._IpSearchListService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj= response;
          console.log(this.registerObj)

        });

        this._IpSearchListService.getAdmissionById(this.data.admissionId).subscribe((response) => {
          this.registerObj1 = response;
          if(this.registerObj1){
            this.registerObj1.phoneNo=this.registerObj1.phoneNo.trim()
            this.registerObj1.mobileNo=this.registerObj1.mobileNo.trim()
          this.registerObj1.admissionTime=  this.datePipe.transform(this.registerObj1.admissionTime, 'hh:mm:ss a')
          this.registerObj1.dischargeTime=  this.datePipe.transform(this.registerObj1.dischargeTime, 'hh:mm:ss a')
     
          }
          console.log(this.registerObj1)

        });


      }, 500);
    }

    // if(this._ConfigService.configParams.IsDischargeInitiateflow == 1){
    //   this.ChkConfigInitiate = false
    // }else{
    //   this.ChkConfigInitiate = true
    // }

    this.getchkConfigInitiate();
  }


 
 
 onDischarge() {
    this.isLoading = 'submit';

    const formattedDate = this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd");
    const formattedTime = formattedDate+this.dateTimeObj.time;

 
    if (!this.DischargeId) {
      var m_data = {
        "dischargeModel":this.DischargeForm.value,
        "dischargeAdmissionModel": {
          "admissionID": this.vAdmissionID,
          "isDischarged": 1,
          "dischargeDate":formattedDate || '01/01/1900', // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || '01/01/1900',
          "dischargeTime":formattedTime || '01/01/1900',//this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900', 
        },
        "bedModel": {
          "bedId":  this.vBedId,
        }
      }
console.log(m_data);
      this._IpSearchListService.DichargeInsert(m_data).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
  
    }
  
    this.DischargeForm.reset();
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
@Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;
phdatetime: any;
  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.DischargeForm.get('dischargeDate').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
     this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }
 
  onChangeTime(event) {
    this.timeflag=1
    if (event) {

      let selectedDate = new Date(this.DischargeForm.get('phAppTime').value);
      let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.DischargeForm.get('dischargeTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
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
  dateTimeControl = new FormControl('');
  selectedTime: string | null = null;
  onClose() {
    this.DischargeForm.reset();
    this.dialogRef.close();
  }
  DischargedateTimeObj: any;
  getDischargeDateTime(DischargedateTimeObj) {
    this.DischargedateTimeObj = DischargedateTimeObj;
  }

  onClear(val: boolean) {
    // this.personalform.reset();
    
   }
  getchkConfigInitiate() {
    // let Query = "SELECT Isnull(Count(IsApproved),0)as DeptCount,(SELECT Isnull(Count(b.IsApproved),0)as TotalCnt FROM dbo.initiateDischarge B Where b.AdmId=A.AdmId and b.IsApproved = 1)as Approved_Cnt " +
    //   " FROM dbo.initiateDischarge A Where AdmId=" + this.selectedAdvanceObj.AdmissionID + " Group by AdmId"
    // console.log(Query)
    // this._IpSearchListService.getchkConfigInitiate(Query).subscribe((data) => {
    //   console.log(data)
    //   if(data){
    //     this.vApproved_Cnt = data[0]?.Approved_Cnt
    //     this.vDeptCount = data[0]?.DeptCount
    //     console.log(this.vApproved_Cnt)
    //     console.log(this.vDeptCount)
    //   } 
    // })
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



