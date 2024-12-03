import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { SectionNode } from '../../interfaces/section-node';
import { AppComponent } from '../../app.component';
import { SheetData } from '../../interfaces/sheet-data';

@Component({
  selector: 'app-folders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatTreeModule,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './record-folders.component.html',
  styleUrl: './record-folders.component.css'
})
export class RecordFoldersComponent {
  private readonly data = signal<SheetData[]>([]);
  protected treeDataSource = TREE_DATA;

  childrenAccessor = (node: SectionNode) => node.children ?? [];
  hasChild = (_: number, node: SectionNode) => !!node.children && node.children.length > 0;

  changeFolderIcon(ev: Event): void {
    const currEventElement = (ev.currentTarget as HTMLElement);
    currEventElement.getAttribute('fontIcon') === 'folder_open' ?
      currEventElement.setAttribute('fontIcon', 'folder')
      : currEventElement.setAttribute('fontIcon', 'folder_open');
  }

  constructor() {
    const object = window.localStorage.getItem("data");
    if (object!==null && object.length>0) {
      this.data.set(JSON.parse(object));
    }
    let dateStrAsArray: string[];
    // To set the mapped tree data from the data array
    this.data().forEach(sheetData => {
      dateStrAsArray = sheetData['fecha'].split('/');

      if (dateStrAsArray.at(1)!==undefined) {
        switch (dateStrAsArray.at(1)) {
          case '01':
            dateStrAsArray[1] = 'enero';
            break;
          case '02':
            dateStrAsArray[1] = 'febrero';
            break;
          case '03':
            dateStrAsArray[1] = 'marzo';
            break;
          case '04':
            dateStrAsArray[1] = 'abril';
            break;
          case '05':
            dateStrAsArray[1] = 'mayo';
            break;
          case '06':
            dateStrAsArray[1] = 'junio';
            break;
          case '07':
            dateStrAsArray[1] = 'julio';
            break;
          case '08':
            dateStrAsArray[1] = 'agosto';
            break;
          case '09':
            dateStrAsArray[1] = 'septiembre';
            break;
          case '10':
            dateStrAsArray[1] = 'octubre';
            break;
          case '11':
            dateStrAsArray[1] = 'noviembre';
            break;
          case '12':
            dateStrAsArray[1] = 'diciembre';
        }
      }

      if (sheetData.tipo.includes("FALLA EN GPS")) {sheetData['direccionFinal'] = undefined}

      // it finds section by the name which is year param
      const sectionIndexByYear = TREE_DATA.findIndex(d => d['name'] === dateStrAsArray.at(2));

      if (sectionIndexByYear===-1 || TREE_DATA.length===0) {
        this.pushNewSectionNode(dateStrAsArray, sheetData);
      } else {
        const foundSectionByMonth =  TREE_DATA.at(sectionIndexByYear)?.children?.find(ch => ch.name === dateStrAsArray.at(1));
        const foundSectionByDay = foundSectionByMonth?.children?.find(ch => ch.name===dateStrAsArray.at(0));
        const foundSectionByTipo = foundSectionByDay?.children?.find(ch => ch.name===sheetData.tipo);
        const foundSectionByPlaca = foundSectionByTipo?.children?.find(ch => ch.name===sheetData.placa);
        
        // it push data into found section's children by 'month', 'day', 'tipo' and 'placa'
        foundSectionByMonth!==undefined ?
          foundSectionByDay!==undefined ? 
            foundSectionByTipo!==undefined ?
              foundSectionByPlaca!==undefined ?
                sheetData.direccionFinal!==undefined ? 
                  TREE_DATA.at(sectionIndexByYear)
                    ?.children
                    ?.at(TREE_DATA.at(sectionIndexByYear)
                    ?.children
                    ?.indexOf(foundSectionByMonth) as number)
                    ?.children
                    ?.at(TREE_DATA.at(sectionIndexByYear)
                    ?.children
                    ?.at(TREE_DATA.at(sectionIndexByYear)
                    ?.children
                    ?.indexOf(foundSectionByMonth) as number)
                    ?.children
                    ?.indexOf(foundSectionByDay) as number)
                    ?.children
                    ?.find(ch => ch.name===sheetData.tipo)
                    ?.children
                    ?.find(ch => ch.name===sheetData.placa)
                    ?.children
                    ?.push({name: sheetData.direccionFinal})
                : TREE_DATA.at(sectionIndexByYear)
                    ?.children
                    ?.at(TREE_DATA.at(sectionIndexByYear)
                    ?.children
                    ?.indexOf(foundSectionByMonth) as number)
                    ?.children
                    ?.at(TREE_DATA.at(sectionIndexByYear)
                    ?.children
                    ?.at(TREE_DATA.at(sectionIndexByYear)
                    ?.children
                    ?.indexOf(foundSectionByMonth) as number)
                    ?.children
                    ?.indexOf(foundSectionByDay) as number)
                    ?.children
                    ?.find(ch => ch.name===sheetData.tipo)
                    ?.children
                    ?.push({name: sheetData.placa})
              : sheetData.direccionFinal!==undefined ?
                TREE_DATA.at(sectionIndexByYear)
                  ?.children
                  ?.at(TREE_DATA.at(sectionIndexByYear)
                  ?.children
                  ?.indexOf(foundSectionByMonth) as number)
                  ?.children
                  ?.at(TREE_DATA.at(sectionIndexByYear)
                  ?.children
                  ?.at(TREE_DATA.at(sectionIndexByYear)
                  ?.children
                  ?.indexOf(foundSectionByMonth) as number)
                  ?.children
                  ?.indexOf(foundSectionByDay) as number)
                  ?.children
                  ?.find(ch => ch.name===sheetData.tipo)
                  ?.children
                  ?.push({name: sheetData.placa, children: [{name:  sheetData.direccionFinal}]})
              : TREE_DATA.at(sectionIndexByYear)
                ?.children
                ?.at(TREE_DATA.at(sectionIndexByYear)
                ?.children
                ?.indexOf(foundSectionByMonth) as number)
                ?.children
                ?.at(TREE_DATA.at(sectionIndexByYear)
                ?.children
                ?.at(TREE_DATA.at(sectionIndexByYear)
                ?.children
                ?.indexOf(foundSectionByMonth) as number)
                ?.children
                ?.indexOf(foundSectionByDay) as number)
                ?.children
                ?.find(ch => ch.name===sheetData.tipo)
                ?.children
                ?.push({name: sheetData.placa})
            : sheetData.direccionFinal!==undefined ?
              TREE_DATA.at(sectionIndexByYear)
                ?.children
                ?.at(TREE_DATA.at(sectionIndexByYear)
                ?.children
                ?.indexOf(foundSectionByMonth) as number)
                ?.children
                ?.at(TREE_DATA.at(sectionIndexByYear)
                ?.children
                ?.at(TREE_DATA.at(sectionIndexByYear)
                ?.children
                ?.indexOf(foundSectionByMonth) as number)
                ?.children
                ?.indexOf(foundSectionByDay) as number)
                ?.children
                ?.push({name: sheetData.tipo, children: [{name: sheetData.placa, children: [{name: sheetData.direccionFinal}]}]})
            : TREE_DATA.at(sectionIndexByYear)
              ?.children
              ?.at(TREE_DATA.at(sectionIndexByYear)
              ?.children
              ?.indexOf(foundSectionByMonth) as number)
              ?.children
              ?.at(TREE_DATA.at(sectionIndexByYear)
              ?.children
              ?.at(TREE_DATA.at(sectionIndexByYear)
              ?.children
              ?.indexOf(foundSectionByMonth) as number)
              ?.children
              ?.indexOf(foundSectionByDay) as number)
              ?.children
              ?.push({name: sheetData.tipo})
            : sheetData.direccionFinal!==undefined ?
              TREE_DATA.at(sectionIndexByYear)
                ?.children
                ?.at(TREE_DATA.at(sectionIndexByYear)
                ?.children
                ?.indexOf(foundSectionByMonth) as number)
                ?.children
                ?.push(
                  {
                    name: dateStrAsArray.at(0) as string,
                    children: [
                      {
                        name: sheetData.tipo,
                        children: [
                          {
                            name: sheetData.placa,
                            children: [{name: sheetData.direccionFinal}]
                          }
                        ]
                      }
                    ]
                  }
                )
            : TREE_DATA.at(sectionIndexByYear)
              ?.children
              ?.at(TREE_DATA.at(sectionIndexByYear)
              ?.children
              ?.indexOf(foundSectionByMonth) as number)
              ?.children
              ?.push(
                {
                  name: dateStrAsArray.at(0) as string,
                  children: [
                    {
                      name: sheetData.tipo,
                      children: [
                        {
                          name: sheetData.placa
                        }
                      ]
                    }
                  ]
                }
              )
        : sheetData.direccionFinal!==undefined ?
          TREE_DATA.at(sectionIndexByYear)
            ?.children
            ?.push(
              {
                name: dateStrAsArray.at(1) as string,
                children: [
                  {
                    name: dateStrAsArray.at(0) as string,
                    children: [
                      {
                        name: sheetData.tipo,
                        children: [
                          {
                            name: sheetData.placa,
                            children: [{name: sheetData.direccionFinal}]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            )
          : TREE_DATA.at(sectionIndexByYear)
            ?.children
            ?.push(
              {
                name: dateStrAsArray.at(1) as string,
                children: [
                  {
                    name: dateStrAsArray.at(0) as string,
                    children: [
                      {
                        name: sheetData.tipo,
                        children: [
                          {
                            name: sheetData.placa
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            )
      }
    });
  }

  private pushNewSectionNode(dateStrAsArray: string[], sheetData: SheetData) {

    sheetData.direccionFinal!==undefined ?
      TREE_DATA.push({
        name: dateStrAsArray.at(2) as string,
        children: [
          {
            name: dateStrAsArray.at(1) as string,
            children: [
              {
                name: dateStrAsArray.at(0) as string,
                children: [
                  {
                    name: sheetData.tipo,
                    children: [
                      {
                        name: sheetData.placa,
                        children: [{name: sheetData.direccionFinal}]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
    : TREE_DATA.push({
      name: dateStrAsArray.at(2) as string,
      children: [
        {
          name: dateStrAsArray.at(1) as string,
          children: [
            {
              name: dateStrAsArray.at(0) as string,
              children: [
                {
                  name: sheetData.tipo,
                  children: [
                    {
                      name: sheetData.placa
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    })
  }
}

const TREE_DATA: SectionNode[] = [];