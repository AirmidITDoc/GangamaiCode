import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { StockManagementService } from './stock-management.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.scss']
})
export class StockManagementComponent implements OnInit {

  StoreList: any = [];
  
  screenFromString = 'app-stock-management';
  StockFormGroup: FormGroup;
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'ItemCode',
    'ItemName',
    'Hk.Bal',
    'ToStoreBal',
    'IssueQty',
    'MinQty',
    'MaxQty',
    ];

  constructor(public _StockmangeService: StockManagementService,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.createStockForm();
    
    this.getStoreList();

  }

  getStoreList() {
    this._StockmangeService.getStoreCombo().subscribe(data => { this.StoreList = data; })
  }

  createStockForm() {
     this.StockFormGroup = this.formBuilder.group({
      IssueToStore: [''],
      Linen: [''],
      ToStock: [''],
      StoreId1: [''],
      StoreId: [''],
      StockDate: [''],
      StockTime: [''],
      NoOfItem: [''],
      Remark: [''],
      RecivedBy: [''],
      
    });
  }

  onSave() {
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==',dateTimeObj);
    this.dateTimeObj=dateTimeObj;
  }

  
  onClose() {
    // this.dialogRef.close();
  }
}

