import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations'; 
import { SalesHospitalService } from '../sales-hospital-new.service';

@Component({
  selector: 'app-substitutes',
  templateUrl: './substitutes.component.html',
  styleUrls: ['./substitutes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SubstitutesComponent implements OnInit {
  displayedColumns = [
    'ItemName',
    'ItemGenericName'
  ];

  SubtituteForm: FormGroup;
  sIsLoading: string = '';
  itemDetails:any;
  itemnamelist:any=[];
  autocompleteModeItemGenericName: string = "ItemGeneric";
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  dsItemList = new MatTableDataSource<ItemList>();

  constructor(
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<SubstitutesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _SalesService: SalesHospitalService,
    private _formBuilder: UntypedFormBuilder
  ) { this.SubtituteForm = this.CreateSubtituteForm();}

  ngOnInit(): void {
    if(this.data){
      this.itemDetails = this.data?.obj
      console.log( this.itemDetails )
      this.itemnamelist.push(
        { 
          itemId: this.itemDetails?.ItemId ?? this.itemDetails.itemID ?? this.itemDetails.ItemID,
          itemName: this.itemDetails?.ItemName, 
        } 
      ) 
      this.SubtituteForm.get('ItemId').setValue(this.itemnamelist[0])  
      this.getItemList(this.itemnamelist);
    } 
    }
  CreateSubtituteForm() {
    return this._formBuilder.group({
      ItemId: [0],
      itemGenericNameId: [0]
    });
  }
  onItemChange(obj): void {
    console.log(obj)
    this.getItemList(obj);
  } 

  itemGenericNameId:any;
  getSelectedObjGeneric(obj) {
    console.log(obj);
    this.itemGenericNameId = obj.value
    this.getItemList(obj);
  }
  getItemList(Param) {
    var data = {
      "first": 0,
      "rows": 25,
      "sortField": "ItemId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "ItemId", "fieldValue": String(Param?.itemId || 0), "opType": "Contains" },
        { "fieldName": "ItemGenericId", "fieldValue": String(this.itemGenericNameId || 0), "opType": "Contains" }
        // { "fieldName": "ItemGenericId", "fieldValue": String(Param?.itemGenericNameId || 0), "opType": "Contains" }
      ],
      "exportType": "JSON",
      "columns": [
        { "data": "string", "name": "string" }
      ]
    }
    this._SalesService.getSubstitutes(data).subscribe(reponse => { 
      this.dsItemList.data = reponse.data as ItemList[];
      this.dsItemList.sort = this.sort;
      this.dsItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  onClose() {
    this.dialogRef.close();
  }
  getValidationMessages() {
    return {
      itemGenericNameId: [
        { name: "required", Message: "ItemGeneric Name No is required" }
      ]
    };
  }
}
export class ItemList {
  ItemName: string;
  BatchNo: number;
  /**
   * Constructor
   *
   * @param ItemList
   */
  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || "";
      this.BatchNo = ItemList.BatchNo || 0;
    }
  }
}
