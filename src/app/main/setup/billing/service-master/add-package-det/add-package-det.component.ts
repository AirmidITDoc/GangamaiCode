import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ServiceMasterService } from '../service-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-package-det',
  templateUrl: './add-package-det.component.html',
  styleUrls: ['./add-package-det.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AddPackageDetComponent implements OnInit {
  displayedColumnspackage = [  
    'ServiceName',
    'PackageServiceName', 
    'action'
  ];

  registerObj:any;
  dateTimeObj:any;
  PacakgeList:any=[];
  PackageForm:FormGroup;
  isServiceSelected:boolean=false; 
  filteredOptionsService:any;
  noOptionFound:any; 
  SrvcName: any; 
  vServiceId:any; 
  isLoading:string='';  
  screenFromString = 'OP-billing';  


  dsPackageDet = new MatTableDataSource<PacakgeList>();

  constructor(
    public _serviceMasterService: ServiceMasterService,
    public toastr : ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPackageDetComponent>, 
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,  
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    if(this.data){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  createForm() {
    this.PackageForm = this.formBuilder.group({
      SrvcName: [''],   
      MainServiceName:['']
    });
  }
  //Service list
  getServiceListCombobox() {
    var m_data = {
      SrvcName: `${this.PackageForm.get('SrvcName').value}%`,
      TariffId: this.registerObj.TariffId || 1, 
      ClassId: 0,
    };
    console.log(m_data)
    if (this.PackageForm.get('SrvcName').value.length >= 1) {
      this._serviceMasterService.getBillingServiceList(m_data).subscribe(data => {
        this.filteredOptionsService = data;
        if (this.filteredOptionsService.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      }); 
    } 
} 
getOptionText(option) {
  if (!option)
    return '';
  return option.ServiceName; 
} 
getSelectedObj(obj) {
  console.log(obj)
  if (this.dsPackageDet.data.length > 0) {
    this.dsPackageDet.data.forEach((element) => {
      if (obj.ServiceId == element.ServiceId) {
        Swal.fire('Selected Item already added in the list ');
        this.PackageForm.get('SrvcName').setValue('')
      }
    });
  }
  this.SrvcName = obj.ServiceName; 
}
onAddPackageService() { 
  if ((this.vServiceId == 0 || this.vServiceId == null || this.vServiceId == undefined)) {
    this.toastr.warning('Please select Service', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  } 
  if (this.PackageForm.get('SrvcName').value) {
    if (!this.filteredOptionsService.find(item => item.ServiceName == this.PackageForm.get('SrvcName').value.ServiceName)) {
      this.toastr.warning('Please select valid Service Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }  
  this.isLoading = 'save'; 
  this.dsPackageDet.data = [];
  this.PacakgeList.push(
    {
     
      ServiceId: this.registerObj.ServiceId,
      ServiceName:this.registerObj.ServiceName || '',  
      PackageServiceId: this.PackageForm.get('SrvcName').value.ServiceId || 0,
      PackageServiceName: this.PackageForm.get('SrvcName').value.ServiceName || 0,

    });
  this.isLoading = '';
  this.dsPackageDet.data = this.PacakgeList;  
  this.PackageForm.get('MainServiceName').setValue(this.registerObj.ServiceName);
  this.PackageForm.reset(); 
} 
  deleteTableRowPackage(element) {
    let index = this.PacakgeList.indexOf(element);
    if (index >= 0) {
      this.PacakgeList.splice(index, 1);
      this.dsPackageDet.data = [];
      this.dsPackageDet.data = this.PacakgeList;
    }
    Swal.fire('Success !', 'PacakgeList Row Deleted Successfully', 'success'); 
  } 

  onSavePackage(){
    if (this.dsPackageDet.data.length < 0) {
      this.toastr.warning('Please add package Service Name in list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

  }

  onClose(){
    this._matDialog.closeAll();
  } 
}
export class PacakgeList{ 
  ServiceId: number;
  ServiceName : String; 
  PackageServiceId:any; 
  PacakgeServiceName:any; 

  constructor(PacakgeList){ 
          this.ServiceId = PacakgeList.ServiceId || '';
          this.ServiceName = PacakgeList.ServiceName || ''; 
          this.PacakgeServiceName = PacakgeList.PacakgeServiceName || '';
  }
} 