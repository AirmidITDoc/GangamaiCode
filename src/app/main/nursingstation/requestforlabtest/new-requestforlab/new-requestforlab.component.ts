import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { RequestforlabtestService } from '../requestforlabtest.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-new-requestforlab',
  templateUrl: './new-requestforlab.component.html',
  styleUrls: ['./new-requestforlab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestforlabComponent implements OnInit {
  isServiceIdSelected: boolean = false;
  isRegSearchDisabled: boolean;
  registerObj = new RegInsert({});
  PatientName: any;
  RegId: any;
  DoctorName: any;
  registration: any;
  isLoading: String = '';
  sIsLoading: string = "";
  CompanyName: any;
  vTariffId: any = 0;
  vClassId: any = 0;
  vAge: any = 0;
  selectedAdvanceObj = new AdmissionPersonlModel({});
  vRegNo: any;
  vPatientName: any;
  vAdmissionDate: any;
  vIPDNo: any;
  vTariffName: any;
  vCompanyName: any;
  vDoctorName: any;
  vRoomName: any;
  vBedName: any;
  vGenderName: any;
  vAdmissionTime: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartment: any;
  vRefDocName: any;
  vPatientType: any;
  vDOA: any;
  vRegId: any;
  currentDate = new Date();
  myFormGroup: FormGroup;
  labRequestInsert: FormGroup;
  labReqFormArray: FormGroup;
  vAdmissionID = 0;
  date: Date;

  displayedServiceColumns: string[] = [
    'ServiceName',
    'Action'
  ]

  displayedServiceselected: string[] = [
    'ServiceName',
    'Price',
    'buttons'
  ]

  dstable1 = new MatTableDataSource<LabRequest>();
  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _FormBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<NewRequestforlabComponent>,
    private _matDialog: MatDialog,
    public _RequestforlabtestService: RequestforlabtestService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _loggedService: AuthenticationService) {
    this.date = new Date();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
    }
  }

  ngOnInit(): void {

    this.myFormGroup = this.createMyForm();
    this.myFormGroup.markAllAsTouched();

    this.labRequestInsert = this.labRequestInsertForm();
    this.labRequestInsert.markAllAsTouched();

    this.labReqFormArray=this.createlabRequestFormArray();
    this.labReqFormArray.markAllAsTouched();
    this.labeRequestArray.push(this.createlabRequestFormArray());
  }
 
  getServiceList() {
    // debugger
    let ServiceName = this.myFormGroup.get("ServiceId").value + "%" || "%";
    let IsPathRad = this.myFormGroup.get("IsPathRad").value || "3"
    if (this.vRegNo) {
      var param ={
        "first": 0,
        "rows": 10,
        "sortField": "ServiceId",
        "sortOrder": 0,
        "filters": [
          {
            "fieldName": "ServiceName",
            "fieldValue": ServiceName,
            "opType": "Equals"
          },
          {
            "fieldName": "TariffId",
            "fieldValue": String(this.vTariffId),
            "opType": "Equals"
          },
          {
            "fieldName": "IsPathRad",
            "fieldValue": String(IsPathRad),
            "opType": "Equals"
          },
          {
            "fieldName": "ClassId",
            "fieldValue": String(this.vClassId),
            "opType": "Equals"
          }
        ],
        "Columns":[],
        "exportType": "JSON"
      }
      console.log(param)
      
      this._RequestforlabtestService.getserviceList(param).subscribe(Menu => {

        this.dsLabRequest2.data = Menu.data as LabRequest[];
        this.dsLabRequest2.sort = this.sort;
        this.dsLabRequest2.paginator = this.paginator;
        console.log(this.dsLabRequest2.data)
      });
    } else {
      if (!this.myFormGroup.get('RegID')?.value && !this.vRegId) {
        this.toastr.warning('Please Select Patient', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
  }

  createMyForm(): FormGroup {
    return this._FormBuilder.group({
      IsPathRad: ['3'],
      ServiceId: [''],
      isOnFileTest: false,
      RegID: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      radioIp: ['1']
    })
  }

  labRequestInsertForm(): FormGroup {
    return this._FormBuilder.group({
      requestId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      reqDate:[(new Date()).toISOString().split('T')[0]],
      reqTime:[(new Date()).toISOString()],
      opIpId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      opIpType:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      isAddedBy:this._loggedService.currentUserValue.userId,
      isCancelled:false,
      isCancelledBy:0,
      isCancelledDate:['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],//[(new Date()).toISOString().split('T')[0]],
      isCancelledTime:[(new Date()).toISOString()],
      isType:0,
      isOnFileTest:false,
      tDlabRequests:this._FormBuilder.array([]),
    })
  }

    createlabRequestFormArray(element: any = {}): FormGroup {
      return this._FormBuilder.group({
        reqDetId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        requestId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        serviceId: [Number(element.ServiceId) ?? 0],
        price: [element.Price ?? 0],
        isStatus: false,
        addedBillingId: 0,
        addedByDate:  [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
        addedByTime: [this.datePipe.transform(new Date(), 'shortTime')],
        charId: [0], //260570
        isTestCompted: false,
        isOnFileTest: [this.myFormGroup.get('isOnFileTest').value || false],
      });
    }
  
    get labeRequestArray(): FormArray {
      return this.labRequestInsert.get('tDlabRequests') as FormArray;
    }
    
  OnSave() {
    debugger
    console.log(this.labRequestInsert.value)

    if(!this.labRequestInsert.invalid){

      this.labeRequestArray.clear();
      if (this.dstable1.data.length === 0) {
        this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning');
        return;
      }
      this.dstable1.data.forEach(item => {
        this.labeRequestArray.push(this.createlabRequestFormArray(item));
      });

    
      this.labRequestInsert.get("opIpId").setValue(this.vAdmissionID)
      this.labRequestInsert.get("isOnFileTest").setValue(this.myFormGroup.get('isOnFileTest').value)
      
      console.log(this.labRequestInsert.value)
      this._RequestforlabtestService.LabRequestSave(this.labRequestInsert.value).subscribe(response => {
              if (response) {
                this.viewgetLabrequestReportPdf(response)
                this._matDialog.closeAll();
              }
            });
    }else {
      let invalidFields: string[] = [];

      if (this.labRequestInsert.invalid) {
        for (const controlName in this.labRequestInsert.controls) {
          const control = this.labRequestInsert.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Nested: ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`MainForm: ${controlName}`);
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
  
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getSelectedObjIP(obj) {

    console.log(obj)
    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vRegNo = obj.regNo
      this.vRegId = obj.regID
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment = obj.departmentName
      this.vAdmissionDate = obj.admissionDate
      this.vAdmissionTime = obj.admissionTime
      this.vAdmissionID = obj.admissionID
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
      this.vDOA = obj.admissionDate
      this.vTariffId=obj.tariffId
      this.vClassId=obj.classId
    }
    this.getServiceList();
  }

  onEdit(row) {
    console.log(row);
    this.registerObj = row;
  }

  onChangeReg(event) {
    if (event.value == 'registration') {
      this.registerObj = new RegInsert({});
      this.myFormGroup.get('RegID').disable();
    }
    else {
      this.isRegSearchDisabled = false;
    }
  }

  viewgetLabrequestReportPdf(requestId) {
    this.commonService.Onprint("RequestId", requestId, "NurLabRequestTest");
  }

  onSaveEntry(row) {

    this.isLoading = 'save';
    this.dstable1.data = [];
    if (this.chargeslist && this.chargeslist.length > 0) {
      let duplicateItem = this.chargeslist.filter((ele, index) => ele.ServiceId === row.serviceId);
      if (duplicateItem && duplicateItem.length == 0) {
        this.addChargList(row);
        return;
      }
      this.isLoading = '';
      this.dstable1.data = this.chargeslist;
      this.dstable1.sort = this.sort;
      this.dstable1.paginator = this.paginator;
    } else if (this.chargeslist && this.chargeslist.length == 0) {
      this.addChargList(row);
    }
    else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }

  addChargList(row) {
    this.chargeslist.push(
      {
        ServiceId: row.serviceId,
        ServiceName: row.serviceName,
        Price: row.price || 0
      });
    this.isLoading = '';
    console.log(this.chargeslist);
    this.dstable1.data = this.chargeslist;
    this.dstable1.sort = this.sort;
    this.dstable1.paginator = this.paginator;
  }

  deleteTableRow(element) {
    this.chargeslist = this.dstable1.data;
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dstable1.data = [];
      this.dstable1.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  onClose() {
    this.dialogRef.close();
    this.myFormGroup.reset();
    this.dsLabRequest2.data = [];
    this.dstable1.data = [];
  }

  onClear(val: boolean) {
    this.myFormGroup.reset();
    this.dialogRef.close(val);
  }
}

export class LabRequest {
  ServiceName: any;
  Price: number;
  ServiceId: any;
  constructor(LabRequest) {
    this.ServiceName = LabRequest.ServiceName || '';
    this.Price = LabRequest.Price || 0;
    this.ServiceId = LabRequest.ServiceId || 0;
  }
}

