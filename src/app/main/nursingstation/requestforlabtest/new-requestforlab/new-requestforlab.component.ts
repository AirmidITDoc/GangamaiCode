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
  
 
 
 
  displayedVisitColumns: string[] = [
    'ServiceName',
    'Price',
    'buttons'
  ]

  displayedVisitColumns2: string[] = [
    'ServiceName2',
    'Price2'
  ]

  searchFormGroup: FormGroup;
  myFormGroup: FormGroup;

  dstable1 = new MatTableDataSource<LabRequest>();
  dsLabRequest2 = new MatTableDataSource<LabRequestList>();
  chargeslist: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private _matDialog: any;
  vAdmissionID: any;
  
  
 
  constructor(private _FormBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewRequestforlabComponent>,
    public _RequestforlabtestService: RequestforlabtestService,
    private _loggedService: AuthenticationService) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.myFormGroup = this.createMyForm();
    this.getServiceList();
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
    this.PatientName = obj.FirstName + '' + obj.LastName;
    this.RegId = obj.RegID;
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

  getServiceList(){
    var vdata={
      ServiceName: this.myFormGroup.get('ServiceName2').value +'%' || '%',
      IsPathRad: this.myFormGroup.get('IsPathRad').value || 0,
      ClassID:1,  
      TraiffID:1
    }
    console.log(vdata);
    this._RequestforlabtestService.getServiceList(vdata).subscribe(data =>{
      this.dsLabRequest2.data = data as LabRequestList[];
      this.dsLabRequest2.sort = this.sort;
      this.dsLabRequest2.paginator = this.paginator;
       console.log(this.dsLabRequest2.data);
    })
  }

  onSaveEntry(row) {
    
   
    this.isLoading = 'save';
    this.dstable1.data = [];
    this.chargeslist.push(
      {
        ServiceId: row.ServiceId,
        ServiceName: row.ServiceName,
        Price: row.Price|| 0
      });

    this.isLoading = '';
    console.log(this.chargeslist);
    this.dstable1.data = this.chargeslist;
    this.dstable1.sort = this.sort;
      this.dstable1.paginator = this.paginator;
    console.log(this.dstable1.data);
  }
  deleteTableRow(event, element) {
    // if (this.key == "Delete") {
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
     

      submissionObj['ipPathOrRadiRequestInsert'] = ipPathOrRadiRequestInsertArray;

      this.dsLabRequest2.data.forEach((element) => {
        let ipPathOrRadiRequestLabRequestInsert = {};
        ipPathOrRadiRequestLabRequestInsert['requestId'] =0;
        ipPathOrRadiRequestLabRequestInsert['serviceId'] = element.ServiceId;
        ipPathOrRadiRequestLabRequestInsert['price']=element.Price;
        ipPathOrRadiRequestLabRequestInsert['isStatus']= false;
        ipPathOrRadiRequestLabRequestInsertArray.push(ipPathOrRadiRequestLabRequestInsert);
    });
    submissionObj['ipPathOrRadiRequestLabRequestInsert'] = ipPathOrRadiRequestLabRequestInsertArray;
    console.log(submissionObj);
    this._RequestforlabtestService.LabRequestSave(submissionObj).subscribe(response => {
      console.log(response);
      if (response) {
        Swal.fire('Congratulations !', 'New Lab Request Saved Successfully  !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Prescription Not Updated', 'error');
      }
      this.isLoading = '';
    });
  }

    
}
export class LabRequest {
  ServiceName: any;
  Price: number;

  constructor(LabRequest) {
    this.ServiceName = LabRequest.ServiceName || '';
    this.Price = LabRequest.Price || 0;
  }
}

export class LabRequestList {
  ServiceName2: any;
  Price2: number;
  ServiceId: any;
  Price: any;

  constructor(LabRequestList) {
    this.ServiceName2 = LabRequestList.ServiceName2 || '';
    this.Price2 = LabRequestList.Price2 || 0;
  }
}