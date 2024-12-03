import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'novedades'},
  {path: 'novedades/hoy', loadComponent: () => import('../../components/table/table.component').then(m => m.TableComponent)},
  {path: 'novedades', loadComponent: () => import('../../components/record-folders/record-folders.component').then(m => m.RecordFoldersComponent)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
