import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'historial'},
  {path: 'tabla', loadComponent: () => import('../../components/table/table.component').then(m => m.TableComponent)},
  {path: 'historial', loadComponent: () => import('../../components/history-folders/history-folders.component').then(m => m.HistoryFoldersComponent)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
