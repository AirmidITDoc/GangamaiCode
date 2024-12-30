import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { OttableMasterService } from '../ottable-master.service';

@Component({
  selector: 'app-new-ottable-master',
  templateUrl: './new-ottable-master.component.html',
  styleUrls: ['./new-ottable-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewOttableMasterComponent implements OnInit {

  vOtTableId: any;
  registerObj: any;
  vOtRoomName: any;
  vLocationid:any;
  isLocationSelected:boolean=false;

  constructor(
    public _otTableMasterService: OttableMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewOttableMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }
  onSubmit() {

  }

  onClose(){
    this._otTableMasterService.myform.reset();
    this.dialogRef.close();
  }
}
export class OtTableMasterList {
  OtTableId:number;
  OtRoomName:string;
  Floor:any;
  IsDeleted:String;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtTableMasterList) {
    {
      this.OtTableId = OtTableMasterList.OtTableId || '';
      this.OtRoomName = OtTableMasterList.OtRoomName || '';
      this.Floor = OtTableMasterList.Floor || '';
      this.IsDeleted = OtTableMasterList.IsDeleted;
    }
  }
}