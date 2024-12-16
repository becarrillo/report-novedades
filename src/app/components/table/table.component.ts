import { CommonModule } from '@angular/common';
import { Component, ViewChild, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SheetData } from '../../interfaces/sheet-data';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SectionNode } from '../../interfaces/section-node';
import { MatDialog } from '@angular/material/dialog';
import { SheetRowDialogComponent } from '../sheet-row-dialog/sheet-row-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { TimestampComponent } from '../timestamp/timestamp.component';

/** Table for Reportec vehicles news filter results */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    TimestampComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  activatedRoute = inject(ActivatedRoute);
  displayedColumns: string[] = [
    'posicion',
    'placa',
    'cedulaTec1',
    'nombreTec1',
    'cedulaTec2',
    'nombreTec2',
    'tipo',
    'fecha',
    'horaFinDesplazamiento',
    'infoButton'
  ];
  protected dialog = inject(MatDialog);
  protected static readonly data = signal<SheetData[]>([]);
  pageSizeOptions: number[] = [8, 15, 20, 40, 60];
  static params: Params = {};
  protected router = inject(Router);
  protected sectionNodeData = signal<SectionNode[]>([]);
  protected tableDataSourceSignal = signal(
    new MatTableDataSource<SheetData, MatPaginator>(TableComponent.data())
  );
  title = signal<string>('');

  constructor() {
    let data = window.localStorage.getItem("data");
    if (data !== null && data.length > 0) {
      let paramsHaveKeyValue: boolean;
      paramsHaveKeyValue = false;
      let parsedSheetData = (parseData(data) as SheetData[]);
      TableComponent.setData(parsedSheetData);

      /** Converts stringified data into JSON object (It is made for receive data from sheet) */
      function parseData(data : string | null) {
        if (data !== null)
          return JSON.parse(data);
      }

      let dataResult! : SheetData[];
      /** Drive to data to be filtered, then it gets processed data to be shown into table */
      let setDataResult = (sheetData : SheetData[]) => {
        dataResult = sheetData;
        if (paramsHaveKeyValue) 
          dataResult = this.filterData(sheetData, TableComponent.params);
      }
      setDataResult(parsedSheetData);

      let allResultsAreToday! : boolean;
      const setTitleWithData = (dataResult : SheetData[]) => {
        let split = TableComponent.getDateNow().toLocaleString('es-CO').substring(0, 10).split("/");
        for (let i = 0; i < split.length; i++) {
          if (split.at(i) !== undefined && split.at(i)!.length === 1)
            split.splice(i, 1, "0".concat(split.at(i) as string));
        }

        const todayData : SheetData[] = [];
        if (dataResult.length >= 1 && TableComponent.params['placa'] === undefined && TableComponent.params['tipo'] === undefined) {
          var join = split.join("/");
          if (join.length>10) join = join.substring(0, 10);
          for (var r of dataResult) {
            if (r.fecha !== join) {
              allResultsAreToday = false;
              break;
            } else {
              todayData.push(r);
              allResultsAreToday = true;
            }
          }
        } else {
          TableComponent.params['fecha']===split.join("/") ? 
            allResultsAreToday = true 
          : allResultsAreToday = false;
        }

        allResultsAreToday ? (
          TableComponent.data.set(todayData),
          this.title.set("Novedades Reportec del día") 
        ) : (
          TableComponent.data.set(dataResult),
          this.title.set("Resultados búsqueda de novedades Reportec")
        );
      }
      
      // To get params values coming from filter dialog form
      this.activatedRoute.queryParams.subscribe(query => {
        const assignParamIfExists = (name: string) => {
          if (query[name] !== undefined) {
            TableComponent.params[name] = query[name];
            paramsHaveKeyValue = true;
          }
        }
        assignParamIfExists('fecha');
        assignParamIfExists('placa');
        assignParamIfExists('tipo');
        
        data = window.localStorage.getItem("data");
        parsedSheetData = (parseData(data) as SheetData[]);
        setDataResult(parsedSheetData);
        
        
        setTitleWithData(dataResult);
        if (this.getData().length>=1) this.paginator.firstPage();
      });

      setInterval(() => {    // Each 5 secs send a request to get the current data
        if (
          window.location.pathname!=='/login' && 
          window.location.pathname!=='/dashboard/historial'
        ) {
          data = window.localStorage.getItem("data");
          parsedSheetData = (parseData(data) as SheetData[]);
          setDataResult(parsedSheetData);
          setTitleWithData(dataResult);
        }
      }, 5000);
    }

    effect(() => {  // To look and to manage data signal changes updating the view data into table
      this.tableDataSourceSignal.set(
        new MatTableDataSource<SheetData, MatPaginator>(TableComponent.data())
      );
      this.tableDataSourceSignal().paginator = this.paginator;
    }, {
      allowSignalWrites: true
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Máx. filas por página';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._changePageSize(8);
    this.paginator._intl.getRangeLabel = (pageIndex: number, pageSize: number, length: number) => {
      if (length === 0) {
        return '0';
      }
      return (
        length % pageSize !== 0 && length < pageSize * (pageIndex + 1) ?
          `${pageSize * pageIndex + 1} a ${length} de ${length}`
          : `${pageSize * pageIndex + 1} a ${pageSize * (pageIndex + 1)} de ${length}`
      );
    }
  }

  /** Manage sheet data filter with params from filter dialog inputs data */
  filterData(
    sheetData: SheetData[],
    params: Params
  ): SheetData[] {
    let results = sheetData;
    if (sheetData.length > 0) {
      if (params['fecha'] !== undefined) {
        results = results.filter(data => {
          return data.fecha === decodeURI(params['fecha'])
        });
      }
      if (params['placa'] !== undefined) {
        results = results.filter(data => {

          return (
            data.placa === decodeURI(params['placa'])
          )
        });
      }
      if (params['tipo'] !== undefined) {
        results = results.filter(data => {

          return (
            data.tipo === decodeURI(params['tipo'])
          )
        })
      };
    } else {
      window.alert("Ningún dato coincide con su búsqueda");
      this.router.navigateByUrl("/dashboard/historial");
    }

    let position = 1;
    results.forEach(element => {
      element['posicion'] = position;
      position++;
    });

    TableComponent.data.set(results);
    return results;
  }

  getData() {
    const sheetData = TableComponent.data();
    return sheetData;
  }

  openDialog(fecha: string, placa: string, tipo: string): void {
    const row = this.getData().find(row => {
      return row.fecha === fecha && row.placa === placa && row.tipo === tipo
    });

    if (row !== undefined) {
      this.dialog.open(SheetRowDialogComponent, {
        data: {
          cedulaTec1: row.cedulaTec1,
          cedulaTec2: row.cedulaTec2,
          direccionFinal: row.direccionFinal,
          direccionInicial: row.direccionInicial,
          direccionReportec: row.direccionReportec,
          fecha: row.fecha,
          horaFinDesplazamiento: row.horaFinDesplazamiento,
          horaInicioDesplazamiento: row.horaInicioDesplazamiento,
          nombreTec1: row.nombreTec1,
          nombreTec2: row.nombreTec2,
          observaciones: row.observaciones,
          placa: row.placa,
          tiempoEstacionamiento: row.tiempoEstacionamiento,
          tipo: row.tipo
        }
      });
    }
  }

  /** It hands the date option to set param buttons getting its Date object
   * processing to a formatted string it and navigating into table to the 
   * selected date by click event
   */
  handDateOptionClick(ev : Event) {
    let date : Date = new Date();
    
    const option = (ev.currentTarget as HTMLButtonElement).textContent;
    switch (option) {
      case "Ayer":
        date.setDate(date.getDate() - 1);
        break;
        case "Hace dos días":
          date.setDate(new Date().getDate() - 2);
          break;
      case "Hace una semana":
        date.setDate(new Date().getDate() - 7);
        break;
      case "Hace un mes":
        date.setDate(new Date().getDate() - 30);
    }
    
    const dateArr = [
      date.getDate().toString(),
      (date.getMonth()+1).toString(),
      date.getFullYear().toString()
    ];
    for (let i = 0; i < dateArr.length; i++) {
      if (dateArr.at(i) !== undefined && dateArr.at(i)!.length === 1)
        dateArr.splice(i, 1, "0".concat(dateArr.at(i) as string));
    }

    TableComponent.params['fecha'] = dateArr.join("/");
    this.router.navigate(['dashboard', 'tabla'], {
      queryParams: TableComponent.params,
      queryParamsHandling: 'merge'
    });
  }

  setData(data: SheetData[]) {
    TableComponent.setData(data);
  }

  static getData(): SheetData[] {
    return this.data();
  }

  static setData(data: SheetData[]) {
    this.data.set(data);
  }

  static getDateNow(): Date {
    const today = new Date();
    return today;
  }
}