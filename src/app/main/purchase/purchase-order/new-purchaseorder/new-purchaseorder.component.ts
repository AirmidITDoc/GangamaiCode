import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemNameList, PurchaseItemList } from '../purchase-order.component';
import { SupplierMaster } from 'app/main/setup/inventory/supplier-master/supplier-master.component';
import { IndentList } from 'app/main/pharmacy/sales/sales.component';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { PurchaseOrderService } from '../purchase-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FinalFormModel, GRNItemResponseType, GSTType, PurchaseFormModel, ToastType } from '../update-purchaseorder/types';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
  selector: 'app-new-purchaseorder',
  templateUrl: './new-purchaseorder.component.html',
  styleUrls: ['./new-purchaseorder.component.scss']
})
export class NewPurchaseorderComponent {
  constructor(){}
}