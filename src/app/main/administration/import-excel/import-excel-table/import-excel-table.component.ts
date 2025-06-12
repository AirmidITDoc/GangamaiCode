import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-import-excel-table',
  templateUrl: './import-excel-table.component.html',
  styleUrls: ['./import-excel-table.component.scss'],
  animations:fuseAnimations
})
export class ImportExcelTableComponent implements OnInit, OnDestroy {
  @Input() data: any[] = [];
  constructor() { }

  ngOnInit(): void {

  }

  displayedColumns(): string[] {
    return this.data.length > 0 ? Object.keys(this.data[0]) : [];
  }
  ngOnDestroy(): void { }


}
