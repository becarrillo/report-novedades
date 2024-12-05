import { Component, effect, inject, model, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterDialogData } from '../../interfaces/filter-dialog-data';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { Params, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { TableComponent } from '../table/table.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SheetData } from '../../interfaces/sheet-data';

/** Component for modal dialog with Reportec vehicles news filter form */
@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule
  ],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-CO'
    }
  ],
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.css'
})
export class FilterDialogComponent {
  router = inject(Router);
  readonly dialogRef = inject(MatDialogRef<FilterDialogComponent>);
  readonly dialogData = inject<FilterDialogData>(MAT_DIALOG_DATA);
  protected fecha = model<string | null>((this.dialogData.fecha!));
  protected placa = model<string | null>(this.dialogData.placa!);
  protected tipo = model<string | null>(this.dialogData.tipo!);
  protected readonly placaOptionsSignal = signal<string[]>([]);
  protected readonly tipoOptionsSignal = signal<string[]>([]);

  constructor() {
    const data = window.localStorage.getItem("data");
    let parseAllSheetData: () => any[];
    if (data!==null && data.length>0)
      parseAllSheetData = () => JSON.parse(data) as SheetData[];
    effect(() => {
      parseAllSheetData().forEach(d => {
        if (!this.placaOptionsSignal().includes(d.placa)) 
          this.placaOptionsSignal.update(p => {p.push(d.placa); return p;});
        if (!this.tipoOptionsSignal().includes(d.tipo)) 
          this.tipoOptionsSignal.update(t => {t.push(d.tipo); return t;});
      });
      if (this.fechaIsNull(this.fecha()))
        this.dialogRef.close();
    }, {
      allowSignalWrites: true
    });
  }

  fechaIsNull(fecha : string | null) : boolean {
    return fecha===null;
  }

  handleFilterBtn() {
    let queryParams : Params = {};
    if (!this.fechaIsNull(this.fecha()) && this.fecha()!==undefined && this.fecha()!.length>0)
      queryParams['fecha'] = encodeURI(this.fecha() as string);
    if (this.placa()!==undefined && this.placa()!==null && this.placa()!.length>0) 
      queryParams['placa'] = encodeURI(this.placa() as string);
    if (this.tipo()!==undefined && this.tipo()!.length>0)
      queryParams['tipo'] = encodeURI(this.tipo() as string);
    this.dialogRef.close();
  
    this.router.navigate(['dashboard', 'tabla'], {
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  setFecha(ev : MatDatepickerInputEvent<string, string | null>) : void  {
    if (ev.target.value!==null) {
      /** Transformed and set 'fecha' model data and with change of date
       * input wich comes from filter dialog. **/
      const dateInputObj = new Date(ev.target.value);
      const localeDateFragments = dateInputObj.toLocaleString('es-CO').split("/");
      localeDateFragments[2] = dateInputObj.toLocaleString('es-CO').split("/")!.at(2)?.slice(0, 4)!
      // to look day of month and month whether have one digit, and set it after a zero string ('0') when true.
      // for months after october do not change the value (when day of month has two digits)
      for (var i=0; i<localeDateFragments.length; i++) {
        if (localeDateFragments.at(i)!==undefined && localeDateFragments.at(i)!.length===1)
          localeDateFragments[i] = "0".concat(localeDateFragments.at(i) as string);
      }
      this.fecha.set(localeDateFragments.join("/"));
    } else this.fecha.set(null);
  }

  setTipo(value : string) : void {
    this.tipo.set(value);
  }
}
