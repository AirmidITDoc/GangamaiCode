import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { HospitalService } from './hospital.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewHospitalComponent } from './new-hospital/new-hospital.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatAccordion } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-hospital-master',
  templateUrl: './hospital-master.component.html',
  styleUrls: ['./hospital-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class HospitalMasterComponent implements OnInit {

  myformSearch: FormGroup;
  msg: any;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;


  constructor(public _HospitalService: HospitalService,
    public _matDialog: MatDialog, public toastr: ToastrService
  ) { }
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
 ngAfterViewInit() {
        // Assign the template to the column dynamically
       this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }

  allcolumns = [
    { heading: "Hospital Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', Width: 300 },
    { heading: "Hospital Address", key: "hospitalAddress", sort: true, align: 'left', emptySign: 'NA', Width: 400 },
    { heading: "City", key: "city", sort: true, align: 'left', emptySign: 'NA', Width: 100 },
    { heading: "Pin", key: "pin", sort: true, align: 'left', emptySign: 'NA', Width: 100 },
    { heading: "Phone", key: "phone", sort: true, align: 'left', emptySign: 'NA', Width: 100 }, 
    
    {
      heading: "Action", key: "action", align: "right", width: 280, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  
    }
  ]

  gridConfig: gridModel = {
    apiUrl: "HospitalMaster/HospitalMasterList",
    columnsList: this.allcolumns,
    sortField: "HospitalId",
    sortOrder: 1,
    filters: [{ fieldName: "HospitalName", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "IsActive", fieldValue: "0", opType: OperatorComparer.Contains }
    ]
  }


  ngOnInit(): void {
    this.myformSearch = this._HospitalService.createSearchForm();
  }

  hospitalname = '';
  active: any;
  onChangeFirst(event) {
    debugger
    console.log(event)
    // if (event.key == 13) {

      this.hospitalname = this.myformSearch.get('NameSearch').value + "%"
      this.active = this.myformSearch.get('IsActive').value
      this.getfilterdata();
    // }
  }

  getfilterdata() {
debugger
    this.gridConfig = {
      apiUrl: "HospitalMaster/HospitalMasterList",
      columnsList: this.allcolumns,
      sortField: "HospitalId",
      sortOrder: 0,
      filters: [
        { fieldName: "HospitalName", fieldValue: this.hospitalname, opType: OperatorComparer.Contains },
        { fieldName: "IsActive", fieldValue: this.active, opType: OperatorComparer.Equals },

      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }


  Clearfilter(event) {
    console.log(event)
    if (event == 'Hospital')
      this.myformSearch.get('Hospital').setValue("")

    this.onChangeFirst(event);
  }


  onAdd() {

    const dialogRef = this._matDialog.open(NewHospitalComponent, {
      maxWidth: "95vw",
      maxHeight: "100vh",
      width: "100%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);

    });
  }

  // onEdit(obj){
  //   const dialogRef = this._matDialog.open(NewHospitalComponent, {
  //      maxWidth: "95vw",
  //       maxHeight: "100vh",
  //       width: "100%",
  //       data: obj
    
  // });
  // dialogRef.afterClosed().subscribe((result) => {
  //   if(result)
  //     this.grid.bindGridData();
  // });
  // }

  onSave(obj: any = null) {
    // const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    // buttonElement.blur(); // Remove focus from the button
    console.log(obj)
    const dialogRef = this._matDialog.open(NewHospitalComponent,
      {
        maxWidth: "95vw",
        maxHeight: "100vh",
        width: "100%",
        data: obj
      });
    dialogRef.afterClosed().subscribe(result => {
        if(result)
      this.grid.bindGridData();
      
    });
  }
}


export class HospitalMaster {
  hospitalId: any;
  hospitalName: any;
  hospitalAddress: any;
  city: any;
  CityId: any;
  pin: any;
  phone: any;
  emailId: any;
  webSiteInfo: any;
  header: any;
  isActive: any;
 opdBillingCounterId: any;
 opdReceiptCounterId: any;
 opdRefundBillCounterId: any;
 opdRefundBillReceiptCounterId: any;
 opdAdvanceCounterId: any;
 opdRefundAdvanceCounterId: any;
 ipdAdvanceCounterId: any;
 ipdBillingCounterId: any;
  ipdReceiptCounterId: any;
  ipdRefundOfBillCounterId: any;
  ipdRefundOfBillReceiptCounterId: any;
  ipdRefundOfAdvanceCounterId: any;
  hospitalHeaderLine:any;
  /**
   * Constructor
   *
   * @param HospitalMaster
   */
  constructor(HospitalMaster) {
    {
      this.hospitalId = HospitalMaster.hospitalId || 0;
      this.hospitalName = HospitalMaster.hospitalName || "";
      this.hospitalAddress = HospitalMaster.hospitalAddress || "";
      this.city = HospitalMaster.city || "";
      this.CityId = HospitalMaster.CityId ||  0;
      this.pin = HospitalMaster.pin || "";
      this.phone = HospitalMaster.phone || "";
      this.emailId = HospitalMaster.emailId || "";
      this.webSiteInfo = HospitalMaster.webSiteInfo || "";
      this.header = HospitalMaster.header || "";
      this.isActive = HospitalMaster.isActive || true;
      this.opdBillingCounterId = HospitalMaster.header || 0;
 this.opdReceiptCounterId = HospitalMaster.opdReceiptCounterId ||  0;
 this.opdRefundBillCounterId = HospitalMaster.opdRefundBillCounterId ||  0;
 this.opdRefundBillReceiptCounterId = HospitalMaster.opdRefundBillReceiptCounterId ||  0;
 this.opdAdvanceCounterId = HospitalMaster.opdAdvanceCounterId ||  0;
 this.opdRefundAdvanceCounterId = HospitalMaster.opdRefundAdvanceCounterId ||  0;
this. ipdAdvanceCounterId = HospitalMaster.ipdAdvanceCounterId || 0;
 this.ipdBillingCounterId = HospitalMaster.ipdBillingCounterId || 0;
  this.ipdReceiptCounterId = HospitalMaster.ipdReceiptCounterId ||  0;
 this.ipdRefundOfBillCounterId = HospitalMaster.ipdRefundOfBillCounterId ||  0;
 this.ipdRefundOfBillReceiptCounterId = HospitalMaster.ipdRefundOfBillReceiptCounterId ||  0;
  this.ipdRefundOfAdvanceCounterId = HospitalMaster.ipdRefundOfAdvanceCounterId ||  0;
  this.hospitalHeaderLine = HospitalMaster.hospitalHeaderLine ||  '';
    }
  }
}