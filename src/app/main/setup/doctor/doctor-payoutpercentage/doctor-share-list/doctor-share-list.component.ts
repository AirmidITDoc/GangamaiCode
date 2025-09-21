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

@Component({
  selector: 'app-doctor-share-list',
  templateUrl: './doctor-share-list.component.html',
  styleUrls: ['./doctor-share-list.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class DoctorShareListComponent {

  DoctorListfilteredOptions: Observable<string[]>;
  DoctorNamefilteredOptions: Observable<string[]>;
  ClassListfilteredOptions: Observable<string[]>;
  sIsLoading: string = '';
  isDoctorIDSelected: boolean = false;
  isDoctorID1Selected: boolean = false;
  isServiceIDSelected: boolean = false;
  isClassIdSelected: boolean = false;
  ServiceList: any = [];
  filterdService: Observable<string[]>;
  noOptionFound: any;
  GroupList: any = [];
  isGroupnameSelected: boolean = false;
  GroupListfilteredOptions: Observable<string[]>;
  doctorShareId=0;

  dataSource = new MatTableDataSource<BillListForDocShrList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // data: any;
  Doctorshare: FormGroup;
  autocompleteModeItem: string = "ConDoctor";
  autocompletedepartment: string = "Department";
  autocompleteModeService: string = "Service";
  autocompleteClass: string = "Class";
  ShrTypeSerOrGrp: any = 1
  DoctorId = "0";
  classid = 0;
  doctorId = 0
  serviceId = 0
  groupId = 0

  
  constructor(
    public _DoctorShareService: DoctorShareService,
    public datePipe: DatePipe ,@Inject(MAT_DIALOG_DATA) public data: any, private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog, public _formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    // this.getAddDoctorList();

    this.Doctorshare = this.cretaedocshareform()
    console.log(this.data)
     if(this.data){
    
            this.doctorShareId = this.data.doctorShareId;
            this.ServiceName = this.data.serviceName;
            this.classid = this.data.classId
            this.doctorId = this.data.doctorId
            this.serviceId = this.data.serviceId
        
            this._DoctorShareService.DocFormGroup.get('DoctorID').setValue(this.data.doctorId);
            this._DoctorShareService.DocFormGroup.get('ServiceID').setValue(this.data.serviceId);
            this._DoctorShareService.DocFormGroup.get('ClassId').setValue(this.data.classId)
        
        
            // this.getServiceListCombobox();
            if (this.data.servicePercentage > 0) {
              this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('P');
              this.vServicePerc = this.data.servicePercentage;
            } else {
              this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('A');
              this.vServiceAmt = this.data.serviceAmount;
            }
            if (this.data.op_IP_Type == '0') {
              this._DoctorShareService.DocFormGroup.get('PatientType').setValue('0');
            } else {
              this._DoctorShareService.DocFormGroup.get('PatientType').setValue('1');
            }
            if (this.data.shrTypeSerOrGrp == '1') {
              this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('1');
            } else {
              this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('2');
            }
       }
  }

 
  selectChangeClass(obj: any) {
    this.classid = obj.value
  }

  selectChangeDoctor(obj: any) {
    this.doctorId = obj.value
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
      "docShrType": [0],
      "docShrTypeS": "",
      "servicePercentage": 0,
      "serviceAmount": [0],
      "classId": [this.classid || 0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      "shrTypeSerOrGrp": 0,
      "opIpType": [0],

    })
  }

  ServiceName: any;
  OnEdit(contact) {
    debugger
    console.log(contact)

    this.doctorShareId = contact.doctorShareId;
    this.ServiceName = contact.serviceName;
    this.classid = contact.classId
    this.doctorId = contact.doctorId
    this.serviceId = contact.serviceId

    this._DoctorShareService.DocFormGroup.get('DoctorID').setValue(contact.doctorId);
    this._DoctorShareService.DocFormGroup.get('ServiceID').setValue(contact.serviceId);
    this._DoctorShareService.DocFormGroup.get('ClassId').setValue(contact.classId)


    // this.getServiceListCombobox();
    if (contact.servicePercentage > 0) {
      this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('P');
      this.vServicePerc = contact.servicePercentage;
    } else {
      this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('A');
      this.vServiceAmt = contact.serviceAmount;
    }
    if (contact.op_IP_Type == '0') {
      this._DoctorShareService.DocFormGroup.get('PatientType').setValue('0');
    } else {
      this._DoctorShareService.DocFormGroup.get('PatientType').setValue('1');
    }
    if (contact.shrTypeSerOrGrp == '1') {
      this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('1');
    } else {
      this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('2');
    }

  }

  vServicePerc: any;
  vServiceAmt: any;

  OnSave() {
    debugger
    if (this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value == '1') {

      if (!this.serviceId) {
        this.toastr.warning('Please Select Service Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value == '2') {
      if (!this.groupId) {
        this.toastr.warning('Please Select Group Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this.serviceId=this.groupId
    }

    if (this._DoctorShareService.DocFormGroup.get('DocShareType').value == 'P') {
      if (this.vServicePerc == '' || this.vServicePerc == undefined || this.vServicePerc == '0' || this.vServicePerc == null) {
        this.toastr.warning('Please enter Doctor Share Percentage ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this._DoctorShareService.DocFormGroup.get('DocShareType').value == 'A') {
      if (this.vServiceAmt == '' || this.vServiceAmt == undefined || this.vServiceAmt == '0' || this.vServiceAmt == null) {
        this.toastr.warning('Please enter Doctor Share Amount ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    const docShareType = this._DoctorShareService.DocFormGroup.get('DocShareType').value;
    const docShrTypeS = docShareType === 'P' ? 'P' : 'A';

    console.log(this.Doctorshare.value)

       this.Doctorshare.get('doctorShareId').setValue( this.doctorShareId)
    this.Doctorshare.get('doctorId').setValue(this.doctorId)
    this.Doctorshare.get('serviceId').setValue(this.serviceId)
    this.Doctorshare.get('classId').setValue(this.classid)

    this.Doctorshare.get('docShrType').setValue(0)
    this.Doctorshare.get('docShrTypeS').setValue(docShrTypeS)
    this.Doctorshare.get('servicePercentage').setValue(this._DoctorShareService.DocFormGroup.get('Percentage').value || 0)
    this.Doctorshare.get('serviceAmount').setValue(this._DoctorShareService.DocFormGroup.get('Amount').value || 0)
    this.Doctorshare.get('shrTypeSerOrGrp').setValue(this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value || 1)
    this.Doctorshare.get('opIpType').setValue(parseInt(this._DoctorShareService.DocFormGroup.get('PatientType').value) || 0)


    console.log(this.Doctorshare.value)
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
  onClose() {
   
    this._DoctorShareService.DocFormGroup.reset();
    this.dataSource.data = [];
    this.Reset();
    this._DoctorShareService.DocFormGroup.get('Type').setValue('1');
     this._matDialog.closeAll();
  }
  Reset() {
    this._DoctorShareService.DocFormGroup.get('DoctorID').setValue('');
    this._DoctorShareService.DocFormGroup.get('GroupWise').setValue('');
    this._DoctorShareService.DocFormGroup.get('ServiceID').setValue('');
    this._DoctorShareService.DocFormGroup.get('Percentage').setValue('');
    this._DoctorShareService.DocFormGroup.get('Amount').setValue('');
    this._DoctorShareService.DocFormGroup.get('ClassId').setValue('');
    this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('P');
    this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('1');
    this._DoctorShareService.DocFormGroup.get('PatientType').setValue('0');
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
}