import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { HomeCollectionService } from '../../home-collection/home-collection.service';


@Component({
  selector: 'app-update-phlebotomist',
  templateUrl: './update-phlebotomist.component.html',
  styleUrls: ['./update-phlebotomist.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdatePhlebotomistComponent {
  phlebotomists: Phlebotomist[] = [];
  selectedPhlebotomist: Phlebotomist | null = null;

  displayedColumns: string[] = [
    'srNo',
    'dateTime',
    'patientName',
    'mobileNo',
    'unit',
    'phlebotomist',
    'status'
  ];

  dataSource = new MatTableDataSource<any>([]);

  constructor(public _homeCollectionService: HomeCollectionService,) { }

  ngOnInit(): void {
    this.loadPhlebotomists();
  }

  // 1. Load all phlebotomists with their total assigned patient count
  loadPhlebotomists(): void {
    this._homeCollectionService.getPhlebotomistList().subscribe((res: any[]) => {
      debugger
      this.phlebotomists = (res || []).map(x => ({
        id: x.phlebotomistId,
        name: x.phlebotomistName,
        initials: this.getInitials(x.phlebotomistName),
        totalPatients: x.totalPatients
      }));

      // select the first card by default
      if (this.phlebotomists.length) {
        this.selectPhlebotomist(this.phlebotomists[0]);
      }
    });
  }

  // 2. Card click: mark selected and load that phlebotomist's patients into the table
  selectPhlebotomist(p: Phlebotomist): void {
    this.selectedPhlebotomist = p;
    this.loadPatients(p);
  }

  loadPatients(p: Phlebotomist): void {
    // this._homeCollectionService.getPatientsByPhlebotomist(p.id).subscribe((res: any[]) => {
    //   this.dataSource.data = (res || []).map(r => ({
    //     dateTime: r.collectionDateTime,
    //     patientName: r.patientName,
    //     mobileNo: r.mobileNo,
    //     unitName: r.unitName,
    //     phlebotomistName: p.name,
    //     status: r.status
    //   }));
    // });
  }

  private getInitials(name: string): string {
    return (name || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w.charAt(0).toUpperCase())
      .join('');
  }

}
export interface Phlebotomist {
  id: number;
  name: string;
  initials: string;
  totalPatients: number;
}