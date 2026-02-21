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
import { DoctorShareServiceService } from './doctor-share-service.service';


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
  serviceId = 0
  groupId = 0
  type = "1"
  SearchForm:FormGroup
  autocompleteModeDoctor: string = "ConDoctor";
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'op_IP_Type')!.template = this.actionsTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'shrTypeSerOrGrp')!.template = this.actionsTemplate1;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allColumns = [

    { heading: "", key: "op_IP_Type", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:70 },
   // { heading: "", key: "shrTypeSerOrGrp", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:30 },
    { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "ClassName", key: "className", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Share Type", key: "docShrTypeS", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Share%", key: "servicePercentage", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "ShareAmt", key: "serviceAmount", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount  },
    {
      heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]
  allFilters = [
    { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.StartsWith },//"10006"
    { fieldName: "ShrTypeSerOrGrp", fieldValue: String(this.type), opType: OperatorComparer.StartsWith }
  ]
  gridConfig: gridModel = {
    apiUrl: "DoctorPAy/DoctorshareListByName",
    columnsList: this.allColumns,
    sortField: "DoctorShareId",
    sortOrder: 0,
    filters: this.allFilters
  }
  constructor(
    public _DoctorShareService: DoctorShareServiceService,
    public datePipe: DatePipe, private _FormvalidationserviceService: FormvalidationserviceService,
    public _matDialog: MatDialog, public _formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.SearchForm=this.Createsearchform()
  }


   Createsearchform() {
    return this._formBuilder.group({ 
      DoctorName:'',
      Type: ['1'],
    })
  }


  onChange() {

    this.type = this.SearchForm.get('Type').value
    this.getfilterdata();
  }

  getfilterdata() {
    debugger
    this.gridConfig = {
      apiUrl: "DoctorPAy/DoctorshareListbyName",
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
    debugger
    if (value.value !== 0)
      this.DoctorId = value.value
    else
      this.DoctorId = "0"

    this.getfilterdata();
  }

  onDelete(data: any) {
    this._DoctorShareService.deactivateTheStatus(data.doctorShareId).subscribe((response: any) => {
      this.grid.bindGridData();
    });
  }

  onAdd() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const dialogRef = this._matDialog.open(DoctorShareListComponent, {
        width: "950px",
        maxWidth: "95vw",
        height: "auto",
        autoFocus: false,
        disableClose: false
    });
    dialogRef.afterClosed().subscribe((result) => {
     this.gridConfig.filters[0].fieldValue="0"
      this.grid.bindGridData();
    });
  }

  onEdit(row) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const dialogRef = this._matDialog.open(DoctorShareListComponent, {
        width: "950px",
        maxWidth: "95vw",
        height: "auto",
        autoFocus: false,
        disableClose: false,
        data: row
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.gridConfig.filters[0].fieldValue="0"
      this.grid.bindGridData();
    });
  }

}