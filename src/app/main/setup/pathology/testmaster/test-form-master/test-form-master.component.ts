import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { map, startWith, takeUntil } from "rxjs/operators";
import {  TestmasterComponent } from "../testmaster.component";
import { TestmasterService } from "../testmaster.service";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table";
import { element } from "protractor";
import { ToastrService } from "ngx-toastr";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PainAssesList } from "app/main/nursingstation/clinical-care-chart/clinical-care-chart.component";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ConsentModule } from "app/main/nursingstation/consent/consent.module";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";


@Component({
    selector: "app-test-form-master",
    templateUrl: "./test-form-master.component.html",
    styleUrls: ["./test-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TestFormMasterComponent implements OnInit {
    testForm: FormGroup;    
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "PathParameterMaster/List",
    columnsList: [
        { heading: "#", key: "parameterId", sort: true, align: 'left', emptySign: 'NA', width:160 },

        { heading: "Parameter", key: "parameterName", sort: true, align: 'left', emptySign: 'NA', width:300 },
        
        { heading: "PrintParameterName", key: "printParameterName", sort: true, align: 'left', emptySign: 'NA', width:100 },

        { heading: "Method", key: "className", sort: true, align: 'left', emptySign: 'NA', width:100 },
             {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:160, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            // this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._TestmasterService.deactivateTheStatus(data.testId).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "parameterId",
        sortOrder: 0,
        filters: [
            { fieldName: "parameterName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    autocompleteModeCategoryId:string="CategoryName";
    autocompleteModeServiceID:string="ServiceName";
    selectedItems: any;

    constructor(
        public _TestmasterService: TestmasterService,
        public dialogRef: MatDialogRef<TestFormMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public _matDialog: MatDialog
    ) { }
   
    ngOnInit(): void {
        this.testForm = this._TestmasterService.createPathtestForm();
        var m_data = {
          testId: this.data?.testId,
          unitName: this.data?.unitName.trim(),
        //   printSeqNo: this.data?.printSeqNo,
        //   isconsolidated: JSON.stringify(this.data?.isconsolidated),
        //   isConsolidatedDR: JSON.stringify(this.data?.isConsolidatedDR),
        // isDeleted: JSON.stringify(this.data?.isActive),
        };
        this.testForm.patchValue(m_data);
    }
    onSubmit() {
        if(!this.testForm.get("TestId").value){
            var data1=[];
            // this.selectedItems.forEach((element) => {
                let MPathTemplateDetailsObj = {};
                MPathTemplateDetailsObj["PtemplateId"]=0,
                MPathTemplateDetailsObj['TestId'] = 11, //this.departmentId;
                MPathTemplateDetailsObj['TemplateId'] = 12 //this.myForm.get("DoctorId").value ? "0" : this.myForm.get("DoctorId").value || "0";
                data1.push(MPathTemplateDetailsObj);
            // });

            console.log("Insert data1:",data1);

            var data2=[];
            // this.selectedItems.forEach((element) => {
                let MPathTestDetailMastersObj = {};
                MPathTestDetailMastersObj["TestDetId"]=0,
                MPathTestDetailMastersObj['TestId'] = 16, //this.departmentId;
                MPathTestDetailMastersObj['SubTestId'] = 17,
                MPathTestDetailMastersObj['ParameterId']=19 //this.myForm.get("DoctorId").value ? "0" : this.myForm.get("DoctorId").value || "0";
                data2.push(MPathTestDetailMastersObj);
            // });
            console.log("Insert data2:",data2);

            var mdata={
                "TestId": 0,
                "TestName": this.testForm.get("TestName").value,
                "PrintTestName": this.testForm.get("PrintTestName").value,
                "CategoryId": 12,
                "IsSubTest": true,
                "TechniqueName": this.testForm.get("TechniqueName").value,
                "MachineName": this.testForm.get("MachineName").value,
                "SuggestionNote": this.testForm.get("SuggestionNote").value,
                "FootNote": this.testForm.get("FootNote").value,
                "IsDeleted": true,
                "ServiceId": 15,
                "IsTemplateTest": true,
                "TestTime": "2022-09-10",
                "TestDate": "2022-07-11",
                "MPathTemplateDetails": data1,
                "MPathTestDetailMasters": data2
              }

              console.log("json of Test:", mdata)
                this._TestmasterService.unitMasterSave(mdata).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        } else{
            
        }
    }

    CategoryId=0;
    ServiceID=0;

    selectChangeCategoryId(obj:any){
        console.log(obj);
        this.CategoryId=obj;
    }
    selectChangeServiceID(obj:any){
        console.log(obj);
        this.ServiceID=obj;
    }
    getValidationCategoryMessages(){
        return {
            CategoryId: [
                { name: "required", Message: "Category is required" }
            ]
        };
    }
    getValidationServiceMessages(){
        return {
            ServiceID: [
                { name: "required", Message: "Service is required" }
            ]
        };
    }
  
    onClear(val: boolean) {
        this.testForm.reset();
        this.dialogRef.close(val);
    }
  }
  