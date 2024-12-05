import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sheet-row-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogContent,
    MatDialogTitle,
    MatListModule,
    
    MatDividerModule
  ],
  templateUrl: './sheet-row-dialog.component.html',
  styleUrl: './sheet-row-dialog.component.css'
})
export class SheetRowDialogComponent {
  data = inject(MAT_DIALOG_DATA);
}
