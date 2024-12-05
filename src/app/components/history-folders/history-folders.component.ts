import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { SectionNode } from '../../interfaces/section-node';
import { SheetData } from '../../interfaces/sheet-data';
import { SheetRowDialogComponent } from '../sheet-row-dialog/sheet-row-dialog.component';

/** Component for news history of vehicles into Reportec SpreadSheet */
@Component({
  selector: 'app-folders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './history-folders.component.html',
  styleUrl: './history-folders.component.css'
})
export class HistoryFoldersComponent {
  private readonly data = signal<SheetData[]>([]);
  protected treeDataSource = TREE_DATA;
  
  dialog = inject(MatDialog);

  childrenAccessor = (node: SectionNode) => node.children ?? [];
  hasChild = (_: number, node: SectionNode) => !!node.children && node.children.length > 0;

  constructor() {
    let data = window.localStorage.getItem("data");
    if (data!==undefined && data!==null && data.length>0) {
      this.data.set(JSON.parse(data));
    }
    
    let dateStrAsArray : string[] = [];
    // To set the mapped tree data from the data array
    this.data().forEach(sheetData => {
      if (
        (sheetData.fecha!==undefined && sheetData.fecha.length>0) && 
        (sheetData.placa!==undefined && sheetData.fecha.length>0) && 
        (sheetData.tipo!==undefined && sheetData.tipo.length>0)
      ) {
        dateStrAsArray = sheetData['fecha'].split("/");
        if (dateStrAsArray.at(1)!==undefined) {
          switch (dateStrAsArray.at(1)) {
            case '01':
              dateStrAsArray[1] = 'ENE';
              break;
            case '02':
              dateStrAsArray[1] = 'FEB';
              break;
            case '03':
              dateStrAsArray[1] = 'MAR';
              break;
            case '04':
              dateStrAsArray[1] = 'ABR';
              break;
            case '05':
              dateStrAsArray[1] = 'MAY';
              break;
            case '06':
              dateStrAsArray[1] = 'JUN';
              break;
            case '07':
              dateStrAsArray[1] = 'JUL';
              break;
            case '08':
              dateStrAsArray[1] = 'AGO';
              break;
            case '09':
              dateStrAsArray[1] = 'SEP';
              break;
            case '10':
              dateStrAsArray[1] = 'OCT';
              break;
            case '11':
              dateStrAsArray[1] = 'NOV';
              break;
            case '12':
              dateStrAsArray[1] = 'DIC';
          }
        }
        if (sheetData.tipo.includes("FALLA EN GPS") || sheetData.tipo.includes("EN TALLER"))
          sheetData['direccionFinal'] = undefined;
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
              ?.push({name: sheetData.tipo, children: [{name: sheetData.placa}]})
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
                                children: [
                                  {
                                    name: sheetData.direccionFinal
                                  }
                                ]
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
      }
    });
  }

  changeFolderIcon(ev: Event): void {
    const currEventElement = (ev.currentTarget as HTMLElement);
    currEventElement.getAttribute('fontIcon') === 'folder_open' ?
      currEventElement.setAttribute('fontIcon', 'folder')
      : currEventElement.setAttribute('fontIcon', 'folder_open');
  }

  manageTreeChildButton(
    tree: MatTree<SectionNode, SectionNode>,
    node : SectionNode,
    ev : Event
  ) {
    const sectionsBrowsing: (string | null)[] = [];
    const expandedNodes = (ev.target as HTMLButtonElement).parentNode?.parentNode?.querySelectorAll('.node-name');
    if (expandedNodes!==undefined) {
      expandedNodes.forEach(n => {
        sectionsBrowsing.push(n.textContent);
      });

      const lastWithSameLevel = this.treeLevelsArray.find(obj => obj.level===tree._getLevel(node))
      if (lastWithSameLevel===undefined)
        this.treeLevelsArray.push({level: tree._getLevel(node)!, sectionName: node.name});
    }
    this.openDialog();
  }

