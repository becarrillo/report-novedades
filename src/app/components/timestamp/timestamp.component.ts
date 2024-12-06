import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Current date-time component with company name */
@Component({
  selector: 'app-timestamp',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './timestamp.component.html',
  styleUrl: './timestamp.component.css'
})
export class TimestampComponent implements OnInit {
  readonly dateTime = signal<string>('');

  ngOnInit(): void {
    setInterval(() => {   // For each second the datetime updates it
      this.dateTime.set(new Date().toLocaleString('es-CO'));
    }, 1000);
  }
}
