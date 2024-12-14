import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { IPSearchListService } from '../../ip-search-list.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/core/services/config.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { InitiateProcessComponent } from './initiate-process/initiate-process.component';

@Component({
  selector: 'app-initiate-discharge',
  templateUrl: './initiate-discharge.component.html',
  styleUrls: ['./initiate-discharge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InitiateDischargeComponent implements OnInit {

  displayedColumns:string[]=[
    'DepartmentName',
    'IsApprove',
    'ApprovedBy',
    'IsNoDues',
    'Comments'
  ]

  selectedAdvanceObj:any
  DischargeInitiateForm:FormGroup
    filteredOptionsDoctorname: any;
    filteredOptionsDisctype: Observable<string[]>;
    DoctorNameList:any;
    DischargeTypeList:any;
    isDoctorSelected: boolean = false;
    isDistypeSelected: boolean = false;
    optionsDischargeType: any[] = [];
    optionsDoctor: any[] = [];
    vDoctorId:any;
    vDescType:any;

    dsApprovList = new MatTableDataSource<ApprovList>();

  constructor(
     public _IpSearchListService: IPSearchListService,
        private accountService: AuthenticationService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        private advanceDataStored: AdvanceDataStored,
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
    this.getDoctorNameList();
    this.getDischargetypeCombo();
  }
  CreateDischargeInitiateForm(){
    return this._formbuilder.group({
      DischargeTypeId:[''],
      DoctorID:['']
    });
  }

  getDoctorNameList() {
    this._IpSearchListService.getDoctorMaster1Combo().subscribe(data => {
      this.DoctorNameList = data;
      this.optionsDoctor = this.DoctorNameList.slice();
      this.filteredOptionsDoctorname = this.DischargeInitiateForm.get('DoctorID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctorname(value) : this.DoctorNameList.slice()),
      );

      if (this.selectedAdvanceObj) {
        const ddValue = this.DoctorNameList.filter(item => item.DoctorID == this.selectedAdvanceObj.DocNameID);
        //console.log(ddValue)
        this.DischargeInitiateForm.get('DoctorID').setValue(ddValue[0]);
        this.DischargeInitiateForm.updateValueAndValidity();
      }
    });
  }  

  getDischargetypeCombo() {
    this._IpSearchListService.getDischargetypeCombo().subscribe(data => {
      this.DischargeTypeList = data;
      this.optionsDischargeType = this.DischargeTypeList.slice();
      this.filteredOptionsDisctype = this.DischargeInitiateForm.get('DischargeTypeId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDischargeType(value) : this.DischargeTypeList.slice()),
      ); 
    });
  } 
  private _filterDischargeType(value: any): string[] {
    if (value) {
      const filterValue = value && value.DischargeTypeName ? value.DischargeTypeName.toLowerCase() : value.toLowerCase();
      return this.DischargeTypeList.filter(option => option.DischargeTypeName.toLowerCase().includes(filterValue));
    }
  }
  private _filterDoctorname(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.DoctorNameList.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextDoctor(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextDisctype(option) {
    return option && option.DischargeTypeName ? option.DischargeTypeName : '';
  }
  onClose(){
    this.dialogRef.close();
  }
  DischargeInitiate(){
    const dialogRef = this._matDialog.open(InitiateProcessComponent,
      {
        maxWidth: "75vw",
        height: '70%',
        width: '100%',
        data: {
          Obj: this.selectedAdvanceObj
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
      });
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
