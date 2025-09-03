import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'airmid-card-view',
  templateUrl: './airmid-card-view.component.html',
  styleUrls: ['./airmid-card-view.component.scss']
})
export class AirmidCardViewComponent {
  @Input() data: any[] = [];
  @Input() config: {
    fields: Array<{ label: string, key: string }>,
    actions?: Array<{ icon: string, tooltip: string, action: string }>
  } = { fields: [] };
  @Input() ShowFilter: boolean = true;
  @Input() ShowButtons: boolean = true;
  @Input() pageSize: number = 25;
  @Input() resultsLength: number = 0;

  @Output() action = new EventEmitter<{ action: string, item: any }>();
  @Output() export = new EventEmitter<string>();
  @Output() page = new EventEmitter<any>();

  onAction(action: string, item: any) {
    this.action.emit({ action, item });
  }
  onExportClick(type: string) {
    this.export.emit(type);
  }
  onPage(event: any) {
    this.page.emit(event);
  }
}
