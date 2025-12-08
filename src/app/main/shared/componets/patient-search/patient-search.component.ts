import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RefundbillService } from 'app/main/opd/refundbill/refundbill.service';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PatientSearchComponent implements OnInit {
  SearchGroupForm :FormGroup;
  registerObj:any;
  PatientName:any;


constructor(
 public _formbuilder:FormBuilder,
 public _RefundbillService:RefundbillService,
 public _matdailog:MatDialog
){}
ngOnInit(): void {
 this.SearchGroupForm = this.createSearchform();
}

createSearchform(){
  return this._formbuilder.group({
    RegId:[0]
  })
}
  getSelectedObj(obj) {
     console.log(obj); 
     this.registerObj = obj;
     this.PatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
  }
}
