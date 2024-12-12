import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatList, MatListItem, MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Params, Router, RouterModule, RouterOutlet } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  theme = signal<string>('');
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
    // It ensure no merge of query params among requests to table component
    TableComponent.params['fecha'] = undefined;
    TableComponent.params['placa'] = undefined;
    TableComponent.params['tipo'] = undefined;

    const dateNow = TableComponent
      .getDateNow()
      .toLocaleString('es-CO')
      .substring(0, 10);
    let split = dateNow.split(",");
    split.length>=2 ? split = split[0].split("/") : split = dateNow.split("/");
    for (let i=0; i<split.length; i++) {
      if (split.at(i)!==undefined && split.at(i)!.length===1)
        split.splice(i, 1, "0".concat(split.at(i) as string));
    }

    const dateNowStr = split.join("/");
    const queryParams : Params = {    // through query params get information at a specific date
      "fecha": encodeURI(dateNowStr)
    }

    this.router.navigate(['dashboard', 'tabla'], {
      queryParams,
      queryParamsHandling: 'replace'
    });
  }
  
}