  treeLevelsArray : {"level": number, "sectionName": string}[] = [];
  /** It will receive the tree object, the current tree node object and
   * boolean value from event whether the current tree node is expanded,
   * after it will process through an objects array that manages the
   * expansion of the tree looking for expanded siblings' node collapse them */
  onExpandedChange(
    tree : MatTree<SectionNode, SectionNode>,
    treeNode : SectionNode,
    treeNodeIsExpanded : boolean
  ) {
    const level = tree._getLevel(treeNode);
    if (treeNodeIsExpanded && level!==undefined ) {
      var foundNodeByLevel = this.treeLevelsArray.find(obj => {
        return obj.level===level;
      });
      const filter = this.treeLevelsArray.filter(obj => {
        return obj.level>=level
      });
      if (filter.length>0) {
        filter.forEach(obj => {
          if (obj.level===level) {
            obj.sectionName!==treeNode.name ?
              this.treeLevelsArray.splice(this.treeLevelsArray.indexOf(obj), 1, {level: obj.level, sectionName: treeNode.name})
            : this.treeLevelsArray.splice(this.treeLevelsArray.findIndex(obj => obj.level===level+1), 1);
          } else this.treeLevelsArray.splice(this.treeLevelsArray.indexOf(obj), 1);
        });
      }
      
      foundNodeByLevel = this.treeLevelsArray.find(obj => {
        return obj.level===level;
      });
      if (foundNodeByLevel===undefined)
        this.treeLevelsArray.push({level: level, sectionName: treeNode.name});

      const activeItem = tree._keyManager.getActiveItem();
      if (activeItem?._elementRef!==undefined) {
        const parentData = activeItem?.getParent()?.data;
        if (parentData!==undefined) {
          parentData.children?.forEach(child => {
            if (tree.isExpanded(child) && child.name!==treeNode.name) {
              tree.collapseDescendants(child);
            }
          })
        }
      }
    } else {
      const activeItem = tree._keyManager.getActiveItem();
      if (level===0 && activeItem?._getSetSize()===1)
        this.treeLevelsArray.splice(0, this.treeLevelsArray.length);
    }
  }

  openDialog() {
    let monthString! : string;
    switch (this.treeLevelsArray.at(1)?.sectionName) {
      case 'ENE':
        monthString = "01";
        break;
      case 'FEB':
        monthString = "02";
        break;
      case 'MAR':
        monthString = "03";
        break;
      case 'ABR':
        monthString = "04";
        break;
      case 'MAY':
        monthString = "05";
        break;
      case 'JUN':
        monthString = "06";
        break;
      case 'JUL':
        monthString = "07";
        break;
      case 'AGO':
        monthString = "08";
        break;
      case 'SEP':
        monthString = "09";
        break;
      case 'OCT':
        monthString = "10";
        break;
      case 'NOV':
        monthString = "11";
        break;
      case 'DIC':
        monthString = "12";
    }
    const row : SheetData = this.data().find(d => {
      let fullYearAsString : string = '';
      let dayOfMonthString : string = '';
      if (this.treeLevelsArray.at(0)!==undefined && this.treeLevelsArray.at(2)!==undefined) {
        dayOfMonthString = this.treeLevelsArray.at(2)!.sectionName;
        fullYearAsString = this.treeLevelsArray.at(0)!.sectionName;
        console.log(dayOfMonthString
          .concat(`/${monthString}/${fullYearAsString}`));
      }
      const isSameDate = d.fecha===dayOfMonthString
        .concat(`/${monthString}/${fullYearAsString}`);
      let isSameTipo : boolean = false;
      if (this.treeLevelsArray.at(3)!==undefined) 
        isSameTipo = d.tipo===this.treeLevelsArray.at(3)?.sectionName;
      let isSamePlaca : boolean = false;
      if (this.treeLevelsArray.at(4)!==undefined)
        isSamePlaca = d.placa===this.treeLevelsArray.at(4)?.sectionName;
      let isSameDireccionFinal : boolean = false;
      if (this.treeLevelsArray.at(5)!==undefined && d.direccionFinal!==undefined) {
        if (this.treeLevelsArray.at(5)?.sectionName.includes(d.direccionFinal)!==undefined)
          isSameDireccionFinal = this.treeLevelsArray.at(5)?.sectionName.includes(d.direccionFinal)!;
        return isSameDate && isSameTipo && isSamePlaca && isSameDireccionFinal;
      }
      return isSameDate && isSameTipo && isSamePlaca;
    }) as SheetData;

    this.dialog.open(SheetRowDialogComponent, {
      data: {
        cedulaTec1: row.cedulaTec1,
        cedulaTec2: row.cedulaTec2,
        direccionFinal: row.direccionFinal,
        direccionInicial: row.direccionInicial,
        direccionReportec: row.direccionReportec,
        fecha: row.fecha,
        horaFinDesplazamiento: row.horaFinDesplazamiento,
        horaInicioDesplazamiento: row.horaInicioDesplazamiento,
        nombreTec1: row.nombreTec1,
        nombreTec2: row.nombreTec2,
        observaciones: row.observaciones,
        placa: row.placa,
        tiempoEstacionamiento: row.tiempoEstacionamiento,
        tipo: row.tipo
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

let TREE_DATA: SectionNode[] = [];