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

@Component({
  selector: 'app-add-auto-service',
  templateUrl: './add-auto-service.component.html',
  styleUrls: ['./add-auto-service.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AddAutoServiceComponent {
  displayedColumns = [
    'Status',
    'serviceName'
  ];

  AutoServiceForm: FormGroup;
  ApiURL:any='';
  sIsLoading: string = '';
  itemDetails:any;
  itemnamelist:any=[];
  autocompleteModeService: string = "Service"; 
  autocompleteModeClass: string = "Class";
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
    public toastr:ToastrService
  ) {this.AutoServiceForm = this.CreateAutoServiceForm();}

  ngOnInit(): void {
    debugger
    this.AutoServiceForm.markAllAsTouched();
    if(this.data){
      this.itemDetails = this.data?.obj
      console.log( this.itemDetails ) 
     }
     this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&ServiceName="
    }
  CreateAutoServiceForm() {
    return this._formBuilder.group({
      classId: [0],
      serviceName: [0,[Validators.required]]
    });
  }
  onItemChange(obj): void {
    console.log(obj) 
  } 
  getSelectedClassObj(obj) {
    console.log(obj); 
         this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + obj.value + "&ServiceName="

  }
  chargelist:any=[];
 OnAddService(){ 
  debugger
        // const formattedDate = this.datePipe.transform(this.Serviceform.get('chargesDate').value, "yyyy-MM-dd");
        // const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss"); 
        const formValue = this.AutoServiceForm.value

        if(this.dsServicelist.data.length>0){
          const deuplicateRecord = this.dsServicelist.data.find(item=> item.serviceId == formValue?.serviceName.serviceId)
          if(deuplicateRecord){
              this.toastr.warning('Please check selected Service already added in list', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
          }
        }

        // let doctorid = 0;
        // if (this.isDoctor) {
        //     if ((formValue.doctorId == '' || formValue.doctorId == null || formValue.doctorId == '0')) {
        //         this.toastr.warning('Please select Doctor', 'Warning !', {
        //             toastClass: 'tostr-tost custom-toast-warning',
        //         });
        //         return;
        //     }
        //     if (formValue.doctorId)
        //         doctorid = this.Serviceform.get("doctorId")?.value ?? 0;
        // } 
 
         if (this.AutoServiceForm.valid) {
           this.chargelist.push(
             {
               serviceId: formValue?.serviceName.serviceId,
               serviceName: formValue?.serviceName.serviceName, 
               tariffId:formValue?.serviceName.tariffId,
               classId: formValue?.serviceName.classId,
               creditedtoDoctor:formValue?.serviceName.creditedtoDoctor,
               isPathology: formValue?.serviceName.isPathology,
               isRadiology: formValue?.serviceName.isRadiology,
               isPackage: formValue?.serviceName.isPackage,
               doctorId: formValue?.serviceName.doctorId,
             }
           ) 
           this.dsServicelist.data = this.chargelist
            console.log('valida service form', this.AutoServiceForm.value)
        } else {
            let invalidFields = [];
            if (this.AutoServiceForm.invalid) {
                for (const controlName in this.AutoServiceForm.controls) {
                    if (this.AutoServiceForm.controls[controlName].invalid) {
                        invalidFields.push(`${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                    );
                });
            }
        } 
        const serviceIdElement = document.querySelector(`[name='serviceName']`) as HTMLElement;
        if (serviceIdElement) {
            serviceIdElement.focus();
        }
        this.AutoServiceForm.markAllAsTouched();
         this.AutoServiceForm.reset(); 
    
 }
  onClose() {
    this.AutoServiceForm.reset();
    this.dialogRef.close();
  }
  getValidationMessages() {
    return {
      classId: [
        { name: "required", Message: "class Name No is required" }
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
