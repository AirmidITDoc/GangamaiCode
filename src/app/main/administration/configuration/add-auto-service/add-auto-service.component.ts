import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ConfigurationService } from '../configuration.service';
import { DatePipe } from '@angular/common'; 
import { ToastrService } from 'ngx-toastr';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { element } from 'protractor';

@Component({
  selector: 'app-add-auto-service',
  templateUrl: './add-auto-service.component.html',
  styleUrls: ['./add-auto-service.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AddAutoServiceComponent {
  displayedColumns = [
    'Serviceid',
    'serviceName',
    'action'
  ];

  AutoServiceForm: FormGroup;
  sIsLoading: string = ''; 
  registerObj:any;
  autocompleteModeService: string = "Service"; 
   @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  dsServicelist = new MatTableDataSource<ItemList>();

  constructor(
    public _matDialog: MatDialog,
    public _ConfigurationService:ConfigurationService,
    public dialogRef: MatDialogRef<AddAutoServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public datePipe:DatePipe,
    public toastr:ToastrService,
    public _formvalidatorsaervice:FormvalidationserviceService
  ) {}

  ngOnInit(): void { 
    this.AutoServiceForm = this.CreateAutoServiceForm()
    this.AutoServiceForm.markAllAsTouched(); 
    
     }
  CreateAutoServiceForm() {
    return this._formBuilder.group({ 
      serviceName: [0,[Validators.required]]
    });
  }
  onServiceChange(obj): void {
    console.log(obj)
  this.registerObj = obj
  } 
 
  chargelist:any=[];
  OnAddService() { 
     const formValue = this.AutoServiceForm.value 
    if (!formValue?.serviceName) {
      this.toastr.warning('Please select service name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this.dsServicelist.data.length > 0) {
      const deuplicateRecord = this.dsServicelist.data.find(item => item.serviceId == this.registerObj?.value)
      if (deuplicateRecord) {
        this.toastr.warning('Please check selected Service already added in list', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    this.chargelist.push(
      {
        serviceId: this.registerObj?.value,
        serviceName: this.registerObj?.text,
      }
    )
    this.dsServicelist.data = this.chargelist
     const serviceIdElement = document.querySelector(`[name='serviceName']`) as HTMLElement;
    if (serviceIdElement) {
      serviceIdElement.focus();
    }
    this.AutoServiceForm.reset(); 
    this.AutoServiceForm.markAllAsTouched();
  }
 
  deleteTableRow(element) {
    const index = this.chargelist.indexOf(element);
    if (index >= 0) {
      this.chargelist.splice(index, 1);
      this.dsServicelist.data = [];
      this.dsServicelist.data = this.chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
 
  OnSave(){ 
    if (!this.dsServicelist.data) {
      this.toastr.warning('Please check data not availble in list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const saveList: any[] = [];
    this.dsServicelist.data.forEach(element => {
     saveList.push(
      {
        sysId: 0,
        serviceId: element.serviceId,
        isAutoBedCharges:false
      }
    )
    }); 
    if(saveList){
      console.log(saveList)
       this._ConfigurationService.AutoServiceInsert(saveList).subscribe(response => {
        this.onClose();
         })
    }
   
  }
  onClose() {
    this.AutoServiceForm.reset();
    this.dialogRef.close();
  }
  getValidationMessages() {
    return {
      classId: [
        { name: "required", Message: "class Name No is required" }
      ],
       serviceName: [
        { name: "required", Message: "service Name No is required" }
      ]
    };
  }
}
export class ItemList {
  serviceName: string;
  serviceId: number;
  /**
   * Constructor
   *
   * @param ItemList
   */
  constructor(ItemList) {
    {
      this.serviceName = ItemList.serviceName || "";
      this.serviceId = ItemList.serviceId || 0;
    }
  }
}
