import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { IPSearchListService } from '../../ip-search-list.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/core/services/config.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-initiate-discharge',
  templateUrl: './initiate-discharge.component.html',
  styleUrls: ['./initiate-discharge.component.scss']
})
export class InitiateDischargeComponent {

  displayedColumns:string[]=[
    'DepartmentName',
    'IsApprove',
    'ApprovedBy',
    'IsNoDues',
    'Comments'
  ]

  selectedAdvanceObj:any
  DischargeInitiateForm:FormGroup
   

    autocompletcondoc: string = "ConDoctor";
    autocompletedichargetype: string = "DichargeType";

    dsApprovList = new MatTableDataSource<ApprovList>();

  constructor(
     public _IpSearchListService: IPSearchListService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public dialogRef: MatDialogRef<InitiateDischargeComponent>,
        public toastr: ToastrService,
        public _ConfigService : ConfigService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formbuilder:FormBuilder
  ) 
  { }

  ngOnInit(): void {
    this.DischargeInitiateForm = this.CreateDischargeInitiateForm();
    if(this.data){
      this.selectedAdvanceObj = this.data.Obj
      console.log(this.selectedAdvanceObj)
    }
 
  }
  CreateDischargeInitiateForm(){
    return this._formbuilder.group({
      DischargeTypeId:[''],
      DoctorID:['']
    });
  }

  onClose(){
    this.dialogRef.close();
  }
  DischargeInitiate(){
  //   const dialogRef = this._matDialog.open(InitiateProcessComponent,
  //     {
  //       maxWidth: "50vw",
  //       height: '70%',
  //       width: '100%',
  //       data: {
  //         Obj: this.selectedAdvanceObj
  //       }
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log(result)
  //     });
  }
}
export class ApprovList{
  DepartmentName:any;
  IsApprove:any;
  ApprovedBy:any;
  IsNoDues:any;
  Comments:any;
  AddedByDateTime:any

  constructor(ApprovList){
    {
      this.DepartmentName = ApprovList.DepartmentName || '';
      this.IsApprove = ApprovList.IsApprove || '';
      this.ApprovedBy = ApprovList.ApprovedBy || '';
      this.IsNoDues = ApprovList.IsNoDues || '';
      this.Comments = ApprovList.Comments || '';
      this.AddedByDateTime = ApprovList.AddedByDateTime || '';
    }
  }
}
