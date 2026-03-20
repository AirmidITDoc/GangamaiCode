import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { Observable } from 'rxjs';
import { SalesService } from '../sales.service';

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
    public _SalesService: SalesService,
    private _formBuilder: UntypedFormBuilder
  ) { this.SubtituteForm = this.CreateSubtituteForm();}
  ngOnInit(): void {
    debugger
    if(this.data){
      this.itemDetails = this.data?.obj
      console.log( this.itemDetails )
       this.itemnamelist.push(
        {
          itemName:this.itemDetails?.ItemName,
          itemId:this.itemDetails?.ItemId,
        }
       )
       
       this.SubtituteForm.get('ItemId').setValue(this.itemnamelist)
       this.getSelectedObjextMobile(this.itemnamelist)
    }
  }
      getSelectedObjextMobile(event) { 
        if (event) {
        this.SubtituteForm.get('ItemId').setValue(event) 
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

  getSelectedObjGeneric(obj) {
    console.log(obj);
    this.getItemList(obj);
  }
  getItemList(Param) {
    const data = {
      "ItemId": Param.ItemID || 0,
      "ItemGenericId": Param.ItemGenericNameId || 0,
    }
    this._SalesService.getSubstitutes(data).subscribe(data => {
      this.dsItemList.data = data as ItemList[];
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
