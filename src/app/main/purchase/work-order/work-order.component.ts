import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { WorkOrderService } from './work-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemNameList } from '../purchase-order/purchase-order.component';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UpdateWorkorderComponent } from './update-workorder/update-workorder.component';
import { SearchInforObj } from 'app/main/opd/op-search-list/opd-search-list/opd-search-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { element } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Printsal } from 'app/main/pharmacy/sales/sales.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class WorkOrderComponent implements OnInit {
 
     myform: FormGroup;
  autocompletestore: string = "Store";
  autocompleteSupplier: string = "SupplierMaster"

  SupplierId="3";
  StoreId="2";
  fromDate = "2025-01-01"//this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = "2025-04-27"//this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
   
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

  }

  allcolumns = [

    { heading: "WO No", key: "woNo", sort: true, align: 'left', emptySign: 'NA',width: 50 },
    { heading: "Date", key: "time", sort: true, align: 'left', emptySign: 'NA', width: 100},
    { heading: "SupplierName", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "TotalAmt", key: "woTotalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "GstAmount", key: "woVatAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "DiscAmount", key: "woDiscAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
   
    { heading: "Netamount", key: "woNetAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Remark", key: "woRemark", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    {
      heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
  } 
  ];

     constructor(public _WorkOrderService: WorkOrderService, public _matDialog: MatDialog,public datePipe: DatePipe,
             public toastr: ToastrService,private _formBuilder: UntypedFormBuilder, private accountService: AuthenticationService,)
                 { }
         @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
         gridConfig: gridModel = {
             apiUrl: "WorkOrder/WorkOrderList",
             columnsList:this.allcolumns,
             sortField: "WOId",
             sortOrder: 0,
             filters: [
                 { fieldName: "ToStoreId", fieldValue: this.StoreId, opType: OperatorComparer.Equals },
                 { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                 { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                 { fieldName: "Supplier_Id", fieldValue: this.SupplierId, opType: OperatorComparer.Equals }
             ]
         }
     
         ngOnInit(): void {
             this.myform=this.createseacrhform();
          }
     
 
          createseacrhform(): FormGroup {
             return this._formBuilder.group({
                ToStoreId: [this.accountService.currentUserValue.user.storeId],
                SupplierId:[0],
                     fromDate: [(new Date()).toISOString()],
                     enddate: [(new Date()).toISOString()]
                       
             });
         }
 
         onSave(row: any = null) {
             const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
             buttonElement.blur(); // Remove focus from the button
     
             let that = this;
             const dialogRef = this._matDialog.open( UpdateWorkorderComponent, 
                 {
                  maxWidth: "100%",
                  height: '95%',
                  width: '95%',
                     data: row
                 });
             dialogRef.afterClosed().subscribe(result => {
                 if (result) {
                     that.grid.bindGridData();
                 }
             });
         }

         OnPrint(element){
          
         }

         ListView(value) {
          if (value.value !== 0)
              this.StoreId = value.value
            else
              this.StoreId = "0"
         this.onChangeFirst(value);
        }
      
        ListView1(value) {
              if (value.value !== 0)
              this.SupplierId = value.value
            else
              this.SupplierId = "0"
              this.onChangeFirst(value);
        }
        
          onChangeFirst(value) {
            debugger
            this.fromDate = this.datePipe.transform(this.myform.get('fromDate').value, "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(this.myform.get('enddate').value, "yyyy-MM-dd")
            this.StoreId = String(this.StoreId)
            this.SupplierId = this.SupplierId
          
            this.getfilterdata();
          }
        
          getfilterdata() {
            debugger
            this.gridConfig = {
              apiUrl: "WorkOrder/WorkOrderList",
              columnsList: this.allcolumns,
              sortField: "WOId",
              sortOrder: 0,
              filters: [
                { fieldName: "ToStoreId", fieldValue: this.StoreId, opType: OperatorComparer.Equals },
                 { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                 { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                 { fieldName: "Supplier_Id", fieldValue: this.SupplierId, opType: OperatorComparer.Equals }
              ],
              row: 25
            }
           
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
        
          }
 }
 