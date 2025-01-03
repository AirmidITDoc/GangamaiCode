import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { SurgeryMasterService } from '../surgery-master.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-new-surgery-master',
  templateUrl: './new-surgery-master.component.html',
  styleUrls: ['./new-surgery-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewSurgeryMasterComponent implements OnInit {

  registerObj:any;
  vSurgeryId:string;
  vProcedureName:string;
  vCategoryName:string;
  vDepartmentName:string;
  vAmount:string;
  vSystemName:string;
  vSiteName:string;
  vTemplateName:string;
  isDepartmentSelected:boolean=false;
  filteredOptionsDep: Observable<string[]>;
  optionsDep: any[] = [];
  DepartmentList: any = [];

  constructor(
    public _surgeryMasterService: SurgeryMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewSurgeryMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getDepartmentList();
  }

  onSubmit(){

  }

  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }

  }

  getDepartmentList(){
    debugger
    this._surgeryMasterService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this._surgeryMasterService.myform.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      if(this.registerObj){
        
        const DValue = this.DepartmentList.filter(item => item.DepartmentName == this.registerObj.DepartmentName);
        console.log("Departmentid:",DValue)
        this._surgeryMasterService.myform.get('Departmentid').setValue(DValue[0]);
        this._surgeryMasterService.myform.updateValueAndValidity();
        return;
      }
      // this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }
  getOptionTextDep(option) {
    
    return option && option.DepartmentName ? option.DepartmentName : '';
  }
  onClose(){
    this._surgeryMasterService.myform.reset();
    this.dialogRef.close();
  }

}
export class SurgeryMasterList {
  SurgeryId:number;
  ProcedureName:string;
  CategoryName:string;
  DepartmentName:string;
  Amount:number;
  Site:string;
  IsDeleted:String;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(SurgeryMasterList) {
    {
      this.SurgeryId = SurgeryMasterList.SurgeryId || '';
      this.ProcedureName = SurgeryMasterList.ProcedureName || '';      
      this.CategoryName = SurgeryMasterList.CategoryName || '';
      this.DepartmentName = SurgeryMasterList.DepartmentName || '';   
      this.Amount = SurgeryMasterList.Amount || '';   
      this.Site = SurgeryMasterList.Site || '';
      this.IsDeleted = SurgeryMasterList.IsDeleted;
    }
  }
}
