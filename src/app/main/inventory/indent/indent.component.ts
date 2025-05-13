import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IndentService } from './indent.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material/tabs';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { NewIndentComponent } from './new-indent/new-indent.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
    selector: 'app-indent',
    templateUrl: './indent.component.html',
    styleUrls: ['./indent.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IndentComponent implements OnInit {
    hasSelectedContacts: boolean;
    IndentSearchGroup: FormGroup;
    autocompletestore: string = "Store";
    Status="0"
    FromStore:any = String(this.accountService.currentUserValue.user.storeId);
    Tostore:any="0"
    fromDate = "2024-01-01"//this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate =this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
     @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('isVerifiedstatus') isVerifiedstatus!: TemplateRef<any>;
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'isInchargeVerify')!.template = this.isVerifiedstatus;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
       
      }

    allcolumns = [

        { heading: "Verify", key: "isInchargeVerify", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IndentNo", key: "indentNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Indent Date", key: "indentDate", sort: true, align: 'left', emptySign: 'NA',type:6 },
        { heading: "From Store Name", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "To Store Name", key: "toStoreName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Added By", key: "addedby", sort: true, align: 'left', emptySign: 'NA' },
        {
             heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
             template: this.actionButtonTemplate  // Assign ng-template to the column
         } 
    ]

    gridConfig: gridModel = {
        apiUrl: "Indent/IndentList",
        columnsList: this.allcolumns,
        sortField: "IndentId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Status", fieldValue: this.Status, opType: OperatorComparer.Equals }
        ]
    }

    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;
    GetDetails1(data) {
        debugger
        let IndentId = data.indentId
        this.gridConfig1 = {
            apiUrl: "Indent/IndentDetailsList",
            columnsList:[
                { heading: "Item", key: "itemId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "QTY", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Issue QTY", key: "issQty", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Pending QTY", key: "bal", sort: true, align: 'left', emptySign: 'NA' }
               ],
            sortField: "IndentId",
            sortOrder: 0,
            filters: [
                { fieldName: "IndentId", fieldValue:String(IndentId), opType: OperatorComparer.Equals }
              
            ]
        }
        this.isShowDetailTable = true;
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }

    constructor(
        public _IndentService: IndentService,  private commonService: PrintserviceService,
        public toastr: ToastrService, public _matDialog: MatDialog,private accountService: AuthenticationService,
        public datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.IndentSearchGroup = this._IndentService.IndentSearchFrom();
    }

    ListView(value) {
        if (value.value !== 0)
            this.FromStore = value.value
        else
            this.FromStore = "0"
        this.onChangeFirst(value);
    }

    ListView1(value) {
        if (value.value !== 0)
            this.Tostore = value.value
        else
            this.Tostore = "0"
        this.onChangeFirst(value);
    }

    onChangeFirst(value) {
debugger
        if(this.IndentSearchGroup.get('Status').value == true){
            this.Status = "1"
        }else{
            this.Status = "0"
        }

        this.isShowDetailTable = false;
        this.fromDate = this.datePipe.transform(this.IndentSearchGroup.get('startdate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.IndentSearchGroup.get('enddate').value, "yyyy-MM-dd")
        this.FromStore = this.IndentSearchGroup.get("FromStoreId").value || this.FromStore
        this.Tostore = this.IndentSearchGroup.get("ToStoreId").value || this.Tostore
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "Indent/IndentList",
            columnsList: this.allcolumns,
            sortField: "IndentId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
                { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "Status", fieldValue: this.Status, opType: OperatorComparer.Equals }
            ],
            row: 25
        }

        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

    }


    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewIndentComponent,
            {
                maxWidth: "90vw",
                height: '650px',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            // if (result) {
                that.grid.bindGridData();
            // }
        });
    }

     OnEdit(contact) {
        console.log(contact)
        if(this.IndentSearchGroup.get('Status').value == 0 ){
        
          const dialogRef = this._matDialog.open(NewIndentComponent,
            {
                maxWidth: "90vw",
                height: '700px',
                width: '100%',
              data: {
                Obj: contact,
                // chkNewGRN: this.chkNewGRN
              }
            });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            // this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
          });
        }
        else{
          this.toastr.warning('Verified Record connot be edited', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
        }
       
       
      }

      
  onVerify(row) {
   
    let submitData = {
      "indentId": row.indentId,
      "isInchargeVerifyId": this.accountService.currentUserValue.userId

    };
   this._IndentService.getVerifyIndent(submitData).subscribe(response => {
      this.toastr.success(response);
      if (response) {
        this.commonService.Onprint("IndentId", row.indentId, "IndentwiseReport");
        this.onChangeFirst(event);
       }
 
     });
  }
    viewgetIndentReportPdf(contact) {
         this.commonService.Onprint("IndentId", contact.indentId, "IndentwiseReport");
      }
    
      viewgetIndentVerifyReportPdf(contact) {
        this.commonService.Onprint("IndentId", contact, "IndentWiseReport");
      }
    selectChangeStore(obj: any) {
        this.gridConfig.filters[2].fieldValue = obj.value
    }
}