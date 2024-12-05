import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
  readonly timestamp = signal<string>('');

  ngOnInit(): void {
    setInterval(() => {
      this.timestamp.set(new Date().toLocaleString('es-CO'));
    }, 1000);
  }
}
