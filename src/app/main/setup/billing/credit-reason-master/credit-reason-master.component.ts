import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { CreditReasonMasterService } from './credit-reason-master.service';

@Component({
  selector: 'app-credit-reason-master',
  templateUrl: './credit-reason-master.component.html',
  styleUrls: ['./credit-reason-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CreditReasonMasterComponent implements OnInit {

  constructor(
    public _CreditReasonMasterService: CreditReasonMasterService,
    public toastr: ToastrService,
    public _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

}
