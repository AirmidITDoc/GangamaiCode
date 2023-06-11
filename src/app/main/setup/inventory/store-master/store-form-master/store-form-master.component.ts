import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StoreMasterService } from '../store-master.service';
import { MatDialogRef } from '@angular/material/dialog';
import { StoreMasterComponent } from '../store-master.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-store-form-master',
  templateUrl: './store-form-master.component.html',
  styleUrls: ['./store-form-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class StoreFormMasterComponent implements OnInit {

  msg:any;

  constructor(public _StoreService: StoreMasterService,
      public dialogRef: MatDialogRef<StoreMasterComponent>,
    ) { }

    
  ngOnInit(): void {
  //

  }

   
  onSubmit() {
    if (this._StoreService.myform.valid) {
      if (!this._StoreService.myform.get("ItemID").value) {
        var m_data = {
          insertStoreMaster: {
            "StoreShortName": this._StoreService.myform.get("StoreShortName").value.trim(),
            "StoreName": (this._StoreService.myform.get("StoreName").value).trim(),
            "IndentPrefix": this._StoreService.myform.get("IndentPrefix").value.trim(),
            "IndentNo": (this._StoreService.myform.get("IndentNo").value).trim(),
            "PurchasePrefix": this._StoreService.myform.get("PurchasePrefix").value.trim(),
            "PurchaseNo": (this._StoreService.myform.get("PurchaseNo").value).trim(),
            "GrnPrefix": this._StoreService.myform.get("GrnPrefix").value.trim(),
            "GrnNo": (this._StoreService.myform.get("GrnNo").value).trim(),
            "GrnreturnNoPrefix": this._StoreService.myform.get("GrnreturnNoPrefix").value.trim(),
            "GrnreturnNo": (this._StoreService.myform.get("GrnreturnNo").value).trim(),
            "IssueToDeptPrefix": this._StoreService.myform.get("IssueToDeptPrefix").value.trim(),
            "IssueToDeptNo": (this._StoreService.myform.get("IssueToDeptNo").value).trim(),
            "ReturnFromDeptNoPrefix": this._StoreService.myform.get("ReturnFromDeptNoPrefix").value.trim(),
            "ReturnFromDeptNo": (this._StoreService.myform.get("ReturnFromDeptNo").value).trim(),
            "IsDeleted": Boolean(JSON.parse(this._StoreService.myform.get("IsDeleted").value)),
            
          }
        }
     
        this._StoreService.insertStoreMaster(m_data).subscribe(data => {
          this.msg = data;
        });
      
      }
      else {
        var m_dataUpdate = {
          updateItemMaster: {
            "ItemID": this._StoreService.myform.get("ItemID").value,
            "StoreShortName": this._StoreService.myform.get("StoreShortName").value.trim(),
            "StoreName": (this._StoreService.myform.get("StoreName").value).trim(),
            "IndentPrefix": this._StoreService.myform.get("IndentPrefix").value.trim(),
            "IndentNo": (this._StoreService.myform.get("IndentNo").value).trim(),
            "PurchasePrefix": this._StoreService.myform.get("PurchasePrefix").value.trim(),
            "PurchaseNo": (this._StoreService.myform.get("PurchaseNo").value).trim(),
            "GrnPrefix": this._StoreService.myform.get("GrnPrefix").value.trim(),
            "GrnNo": (this._StoreService.myform.get("GrnNo").value).trim(),
            "GrnreturnNoPrefix": this._StoreService.myform.get("GrnreturnNoPrefix").value.trim(),
            "GrnreturnNo": (this._StoreService.myform.get("GrnreturnNo").value).trim(),
            "IssueToDeptPrefix": this._StoreService.myform.get("IssueToDeptPrefix").value.trim(),
            "IssueToDeptNo": (this._StoreService.myform.get("IssueToDeptNo").value).trim(),
            "ReturnFromDeptNoPrefix": this._StoreService.myform.get("ReturnFromDeptNoPrefix").value.trim(),
            "ReturnFromDeptNo": (this._StoreService.myform.get("ReturnFromDeptNo").value).trim(),
            "IsDeleted": Boolean(JSON.parse(this._StoreService.myform.get("IsDeleted").value)),
         
            
          }
        }
        this._StoreService.updateStoreMaster(m_dataUpdate).subscribe(data => {
          this.msg = data;
        });
     
      }
      this.onClose();
    }
  }
  onEdit(row) {
    var m_data = {
      "StoreId":row.StoreId,
      "StoreShortName":row.StoreShortName.trim(),
      "StoreName":row.StoreName.trim(),
      "IndentPrefix":row.IndentPrefix.trim(),
      "IndentNo":row.IndentNo.trim(),
      "PurchasePrefix":row.PurchasePrefix.trim(),
      "PurchaseNo":row.PurchaseNo.trim(),
      "GrnPrefix":row.GrnPrefix.trim(),
      "GrnNo":row.GrnNo.trim(),
      "GrnreturnNoPrefix":row.GrnreturnNoPrefix.trim(),
      "GrnreturnNo":row.GrnreturnNo.trim(),
     "IssueToDeptPrefix":row.IssueToDeptPrefix.trim(),
      "IssueToDeptNo":row.IssueToDeptNo.trim(),
     "ReturnFromDeptNoPrefix":row.ReturnFromDeptNoPrefix.trim(),
      "ReturnFromDeptNo":row.ReturnFromDeptNo.trim(),
     "IsDeleted":JSON.stringify(row.IsDeleted),
      "UpdatedBy":row.UpdatedBy,
      
      }
    
    
    this._StoreService.populateForm(m_data);
  }

  onClear() {
    this._StoreService.myform.reset();
  }
  onClose() {
    this._StoreService.myform.reset();
    this.dialogRef.close();
  }

}
