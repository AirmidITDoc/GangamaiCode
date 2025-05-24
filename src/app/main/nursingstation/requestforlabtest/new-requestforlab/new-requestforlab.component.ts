import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { RequestforlabtestService } from '../requestforlabtest.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { OperatorComparer } from 'app/core/models/gridRequest';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';


@Component({
  selector: 'app-new-requestforlab',
  templateUrl: './new-requestforlab.component.html',
  styleUrls: ['./new-requestforlab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestforlabComponent implements OnInit {

  isRegIdSelected: boolean = false;
  isServiceIdSelected: boolean = false;
  isRegSearchDisabled: boolean;
  isServiceSearchDisabled: boolean;
  filteredOptions: any;
  PatientListfilteredOptions: any;
  noOptionFound: boolean = false;
  registerObj = new RegInsert({});
  PatientName: any;
  RegId: any;
  DoctorName: any;
  registration: any;
  isLoading: String = '';
  sIsLoading: string = "";
  matDialogRef: any;
  SpinLoading: boolean = false;
  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  vOPIPId: any = 0;
  vOPDNo: any = 0;
  vTariffId: any = 0;
  vClassId: any = 0;
  vAge: any = 0;
  selectedAdvanceObj = new AdmissionPersonlModel({});
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
  displayedServiceColumns: string[] = [
    'ServiceName',
    'Action'
  ]

  displayedServiceselected: string[] = [
    'ServiceName',
    'Price',
    'buttons'
  ]

  searchFormGroup: FormGroup;
  myFormGroup: FormGroup;
  labReqForm: FormGroup;

  dstable1 = new MatTableDataSource<LabRequest>();
  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  vAdmissionID = 0;
  date: Date;


  constructor(private _FormBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<NewRequestforlabComponent>,
    private _matDialog: MatDialog,
    public _RequestforlabtestService: RequestforlabtestService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    private commonService: PrintserviceService,
    private _loggedService: AuthenticationService) {
    this.date = new Date();
    if (this.advanceDataStored.storage) {

      this.selectedAdvanceObj = this.advanceDataStored.storage;
      // this.PatientHeaderObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
    }
  }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.myFormGroup = this.createMyForm();
    this.labReqForm = this.labRequestForm();
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
            "fieldValue": IsPathRad,
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
      if (!this.searchFormGroup.get('RegID')?.value && !this.vRegId) {
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
      ServiceName1: '',
      Price1: '',
      ServiceId: '',
      ServiceName2: '',
      Price2: '',
      PatientName: '',
      RegId: '',
      AdmissionID: 0,
      Requestdate: '',
      IsOnFileTest: '',
      NameSearch: ''
    })
  }

  labRequestForm(): FormGroup {
    return this._FormBuilder.group({
      requestId:0,
      reqDate:[(new Date()).toISOString().split('T')[0]],
      reqTime:[(new Date()).toISOString()],
      opIpId:0,
      opIpType:1,
      isAddedBy:this._loggedService.currentUserValue.userId,
      isCancelled:true,
      isCancelledBy:this._loggedService.currentUserValue.userId,
      isCancelledDate:[(new Date()).toISOString().split('T')[0]],
      isCancelledTime:[(new Date()).toISOString()],
      isType:0,
      isOnFileTest:false,
      tDlabRequests:""
    })
  }

  createSearchForm(): FormGroup {
    return this._FormBuilder.group({
      RegID: [''],
      radioIp: ['1']
    });
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
    // this.getSelectedObj(row);
  }


  onChangeReg(event) {
    if (event.value == 'registration') {
      this.registerObj = new RegInsert({});
      this.searchFormGroup.get('RegId').disable();
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

  savebtn: boolean = false;
  OnSave() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'hh:mm:ssa');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    
    if ((this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined)) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((!this.dstable1.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    let submissionObj = {};

    if (this.vAdmissionID != 0 && this.dstable1.data.length != 0) {
      let ipPathOrRadiRequestLabRequestInsertArray = [];
      this.dstable1.data.forEach((element) => {
        console.log(element)
        let ipPathOrRadiRequestLabRequestInsert = {};
        ipPathOrRadiRequestLabRequestInsert['reqDetId'] = 0;
        ipPathOrRadiRequestLabRequestInsert['requestId'] = 0;
        ipPathOrRadiRequestLabRequestInsert['serviceId'] = element.ServiceId || 1;
        ipPathOrRadiRequestLabRequestInsert['price'] = element.Price || 1;
        ipPathOrRadiRequestLabRequestInsert['isStatus'] = false;
        ipPathOrRadiRequestLabRequestInsert['addedBillingId'] = 2,
        ipPathOrRadiRequestLabRequestInsert['addedByDate'] = formattedDate,
        ipPathOrRadiRequestLabRequestInsert['addedByTime'] = formattedTime,
        ipPathOrRadiRequestLabRequestInsert['charId'] = 260570,
        // ipPathOrRadiRequestLabRequestInsert['charId'] = 0,
        ipPathOrRadiRequestLabRequestInsert['isTestCompted'] = false,
        ipPathOrRadiRequestLabRequestInsert['IsOnFileTest'] = this.myFormGroup.get('IsOnFileTest').value || false;
        ipPathOrRadiRequestLabRequestInsertArray.push(ipPathOrRadiRequestLabRequestInsert);
      });

      this.labReqForm.get("opIpId").setValue(this.vAdmissionID)
      this.labReqForm.get("isOnFileTest").setValue(this.myFormGroup.get('IsOnFileTest').value)
      this.labReqForm.get("tDlabRequests").setValue(ipPathOrRadiRequestLabRequestInsertArray)
      console.log(this.labReqForm.value)

      this._RequestforlabtestService.LabRequestSave(this.labReqForm.value).subscribe(response => {
        this.toastr.success(response.message);
        console.log(response)
        if (response) {
          this.viewgetLabrequestReportPdf(response)
          this._matDialog.closeAll();
        }
      },(error)=>{
         this.toastr.error(error.message);
      });
    }
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

