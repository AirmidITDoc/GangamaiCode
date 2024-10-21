import { Component, OnInit } from '@angular/core';
import { WardMasterService } from '../ward-master.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-ward',
  templateUrl: './new-ward.component.html',
  styleUrls: ['./new-ward.component.scss']
})
export class NewWardComponent implements OnInit {

  constructor(public _wardService: WardMasterService,
    public toastr : ToastrService) { }

  ngOnInit(): void {
  }
//   onSubmit() {
//     if (this._wardService.myform.valid) {
//         if (!this._wardService.myform.get("RoomId").value) {
//             var m_data = {
//                 wardMasterInsert: {
//                     roomName_1: this._wardService.myform
//                         .get("RoomName")
//                         .value.trim(),
//                     roomType_2: "1",
//                     locationId_3:
//                         this._wardService.myform.get("LocationId").value
//                             .LocationId,
//                     isAvailible_4: Boolean(
//                         JSON.parse(
//                             this._wardService.myform.get("IsAvailable")
//                                 .value
//                         )
//                     ),
//                     //  addedBy: 1,
//                     isActive_5: 0,
//                     classId:
//                         this._wardService.myform.get("ClassId").value
//                             .ClassId,
//                 },
//             };

//             this._wardService.wardMasterInsert(m_data).subscribe((data) => {
              
//                 if (data) {
//                     this.toastr.success('Record Saved Successfully.', 'Saved !', {
//                         toastClass: 'tostr-tost custom-toast-success',
//                       });
                     
//                 } else {
//                     this.toastr.error('Ward Data not saved !, Please check API error..', 'Error !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                       });
//                 }
                
//             },error => {
//                 this.toastr.error('Ward Data not saved !, Please check API error..', 'Error !', {
//                  toastClass: 'tostr-tost custom-toast-error',
//                });
//              });
//         } else {
//             var m_dataUpdate = {
//                 wardMasterUpdate: {
//                     roomId_1: this._wardService.myform.get("RoomId").value,
//                     roomName_2: this._wardService.myform
//                         .get("RoomName")
//                         .value.trim(),
//                     roomType_3: "1",
//                     locationId_4:
//                         this._wardService.myform.get("LocationId").value
//                             .LocationId,
//                     //    isAvailable: 1,
//                     isActive_5: 0,
//                     //  updatedBy: 1,
//                     classID:
//                         this._wardService.myform.get("ClassId").value
//                             .ClassId,
//                 },
//             };
//             this._wardService
//                 .wardMasterUpdate(m_dataUpdate)
//                 .subscribe((data) => {
                  
//                     if (data) {
//                         this.toastr.success('Record updated Successfully.', 'updated !', {
//                             toastClass: 'tostr-tost custom-toast-success',
//                           });
                       
//                     } else {
//                         this.toastr.error('Ward Master Data not Updated !, Please check API error..', 'Updated !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                           });
//                     }
                    
//                 },error => {
//                     this.toastr.error('Ward Data not Updated !, Please check API error..', 'Error !', {
//                      toastClass: 'tostr-tost custom-toast-error',
//                    });
//                  });
//         }
//        // this.onClear();
//     }
// }
}
