import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TableColumn } from '../../models/table.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable<T extends object> {
  @Input({ required: true }) columns: TableColumn<T>[] = [];
  @Input({ required: true }) rows: T[] = [];
  @Input() rowIdKey: keyof T | null = null;
  @Input() emptyMessage = 'No records found';

  @Output() rowSelected = new EventEmitter<T>();

  getCellValue(row: T, column: TableColumn<T>): unknown {
    return row[column.key];
  }

  trackByRow(index: number, row: T): unknown {
    return this.rowIdKey ? row[this.rowIdKey] : index;
  }
}
