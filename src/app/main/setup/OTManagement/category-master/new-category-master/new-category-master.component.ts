import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { CategoryMasterService } from '../category-master.service';

@Component({
  selector: 'app-new-category-master',
  templateUrl: './new-category-master.component.html',
  styleUrls: ['./new-category-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewCategoryMasterComponent implements OnInit {

  vCategoryId:any;
  vCategoryName:any;
  registerObj: any;

  constructor(
    public _categoryMasterService: CategoryMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewCategoryMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(){

  }
  
  onClose(){
    this._categoryMasterService.myform.reset();
    this.dialogRef.close();
  }

}
export class CategoryMasterList {
  SystemId:number;
  SystemName:string;
  IsDeleted:String;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(CategoryMasterList) {
    {
      this.SystemId = CategoryMasterList.SystemId || '';
      this.SystemName = CategoryMasterList.SystemName || '';
      this.IsDeleted = CategoryMasterList.IsDeleted;
    }
  }
}
