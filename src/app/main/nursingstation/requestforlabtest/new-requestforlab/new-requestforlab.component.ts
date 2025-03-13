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

  dstable1 = new MatTableDataSource<LabRequest>();
  dsLabRequest2 = new MatTableDataSource<LabRequest>();
  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  vAdmissionID=0;
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
  }
  tariffId = "0";
  groupId = "0";
  getServiceList() {
    
    let ServiceName = this.myFormGroup.get("ServiceId").value + "%" || '%';
    if (this.vRegNo) {
      var param = {
        sortField: "ServiceId",
        sortOrder: 0,
        filters: [
          { fieldName: "ServiceName", fieldValue: ServiceName, opType: OperatorComparer.Contains },
          { fieldName: "TariffId", fieldValue: this.tariffId, opType: OperatorComparer.Equals },
          { fieldName: "GroupId", fieldValue: this.groupId, opType: OperatorComparer.Equals }
        ]
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
    
    }
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


  viewgetLabrequestReportPdf(element) {
    this.commonService.Onprint("BillNo", element.requestId, "OpBillReceipt");
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
    OnSave() 
    {
        if(!this.myFormGroup.invalid) 
        {
            console.log("LabRequest Insert:",this.myFormGroup.value)
    
            this._RequestforlabtestService.LabRequestSave(this.myFormGroup.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
            }, (error) => {
            this.toastr.error(error.message);
            });
        } 
        else
        {
            this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
    
    //     let submissionObj = {};
        
    //     if(this.vAdmissionID !=0 && this.dstable1.data.length!=0){
    //     let ipPathOrRadiRequestLabRequestInsertArray = [];
    //   this.dstable1.data.forEach((element) => {
    //     console.log(element)
    //       let ipPathOrRadiRequestLabRequestInsert = {};
    //       ipPathOrRadiRequestLabRequestInsert['reqDetId'] = 0;
    //       ipPathOrRadiRequestLabRequestInsert['requestId'] = 0;
    //       ipPathOrRadiRequestLabRequestInsert['serviceId'] = element.ServiceId;
    //       ipPathOrRadiRequestLabRequestInsert['price'] = element.Price;
    //       ipPathOrRadiRequestLabRequestInsert['isStatus'] = false;
    //       ipPathOrRadiRequestLabRequestInsert['IsOnFileTest'] = false;
    //       ipPathOrRadiRequestLabRequestInsertArray.push(ipPathOrRadiRequestLabRequestInsert);
    //     });

    //     submissionObj = {
    //       "requestId": 0,
    //       "reqDate": this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
    //       "reqTime": this.datePipe.transform(this.currentDate, 'shortTime'),
    //       "opIpId":  this.vAdmissionID,
    //       "opIpType": 1,
    //       "isAddedBy": this._loggedService.currentUserValue.userId,
    //       "isCancelled": false,
    //       "isCancelledBy": 0,
    //       "isCancelledDate":this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
    //       "isCancelledTime":this.datePipe.transform(this.currentDate, 'shortTime'),
    //       "isOnFileTest":false,// this.myFormGroup.get('IsOnFileTest').value || false,
    //       'tDlabRequests': ipPathOrRadiRequestLabRequestInsertArray
    //     }
    //     console.log(submissionObj);
    //     this._RequestforlabtestService.LabRequestSave(submissionObj).subscribe(response => {
    //       console.log(response.message);
    //       this.toastr.success(response);
    //       this._matDialog.closeAll();
    //             this.viewgetLabrequestReportPdf(response);
    //           }, (error) => {
    //             this.toastr.error(error.message);
    //           });
    //         } 
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

