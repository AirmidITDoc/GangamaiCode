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
 
 
 
  displayedVisitColumns: string[] = [
    'ServiceName',
    // 'Price'
   
  ]

  displayedVisitColumns2: string[] = [
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
  
  
 
  constructor(private _FormBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NewRequestforlabComponent>,
    private _matDialog:MatDialog,
    public _RequestforlabtestService: RequestforlabtestService,
    private _loggedService: AuthenticationService) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.myFormGroup = this.createMyForm();
    this.getServiceListdata();
  }

  createMyForm():FormGroup {
    return this._FormBuilder.group({
      IsPathRad: ['2'],
      ServiceName1: '',
      Price1: '',
      ServiceId: '',
      ServiceName2: '',
      Price2: '',
      PatientName:'',
      RegId:'',
      AdmissionID:0

      
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

  // getSearchList() {
  //   var m_data = {
  //     "Keyword": `${this.searchFormGroup.get('RegId').value}%` || '%'
  //   }
  //   if (this.searchFormGroup.get('RegId').value.length >= 1) {
  //     this._AdmissionService.getRegistrationList(m_data).subscribe(resData => {
  //       this.filteredOptions = resData;
  //       this.V_SearchRegList=this.filteredOptions;
  //       console.log(this.V_SearchRegList)
  //       if (this.filteredOptions.length == 0) {
  //         this.noOptionFound = true;
  //       } else {
  //         this.noOptionFound = false;
  //       }
  //     });
  //   }



  getSearchList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegID').value}%`
    }
    if (this.searchFormGroup.get('RegID').value.length >= 1) {
      this._RequestforlabtestService.getRegistrationList(m_data).subscribe(resData => {
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

  getOptionTextPatientName(option){
    return option && option.PatientName ? option.PatientName : '';
  }
  getOptionTextDoctorName(option){
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextRegNo(option){
    return option && option.RegNo ? option.RegNo : '';
  }
  onEdit(row) {
    console.log(row);

    this.registerObj = row;
    this.getSelectedObj(row);
  }
  getSelectedObj(obj) {
    
    this.registerObj = obj;
    this.PatientName = obj.FirstName + '' + obj.FirstName + '' +obj.LastName;
    this.RegId = obj.RegId;
    this.vAdmissionID = obj.AdmissionID;
    this.DoctorName = obj.DoctorName;
   // console.log( this.PatientName)
    // this.setDropdownObjs();
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
      this.SpinLoading =true;
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
   
    },100);
  }
  
  getServiceListdata() {
    debugger
    var Param = {
      "ServiceName": 'c%',
      "IsPathRad":parseInt(this.myFormGroup.get('IsPathRad').value) || 0,
      "ClassId":1,
      "TariffId":1
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
 

  getServiceListItem(){}

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
    // if (this.key == "Delete") {
      this.chargeslist= this.dstable1.data ;
      let index = this.chargeslist.indexOf(element);
      if (index >= 0) {
        this.chargeslist.splice(index, 1);
        this.dstable1.data = [];
        this.dstable1.data = this.chargeslist;
      }
      Swal.fire('Success !', 'Service Row Deleted Successfully', 'success');

    // }
  }
  onClose() {
    this.dialogRef.close();
  }

  

  OnSaveLabRequest(){

    this.isLoading = 'submit';
      let submissionObj = {};
      let ipPathOrRadiRequestInsertArray= {};
      let ipPathOrRadiRequestLabRequestInsertArray = [];
      let ipPathOrRadiRequestLabRequestInsert =[];

      ipPathOrRadiRequestInsertArray['reqDate']  =  this.dateTimeObj.date;
      ipPathOrRadiRequestInsertArray['reqTime']  = this.dateTimeObj.time;
      ipPathOrRadiRequestInsertArray['oP_IP_ID']  = this.vAdmissionID
      ipPathOrRadiRequestInsertArray['oP_IP_Type']  =  1;
      ipPathOrRadiRequestInsertArray['isAddedBy']  = this._loggedService.currentUserValue.user.id;
      ipPathOrRadiRequestInsertArray['isCancelled']  = 0;
      ipPathOrRadiRequestInsertArray['isCancelledBy']  = 0;
      ipPathOrRadiRequestInsertArray['isCancelledDate']  = this.dateTimeObj.date;
      ipPathOrRadiRequestInsertArray['isCancelledTime']  = this.dateTimeObj.time;
      ipPathOrRadiRequestInsertArray['IsOnFileTest']  = 1;
      ipPathOrRadiRequestInsertArray['RequestId ']  = 0
     

      submissionObj['ipPathOrRadiRequestInsert'] = ipPathOrRadiRequestInsertArray;

      this.dstable1.data.forEach((element) => {
        let ipPathOrRadiRequestLabRequestInsert = {};
        ipPathOrRadiRequestLabRequestInsert['requestId'] =0;
        ipPathOrRadiRequestLabRequestInsert['serviceId'] = element.ServiceId;
        ipPathOrRadiRequestLabRequestInsert['price']=element.Price;
        ipPathOrRadiRequestLabRequestInsert['isStatus']= false;
        ipPathOrRadiRequestLabRequestInsert['IsOnFileTest']  = 1;
        ipPathOrRadiRequestLabRequestInsertArray.push(ipPathOrRadiRequestLabRequestInsert);
    });
    submissionObj['ipPathOrRadiRequestLabRequestInsert'] = ipPathOrRadiRequestLabRequestInsertArray;
    console.log(submissionObj);
    this._RequestforlabtestService.LabRequestSave(submissionObj).subscribe(response => {
      console.log(response);
      if (response) {
        Swal.fire('Congratulations !', 'New Lab Request Saved Successfully  !', 'success').then((result) => {
          if (result) {
            // this.dialogRef.close();
this.viewgetLabrequestReportPdf(response);
          }
        });
      } else {
        Swal.fire('Error !', 'Lab Request Not Saved', 'error');
      }
      this.isLoading = '';
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

