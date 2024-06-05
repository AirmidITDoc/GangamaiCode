import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RequestforlabtestService } from '../requestforlabtest.service';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
 
 
@Component({
  selector: 'app-new-requestforlab',
  templateUrl: './new-requestforlab.component.html',
  styleUrls: ['./new-requestforlab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRequestforlabComponent implements OnInit {

  isRegIdSelected: boolean = false;
  isServiceIdSelected:boolean=false;
  isRegSearchDisabled: boolean;
  isServiceSearchDisabled:boolean;
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
  SpinLoading:boolean=false;
  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  vOPIPId:any =0;
  vOPDNo:any=0;
  vTariffId:any=0;
  vClassId:any=0;
  vAge:any=0;
 
  displayedServiceColumns: string[] = [
  'ServiceName',
    // 'Price'
   
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
  
 
  constructor(private _FormBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewRequestforlabComponent>,
    private _matDialog:MatDialog,
    public _RequestforlabtestService: RequestforlabtestService, 
    public toastr: ToastrService,
    private _loggedService: AuthenticationService) { 
      this.date = new Date();
    }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.myFormGroup = this.createMyForm();
    // this.getServiceListdata();
  }

  createMyForm():FormGroup {
    return this._FormBuilder.group({
      IsPathRad: ['3'],
      ServiceName1: '',
      Price1: '',
      ServiceId: '',
      ServiceName2: '',
      Price2: '',
      PatientName:'',
      RegId:'',
      AdmissionID:0,
      Requestdate:'',
      IsOnFileTest:''
    })
  }
  createSearchForm():FormGroup{
    return this._FormBuilder.group({
      RegID:[''],
      radioIp:['1']

    });
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  } 
  getSearchList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegID').value}%`
    }
    if (this.searchFormGroup.get('RegID').value.length >= 1) {
      this._RequestforlabtestService.getAdmittedPatientList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData);
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        } 
      });
    }

  }
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  }

 
  onEdit(row) {
    console.log(row);

    this.registerObj = row;
    this.getSelectedObj(row);
  }
  WardName:any;
  RegNo:any; 
  BedNo:any;
  getSelectedObj(obj) {
    if(obj.IsDischarged == 1){
      Swal.fire('Selected Patient is already discharged');
      this.PatientName = ''  
      this.vAdmissionID =  ''
      this.RegNo = ''
      this.Doctorname =  ''
      this.Tarrifname = ''
      this.CompanyName =''
      this.vOPDNo = ''
      this.WardName =''
      this.BedNo = ''
    }
    else{
      this.registerObj = obj; 
      this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
      this.RegNo = obj.RegNo;
      this.vAdmissionID = obj.AdmissionID
      this.CompanyName = obj.CompanyName;
      this.Tarrifname = obj.TariffName;
      this.Doctorname = obj.DoctorName; 
      this.vOPDNo = obj.AdmissionID;
      this.WardName = obj.RoomName;
      this.BedNo = obj.BedName;
      this.vClassId = obj.ClassId;
      this.vTariffId = obj.TariffId;
      console.log(obj);
      this.getServiceListdata();
    } 
 this.dsLabRequest2.data = [];
 this.dstable1.data = [];
  }

  getServiceListdata() {
    // debugger
    if(this.RegNo > 0 ){
      var Param = {
        "ServiceName":`${this.myFormGroup.get('ServiceId').value}%` ||'%',
        "IsPathRad":parseInt(this.myFormGroup.get('IsPathRad').value) || 0,
        "ClassId":   this.vClassId || 0,
        "TariffId":  this.vTariffId  || 0
    }
      console.log(Param);
      this._RequestforlabtestService.getServiceListDetails(Param).subscribe(data => {
        this.dsLabRequest2.data = data as LabRequest[];
        // this.chargeslist = data as LabRequestList[];
        this.dsLabRequest2.data = data as LabRequest[];
       console.log(this.dsLabRequest2)
        this.sIsLoading = '';
      },
        error => {
          this.sIsLoading = '';
        });
    }
    else{
      this.toastr.warning('Please select patient ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
   
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
              title: "IP Prescription Viewer"
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
    this.isLoading = 'save';
    this.dstable1.data = [];
    if (this.chargeslist && this.chargeslist.length > 0) {
      let duplicateItem = this.chargeslist.filter((ele, index) => ele.ServiceId === row.ServiceId);
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
    else{
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }

  addChargList(row) {
    this.chargeslist.push(
      {
        ServiceId: row.ServiceId,
        ServiceName: row.ServiceName,
        Price: row.Price || 0
      });
    this.isLoading = '';
    console.log(this.chargeslist);
    this.dstable1.data = this.chargeslist;
    this.dstable1.sort = this.sort;
    this.dstable1.paginator = this.paginator;
  }

  deleteTableRow(element) { 
      this.chargeslist= this.dstable1.data ;
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
    this.dstable1.data =[];
  }

  
  savebtn:boolean=false;
  OnSave() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    if ((this.RegNo == '' || this.RegNo == null || this.RegNo == undefined)) {
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
    ipPathOrRadiRequestInsertArray['isAddedBy'] = this._loggedService.currentUserValue.user.id;
    ipPathOrRadiRequestInsertArray['isCancelled'] = 0;
    ipPathOrRadiRequestInsertArray['isCancelledBy'] = 0;
    ipPathOrRadiRequestInsertArray['isCancelledDate'] = formattedDate;
    ipPathOrRadiRequestInsertArray['isCancelledTime'] =  formattedTime;
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
      'ipPathOrRadiRequestInsert' : ipPathOrRadiRequestInsertArray,
      'ipPathOrRadiRequestLabRequestInsert' :ipPathOrRadiRequestLabRequestInsertArray
    } 
    console.log(submissionObj);
    this._RequestforlabtestService.LabRequestSave(submissionObj).subscribe(response => {
      console.log(response);
      if (response) {
        this.toastr.success('Lab Request Saved Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.savebtn = true;
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

