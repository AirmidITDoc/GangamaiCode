import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { BillListForDocShrList } from 'app/main/administration/doctor-share/doctor-share.component';
import { DoctorShareService } from 'app/main/administration/doctor-share/doctor-share.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DoctorShareListComponent } from './doctor-share-list/doctor-share-list.component';


@Component({
  selector: 'app-doctor-payoutpercentage',
  templateUrl: './doctor-payoutpercentage.component.html',
  styleUrls: ['./doctor-payoutpercentage.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class DoctorPayoutpercentageComponent {
DoctorId = "0";
  classid = 0;
  doctorId = 0
  serviceId = 0
  groupId = 0
  type="1"
  autocompleteModeItem: string = "ConDoctor";
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

   ngAfterViewInit() {
         this.gridConfig.columnsList.find(col => col.key === 'op_IP_Type')!.template = this.actionsTemplate;
         this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
      }
      @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
      @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  allColumns = [

      { heading: "", key: "op_IP_Type", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 20 },
          
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Share%", key: "servicePercentage", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "ShareAmt", key: "serviceAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DocShareType", key: "docShrTypeS", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "ClassName", key: "className", sort: true, align: 'left', emptySign: 'NA' },
   {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
  ]
  allFilters = [
    { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.StartsWith },//"10006"
    { fieldName: "ShrTypeSerOrGrp", fieldValue: String(this.type), opType: OperatorComparer.StartsWith }
  ]
  gridConfig: gridModel = {
    apiUrl: "Doctor/DoctorshareListbyName",
    columnsList: this.allColumns,
    sortField: "DoctorShareId",
    sortOrder: 0,
    filters: this.allFilters
  }
  constructor(
    public _DoctorShareService: DoctorShareService,
    public datePipe: DatePipe, private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog, public _formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  
  }

  onChange() {
    debugger
    this.type = this._DoctorShareService.DocFormGroup.get('Type').value
    this.getfilterdata();
  }
  
  getfilterdata() {
    debugger
    this.gridConfig = {
      apiUrl: "Doctor/DoctorshareListbyName",
      columnsList: this.allColumns,
      sortField: "DoctorShareId",
      sortOrder: 0,
      filters: [
        { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.StartsWith },
        { fieldName: "ShrTypeSerOrGrp", fieldValue: String(this.type), opType: OperatorComparer.StartsWith }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    console.log(this.gridConfig)
  }

  ListView(value) {
    console.log(value)
    if (value.value !== 0)
      this.DoctorId = value.value
    else
      this.DoctorId = "0"

    this.getfilterdata();
  }

    onDelete(data: any) {
        this._DoctorShareService.deactivateTheStatus(data.doctorShareId).subscribe((response: any) => {
            this.toastr.success(response.message);
            this.grid.bindGridData();
        });
    }
  selectChangeDoctor(obj: any) {
    console.log(obj);
    this.doctorId = obj.value
  }


  onAdd() {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const dialogRef = this._matDialog.open(DoctorShareListComponent, {
      maxWidth: "85vw",
      height: "55%",
      width: "100%",
          
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
      this.grid.bindGridData();
    });
  }

    onEdit(row) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const dialogRef = this._matDialog.open(DoctorShareListComponent, {
     maxWidth: "85vw",
      height: "55%",
      width: "100%",
      data:row
    
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
      this.grid.bindGridData();
    });
  }

}