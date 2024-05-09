import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-bed-occupancy',
    templateUrl: './bed-occupancy.component.html',
    styleUrls: ['./bed-occupancy.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BedOccupancyComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;

    public displayedColumns = ['RegNo', 'PatientName', 'DoctorName', 'IsAvailible', 'BedName'];
    warDataArr: WardDetails[] = [];
    warItemArr: WardItemDetails[] = [];
    prevSelectedWard: WardDetails;
    public isTableLoading = false;
    public selectedRoom!: string;
    public dataSource = new MatTableDataSource<WardItemDetails>();
    constructor(
        public _dashboardServices: DashboardService
    ) { }

    ngOnInit(): void {
        this.getWard();
    }

    getWard() {
        this._dashboardServices.getWard({}).subscribe(data => {
            this.warDataArr = data as WardDetails[];
            this.warDataArr.forEach(element => {
                element['isSelected'] = false;
            });
            this.warDataArr[0].isSelected = true;
            this.prevSelectedWard = this.warDataArr[0];
            this.selectedRoom = this.prevSelectedWard.RoomName;
            console.log(this.warDataArr);
            this.getWardDetails(this.prevSelectedWard.RoomId);
        });
    }

    onSelectWard(element: WardDetails) {
        this.prevSelectedWard.isSelected = false;
        this.prevSelectedWard = element;
        element.isSelected = true;
        this.getWardDetails(element.RoomId);
        console.log(element)
        this.selectedRoom = element.RoomName;
    }

    getWardDetails(item: any) {
        this.isTableLoading = true;
        let reqParam = {
            WardId: item
        }
        this._dashboardServices.getWardDetails(reqParam).subscribe(data => {
            console.log(data);
            this.warItemArr = data as WardItemDetails[];
            this.isTableLoading = false;
            this.dataSource.data = data as WardItemDetails[];
            this.dataSource.sort = this.sort;
        });
    }

}
export class WardDetails {
    AvailableCount: number;
    LocationName: string;
    OccuipedCount: number;
    RoomId: number;
    RoomName: string;
    isSelected: boolean = false;

    constructor(wardData) {
        this.AvailableCount = wardData.AvailableCount || 0;
        this.LocationName = wardData.LocationName || '';
        this.OccuipedCount = wardData.OccuipedCount || 0;
        this.RoomId = wardData.RoomId || 0;
        this.RoomName = wardData.RoomName || '';
        this.isSelected = wardData.isSelected || false;
    }
}

export class WardItemDetails {
    AvailableCnt: number;
    BedName: string;
    DocNameID: number;
    DoctorName: string;
    FirstName: string;
    IsAvailible: boolean;
    OccuipiedCnt: number;
    PatientName: string;
    RegNo: string;
    RoomId: number;
    RoomName: string;
    WardId: number;

    constructor(wardData) {
        this.AvailableCnt = wardData.AvailableCnt || 0;
        this.BedName = wardData.BedName || '';
        this.DocNameID = wardData.DocNameID || 0;
        this.DoctorName = wardData.DoctorName || '';
        this.FirstName = wardData.FirstName || '';
        this.IsAvailible = wardData.IsAvailible || false;
        this.OccuipiedCnt = wardData.OccuipiedCnt || 0;
        this.PatientName = wardData.PatientName || '';
        this.RegNo = wardData.RegNo || '';
        this.RoomId = wardData.RoomId || 0;
        this.RoomName = wardData.RoomName || '';
        this.WardId = wardData.WardId || 0;
    }
}