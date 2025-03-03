import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ServiceMasterService } from '../service-master.service';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-editpackage',
  templateUrl: './editpackage.component.html',
  styleUrls: ['./editpackage.component.scss']
})
export class EditpackageComponent implements OnInit {

    serviceForm: FormGroup;;
    // isActive:boolean=true;

    autocompleteModegroupName:string = "Service";

    constructor(
        public _ServiceMasterService: ServiceMasterService,
        public dialogRef: MatDialogRef<EditpackageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "CurrencyMaster/List",
        columnsList: [
            { heading: "ServiceName", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PackageServiceName", key: "middleName", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    // {
                    //     action: gridActions.edit, callback: (data: any) => {
                    //         this.onSave(data);
                    //     }
                    // }, 
                    {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ServiceMasterService.deactivateTheStatus(data.subGroupId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "firstName",
        sortOrder: 0,
        filters: [
            { fieldName: "firstName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        ],
        row: 25
    }
    

    ngOnInit(): void {
        this.serviceForm=this._ServiceMasterService.createServicemasterForm();
        if((this.data?.tariffId??0) > 0){
            // this.isActive=this.data.isActive
            this.serviceForm.patchValue(this.data);
        }
    }

    onSubmit(){
        
        if(!this.serviceForm.invalid)
        {
        
            console.log("insert tariff:", this.serviceForm.value);
            
            this._ServiceMasterService.tariffMasterSave(this.serviceForm.value).subscribe((response)=>{
            this.toastr.success(response.message);
            this.onClear(true);
            }, (error)=>{
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
    }

    onAddTemplate() {
        // console.log("event is :", event);
        // if (!this.list) {
        //     this.list = [];
        // }    
        // const newItem = {
        //     templateId: this.DDtemplateId, //this.templatedetailsForm.get("TemplateId").value, // Ensure correct property name
        //     templateName: this.DDtemplateName //this.templatedetailsForm.get("TemplateName").value, // Ensure correct property name
        // };
    
        // this.list.push(newItem);
    
        // this.Templatetdatasource.data = [...this.Templatetdatasource.data, newItem];
    
        // console.log("Updated list:", this.list);
        // console.log("Updated Templatetdatasource:", this.Templatetdatasource.data);
    
        // // Reset form fields
        // this.templatedetailsForm.get("TemplateId").reset();
        // this.templatedetailsForm.get("TemplateName").reset();
    }

    onClear(val: boolean) {
        this.serviceForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages(){
        return{
            ServiceShortDesc: [],
            ServiceName: [],
        }
    }
}