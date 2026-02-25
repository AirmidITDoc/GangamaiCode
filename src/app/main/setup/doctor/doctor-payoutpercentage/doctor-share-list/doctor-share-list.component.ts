import { DatePipe } from '@angular/common';
import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { DoctorShareService } from 'app/main/administration/doctor-share/doctor-share.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { DoctorPayoutpercentageComponent } from '../doctor-payoutpercentage.component';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { fuseAnimations } from '@fuse/animations';
import { Observable } from 'rxjs';
import { BillListForDocShrList } from 'app/main/administration/doctor-share/doctor-share.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DoctorShareServiceService } from '../doctor-share-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-share-list',
  templateUrl: './doctor-share-list.component.html',
  styleUrls: ['./doctor-share-list.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class DoctorShareListComponent {
  displayedColumns: string[] = [ 
    'Status', 
    'ServiceName',
    'ClassName',
    'DoctorName',
    'ShareType',
    'SharePer',
    'ShareAmt',
    'Action' 
  ]

  DoctorListfilteredOptions: Observable<string[]>;
  DoctorNamefilteredOptions: Observable<string[]>;
  ClassListfilteredOptions: Observable<string[]>;
  sIsLoading: string = '';
  isDoctorIDSelected: boolean = false;
  isDoctorID1Selected: boolean = false;
  isServiceIDSelected: boolean = false;
  isclassIdSelected: boolean = false;
  ServiceList: any = [];
  filterdService: Observable<string[]>;
  noOptionFound: any;
  GroupList: any = [];
  isGroupnameSelected: boolean = false;
  GroupListfilteredOptions: Observable<string[]>;
  doctorShareId=0;
  ShrTypeSerOrGrp: any = 1
  DoctorId = "0";
  classid = 0;
  doctorId = 0
  serviceId = 0
  groupId = 0
 vServicePerc=0;
  vServiceAmt: any;

  dataSource = new MatTableDataSource<BillListForDocShrList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // data: any;
  Doctorshare: FormGroup;
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteGroupName: string = "GroupName";
  autocompleteModeService: string = "Service";
  autocompleteClass: string = "Class";

  
  constructor(
    public _DoctorShareService: DoctorShareServiceService,
    public datePipe: DatePipe ,@Inject(MAT_DIALOG_DATA) public data: any, private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog, public _formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    
    this.Doctorshare = this.cretaedocshareform()
    console.log(this.data)
     if(this.data){
    
            this.doctorShareId = this.data.doctorShareId;
            this.ServiceName = this.data.serviceName;
            this.classid = this.data.classId
            this.doctorId = this.data.doctorId
            this.serviceId = this.data.serviceId
        
            debugger
            this.Doctorshare.get('doctorId').setValue(this.data.doctorId);
            this.Doctorshare.get('serviceId').setValue(this.data.serviceId);
            this.Doctorshare.get('classId').setValue(this.data.classId)
             this.Doctorshare.get('servicePercentage').setValue(this.data.servicePercentage);
            this.Doctorshare.get('serviceAmount').setValue(this.data.serviceAmount) 
        
             this.getDocSharelist(this.data.doctorId);
            if (this.data.servicePercentage > 0) {
              this.Doctorshare.get('docShrType').setValue('P');
              this.vServicePerc = this.data.servicePercentage;
            } else {
              this.Doctorshare.get('docShrType').setValue('A');
              this.vServiceAmt = this.data.serviceAmount;
            }
            if (this.data.op_IP_Type == '0') {
              this.Doctorshare.get('opIpType').setValue('0');
            } else {
              this.Doctorshare.get('opIpType').setValue('1');
            }
            if (this.data.shrTypeSerOrGrp == '1') {
              this.Doctorshare.get('shrTypeSerOrGrp').setValue('1');
            } else {
              this.Doctorshare.get('shrTypeSerOrGrp').setValue('2');
            }
            
       }
     
  }
 
  getDocSharelist(doctorId) {
    const sharetype = this.Doctorshare.get('shrTypeSerOrGrp')?.value || 0
    var vdata = {
      "first": 0,
      "rows": 999,
      "sortField": "DoctorShareId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "DoctorId",
          "fieldValue": String(doctorId),//"228677",//
          "opType": "Equals"
        },
        {
          "fieldName": "ShrTypeSerOrGrp",
          "fieldValue": String(sharetype),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }
    console.log(vdata)
    this._DoctorShareService.getDocSharelist(vdata).subscribe(data => {
      this.dataSource.data = data.data as BillListForDocShrList[]
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
      console.log(this.dataSource.data) 
    })
  }
 
  selectChangeClass(obj: any) {
    this.classid = obj.value
  }

  selectChangeDoctor(obj: any) {
    this.doctorId = obj.value
     this.getDocSharelist(this.doctorId);
  }

  selectChangeService(obj: any) {
    this.serviceId = obj.value
  }

  selectChangeGroup(obj: any) {
    console.log(obj);
    this.groupId = obj.value
  }

   cretaedocshareform() {
    return this._formBuilder.group({

      "doctorShareId":  this.doctorShareId,
      "doctorId": [this.doctorId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      "serviceId": [this.serviceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      "docShrType": 'P',
      "docShrTypeS": "",
      "servicePercentage": 0,
      "serviceAmount": [0],
      "classId": [this.classid || 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      "shrTypeSerOrGrp": '1',
      "opIpType": '0',


      // Type: ['1'],
      // DoctorID:'',
      // DoctorName: '', 
      // ServiceID:'',
      GroupWise: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // opIpType:'0',
      // shrTypeSerOrGrp:'1',
      // classId:'',
      // DocShareType:'P',
      // Amount:'',
      // Percentage:''

    })
  }

  ServiceName: any;
  OnEdit(contact) {
    debugger
    console.log(contact)

    this.doctorShareId = contact?.doctorShareId || 0;
    this.ServiceName = contact?.serviceName || 0;
    this.classid = contact?.classId || 0;
    this.doctorId = contact?.doctorId || 0;
    this.serviceId = contact?.serviceId || 0;

    this.Doctorshare.get('doctorId').setValue(contact?.doctorId  || 0);
    this.Doctorshare.get('serviceId').setValue(contact?.serviceId  || 0);
    this.Doctorshare.get('classId').setValue(contact?.classId  || 0)  
    this.Doctorshare.get('servicePercentage').setValue(contact?.servicePercentage  || 0);
    this.Doctorshare.get('serviceAmount').setValue(contact?.serviceAmount  || 0) 
         
    // this.getServiceListCombobox();
    if (contact.servicePercentage > 0) {
      this.Doctorshare.get('docShrType').setValue('P');
      this.vServicePerc = contact.servicePercentage;
    } else {
      this.Doctorshare.get('docShrType').setValue('A');
      this.vServiceAmt = contact.serviceAmount;
    }
    if (contact.op_IP_Type == '0') {
      this.Doctorshare.get('opIpType').setValue('0');
    } else {
      this.Doctorshare.get('opIpType').setValue('1');
    }
    if (contact.shrTypeSerOrGrp == '1') {
      this.Doctorshare.get('shrTypeSerOrGrp').setValue('1');
    } else {
      this.Doctorshare.get('shrTypeSerOrGrp').setValue('2');
    }

  }

 

  OnSave() {
    debugger
    const formValue = this.Doctorshare.value  
    if(!this.doctorShareId){
    if (this.dataSource.data.length) {
      const isCheckFlag = this.dataSource.data.some(item =>
        item.op_IP_Type == formValue?.opIpType &&
        item.serviceId == formValue?.serviceId &&
        item.doctorId == formValue?.doctorId &&
        item.classId == formValue?.classId
      );
      if (isCheckFlag) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning!',
         text: 'This service with the selected doctor and class has already been added. Please check details.',
          confirmButtonText: 'OK'
        });
        return;
      } 
    }
  }

    if (this.Doctorshare.get('shrTypeSerOrGrp').value == '1') {

      if (this.Doctorshare.get('serviceId').value ==0) {
        this.toastr.warning('Please Select Service Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.Doctorshare.get('shrTypeSerOrGrp').value == '2') {
      if (this.Doctorshare.get('GroupWise').value ==0) {
        this.toastr.warning('Please Select Group Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      // this.serviceId=this.Doctorshare.get('GroupWise').value 
      this.Doctorshare.get('serviceId').setValue(this.Doctorshare.get('GroupWise').value)
    }

    if (this.Doctorshare.get('docShrType').value == 'P') {
      if (this.vServicePerc == undefined || this.vServicePerc == 0 || this.vServicePerc == null) {
        this.toastr.warning('Please enter Doctor Share Percentage ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.Doctorshare.get('docShrType').value == 'A') {
      if (this.vServiceAmt == '' || this.vServiceAmt == undefined || this.vServiceAmt == '0' || this.vServiceAmt == null) {
        this.toastr.warning('Please enter Doctor Share Amount ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    const docShareType = this.Doctorshare.get('docShrType').value;
    const docShrTypeS = docShareType === 'P' ? 'P' : 'A';

    
       this.Doctorshare.get('doctorShareId').setValue( this.doctorShareId)
    // this.Doctorshare.get('doctorId').setValue(this.doctorId)
    // this.Doctorshare.get('serviceId').setValue(this.serviceId)
    // this.Doctorshare.get('classId').setValue(this.classid)

    this.Doctorshare.get('docShrType').setValue(0)
    this.Doctorshare.get('docShrTypeS').setValue(docShrTypeS)
    // this.Doctorshare.get('servicePercentage').setValue(this.Doctorshare.get('servicePercentage').value || 0)
    // this.Doctorshare.get('serviceAmount').setValue(this.Doctorshare.get('serviceAmount').value || 0)
    // this.Doctorshare.get('shrTypeSerOrGrp').setValue(this.Doctorshare.get('shrTypeSerOrGrp').value || 1)
    // this.Doctorshare.get('opIpType').setValue(parseInt(this.Doctorshare.get('opIpType').value) || 0)
          this.Doctorshare.removeControl('GroupWise')


    console.log(this.Doctorshare.value)
    debugger
    if (!this.Doctorshare.invalid) {
      this._DoctorShareService.InsertDocShare(this.Doctorshare.value).subscribe((response) => {
        this.onClose()
         
      });
    }
    else {

      const invalidFields: string[] = [];

      Object.keys(this.Doctorshare.controls).forEach((controlName) => {
        const control = this.Doctorshare.controls[controlName];
        if (control.invalid) {
          invalidFields.push(controlName);
        }
      });

      if (invalidFields.length > 0) {
        invalidFields.forEach((field) => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
        });
      }
    }
   
  }

    getValidationMessages() {
        return {
            ServiceID: [
                { name: "required", Message: "Service Name is required" }
            ],
             classId: [
                { name: "required", Message: "Class Name is required" }
            ],
        };
    }



  onClose() {
   
    this.Doctorshare.reset();
    // this.Reset();
    // this.Doctorshare.get('Type').setValue('1');
     this._matDialog.closeAll();
  }
  Reset() {
  
    // this.Doctorshare.get('doctorId').setValue('');
    // // this.Doctorshare.get('GroupWise').setValue('');
    // this.Doctorshare.get('serviceId').setValue('');
    // this.Doctorshare.get('servicePercentage').setValue('');
    // this.Doctorshare.get('serviceAmount').setValue('');
    // this.Doctorshare.get('classId').setValue('');
    // this.Doctorshare.get('docShrType').setValue('P');
    // this.Doctorshare.get('shrTypeSerOrGrp').setValue('1');
    // this.Doctorshare.get('opIpType').setValue('0');
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
         // it allowed only Digit 
       keyPressDigitsOnly(event) {
           var inp = String.fromCharCode(event.keyCode);
           if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
               return true;
           } else {
               event.preventDefault();
               return false;
           }
       }
}