import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatList, MatListItem, MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatList,
    MatListItem,
    MatListModule,
    MatMenuModule,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';
  theme = signal<string>('');
  isNavigatedToday = signal<boolean>(false);
  protected router = inject(Router);
  changeDetection!: ChangeDetectionStrategy.OnPush;
  readonly dialog = inject(MatDialog);
  readonly fecha = signal<string>('');
  readonly tipo = signal<string>('');
  readonly placa = signal<string>('');

  constructor() {
    this.theme.set(window.localStorage.getItem('theme')!==null ? 
      window.localStorage.getItem('theme')! : 'light');
  }

  currentNavigationIsNotLogin() {
    return this.router.url !== '/login';
  }

  getCurrentNavigation() {
    return this.router.url;
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: {fecha: this.fecha(), tipo: this.tipo(), placa: this.placa()}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.fecha.set(result);
      }
    });
  }

  setTheme() {
    this.theme()==='light' ? (
      window.localStorage.setItem('theme', 'dark'),
      this.theme.set('dark')
    ) : (
      window.localStorage.setItem('theme', 'light'),
      this.theme.set('light')
    );
  }

  updateDataToToday(): void {
    TableComponent.updateDataToToday();

    this.isNavigatedToday.set(true);
    this.router.navigateByUrl("/dashboard/novedades/hoy");
  }
  
}