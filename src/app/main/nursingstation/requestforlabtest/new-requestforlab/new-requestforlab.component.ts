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

  dstable1 = new MatTableDataSource<LabRequest>();
  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  vAdmissionID: any;
  date: Date;


  constructor(private _FormBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<NewRequestforlabComponent>,
    private _matDialog: MatDialog,
    public _RequestforlabtestService: RequestforlabtestService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
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
  }
  tariffId = "0";
  groupId = "0";
  getServiceList() {
    debugger
    let ServiceName = this.myFormGroup.get("ServiceId").value + "%" || '%';
    if (this.vRegNo) {
      var param = {
        sortField: "ServiceId",
        sortOrder: 0,
        filters: [
          { fieldName: "ServiceName", fieldValue: ServiceName, opType: OperatorComparer.Contains },
          { fieldName: "TariffId", fieldValue: this.tariffId, opType: OperatorComparer.Equals },
          { fieldName: "GroupId", fieldValue: this.groupId, opType: OperatorComparer.Equals },
          { fieldName: "Start", fieldValue: "1", opType: OperatorComparer.Equals },
          { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
        ],
        row: 125
      }
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
    debugger
    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vRegNo = obj.regNo
      this.vRegId = obj.regID
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
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
      this.vDOA = obj.admissionDate
      setTimeout(() => {
        this._RequestforlabtestService.getAdmittedpatientlist(obj.regID).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)

          // call service list function
          this.getServiceList();
        });
      }, 500);
    }
  }

  onEdit(row) {
    console.log(row);
    this.registerObj = row;
    // this.getSelectedObj(row);
  }

  // getServiceListdata() {
  //   // 
  //   if (this.RegNo) {
  //     this.sIsLoading = ''
  //     var Param = {
  //       "ServiceName": `${this.myFormGroup.get('ServiceId').value}%` || '%',
  //       "IsPathRad": parseInt(this.myFormGroup.get('IsPathRad').value) || 0,
  //       "ClassId": this.vClassId || 0,
  //       "TariffId": this.vTariffId || 0
  //     }
  //     console.log(Param);
  //     this._RequestforlabtestService.getServiceListDetails(Param).subscribe(data => {
  //       this.dsLabRequest2.data = data as LabRequest[];
  //       // this.chargeslist = data as LabRequestList[];
  //       this.dsLabRequest2.data = data as LabRequest[];
  //       console.log(this.dsLabRequest2)
  //       this.sIsLoading = '';
  //     },
  //       error => {
  //         this.sIsLoading = '';
  //       });
  //   }
  //   else {
  //     if (!this.searchFormGroup.get('RegID')?.value && !this.registerObj?.RegId) {
  //       this.toastr.warning('Please Select Patient', 'Warning!', {
  //         toastClass: 'tostr-tost custom-toast-warning',
  //       });
  //       return;
  //     }

  //     // this.toastr.warning('Please select patient ', 'Warning !', {
  //     //   toastClass: 'tostr-tost custom-toast-warning',
  //     // });
  //   }

  // }

  onChangeReg(event) {
    if (event.value == 'registration') {
      this.registerObj = new RegInsert({});
      this.searchFormGroup.get('RegId').disable();
    }
    else {
      this.isRegSearchDisabled = false;
    }
  }


  viewgetLabrequestReportPdf(RequestId) {
    setTimeout(() => {
      this.SpinLoading = true;
      //  this.AdList=true;
      this._RequestforlabtestService.getLabrequestview(
        RequestId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Lab request Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
      });

    }, 100);
  }

  onSaveEntry(row) {
    debugger
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
    debugger
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
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
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
    this.isLoading = 'submit';
    this.savebtn = true;
    let submissionObj = {};
    let ipPathOrRadiRequestInsertArray = {};
    let ipPathOrRadiRequestLabRequestInsertArray = [];

    ipPathOrRadiRequestInsertArray['reqDate'] = formattedDate;
    ipPathOrRadiRequestInsertArray['reqTime'] = formattedTime;
    ipPathOrRadiRequestInsertArray['oP_IP_ID'] = this.vAdmissionID || 0;
    ipPathOrRadiRequestInsertArray['oP_IP_Type'] = 1;
    ipPathOrRadiRequestInsertArray['isAddedBy'] = this._loggedService.currentUserValue.userId;
    ipPathOrRadiRequestInsertArray['isCancelled'] = 0;
    ipPathOrRadiRequestInsertArray['isCancelledBy'] = 0;
    ipPathOrRadiRequestInsertArray['isCancelledDate'] = formattedDate;
    ipPathOrRadiRequestInsertArray['isCancelledTime'] = formattedTime;
    ipPathOrRadiRequestInsertArray['IsOnFileTest'] = this.myFormGroup.get('IsOnFileTest').value || 0;
    ipPathOrRadiRequestInsertArray['requestId '] = 0

    this.dstable1.data.forEach((element) => {
      let ipPathOrRadiRequestLabRequestInsert = {};
      ipPathOrRadiRequestLabRequestInsert['requestId'] = 0;
      ipPathOrRadiRequestLabRequestInsert['serviceId'] = element.ServiceId;
      ipPathOrRadiRequestLabRequestInsert['price'] = element.Price;
      ipPathOrRadiRequestLabRequestInsert['isStatus'] = false;
      ipPathOrRadiRequestLabRequestInsert['IsOnFileTest'] = false;
      ipPathOrRadiRequestLabRequestInsertArray.push(ipPathOrRadiRequestLabRequestInsert);
    });

    submissionObj = {
      'ipPathOrRadiRequestInsert': ipPathOrRadiRequestInsertArray,
      'ipPathOrRadiRequestLabRequestInsert': ipPathOrRadiRequestLabRequestInsertArray
    }
    console.log(submissionObj);
    this._RequestforlabtestService.LabRequestSave(submissionObj).subscribe(response => {
      console.log(response);
      if (response) {
        this.toastr.success('Lab Request Saved Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.savebtn = true;
        this.viewgetLabrequestReportPdf(response);
        this.onClose();
      } else {
        this.toastr.error('Record Not Saved!', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
      this.isLoading = '';
    }, error => {
      this.toastr.error('API Error!', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
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

