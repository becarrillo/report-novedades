import { Component, inject, model } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterDialogData } from '../../interfaces/filter-dialog-data';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule
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
  readonly dialogRef = inject(MatDialogRef<FilterDialogComponent>);
  readonly dialogData = inject<FilterDialogData>(MAT_DIALOG_DATA);
  readonly fecha = model(this.dialogData.fecha);
  readonly tipo = model(this.dialogData.tipo);
  readonly placa = model(this.dialogData.placa);

  fechaIsNull(fecha : string | null) : boolean {
    return fecha===null;
  }

  handleFilterBtn() {
    window.alert("Fecha: "+this.fecha()?.concat("; Tipo: "+this.tipo().concat("; Placa: "+this.placa())));
  }

  setFechaModel(ev : MatDatepickerInputEvent<string, string | null>) : void  {
    if (ev.target.value!==null) {
      /** Transformed and set 'fecha' model data and with change of date
       * input wich comes from filter dialog. **/
      const date = new Date(ev.target.value);
      // to look day of month if this have one digit, then set it after a zero string ('0') for months
      // before october or otherwise do not change the value (when day of month has two digits)
      const dayNumberAsString = date.getDate().toString().length===1 ? 
        "0".concat(date.getDate().toLocaleString())
      : date.getDate().toLocaleString();
      // to look month if this have one digit, then set it after a zero string ('0') for months before october
      // or otherwise do not change the value (when month has two digits)
      const monthNumberAsString = (date.getMonth()+1).toLocaleString().length===1 ? 
        "0".concat((date.getMonth()+1).toLocaleString())
      : (date.getMonth()+1).toLocaleString();
      const fullYearAsString = date.getFullYear().toLocaleString();
      this.fecha.set(
        dayNumberAsString.toLocaleString().concat("/"+monthNumberAsString.toLocaleString()).concat("/"+fullYearAsString)
      );
      console.log(this.fecha()?.concat(" is ",typeof this.fecha()));
    } else this.fecha.set(null);
  }
}
