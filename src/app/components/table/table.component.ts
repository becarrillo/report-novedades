import { CommonModule } from '@angular/common';
import { Component, ViewChild, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {  RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SheetData } from '../../interfaces/sheet-data';
import { AppComponent } from '../../app.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SectionNode } from '../../interfaces/section-node';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  displayedColumns: string[] = ['posicion', 'placa', 'cedulaTec1', 'nombreTec1', 'cedulaTec2', 'nombreTec2', 'tipo', 'fecha', 'horaFinDesplazamiento'];
  private static readonly data = signal<SheetData[]>([]);
  protected sectionNodeData = signal<SectionNode[]>([]);
  protected tableDataSource! : MatTableDataSource<SheetData, MatPaginator>;

  constructor() {
    const object = window.localStorage.getItem("data");
    if (object!==null && object.length>0) {
      TableComponent.data.set(JSON.parse(object));
    }
    TableComponent.updateDataToToday();
    this.tableDataSource = new MatTableDataSource<SheetData, MatPaginator>(TableComponent.data());
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Filas por página';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._changePageSize(8);
    this.paginator._intl.getRangeLabel = (pageIndex: number, pageSize: number, length: number) => {
      if (length===0) return '0';
      return length % pageSize !== 0 && length < pageSize*(pageIndex+1) ? `${pageSize*pageIndex+1} a ${length} de ${length}` : `${pageSize*pageIndex+1} a ${pageSize*(pageIndex+1)} de ${length}`;
    }
  }

  static updateDataToToday() : void {
    let posicion = 1;

    const today = new Date();
    const filter = (d : SheetData) => {
      return today.getDate()
        .toLocaleString('es-CO')
        .concat("/"+(parseInt(today.getMonth().toLocaleString('es-CO'))+1).toLocaleString('es-CO'))
        .concat("/"+today.getFullYear().toString())
        .includes(d['fecha']);
    }

    this.data.update(val => {
      var result = val.filter(d => {
        return filter(d);
      });
      result.forEach(d => {
        d['posicion'] = posicion;
        posicion++;
      });

      return result;
    });
  }
}