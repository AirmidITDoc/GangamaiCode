import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ServiceMasterService } from '../service-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-package-det',
  templateUrl: './add-package-det.component.html',
  styleUrls: ['./add-package-det.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AddPackageDetComponent implements OnInit {


  registerObj:any;

  constructor(
    public _serviceMasterService: ServiceMasterService,
    public toastr : ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPackageDetComponent>,
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
    }
  }





  onClose(){

  } 
}
