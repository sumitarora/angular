/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {DialogComponent} from './dialog.component';

@Injectable()
export class Target {
}
(window as any).Target = Target;
@Injectable()
export class Target2 {
}
(window as any).Target2 = Target2;

@Component({
  selector: 'app-todo-demo',
  templateUrl: './app-todo.component.html',
  styleUrls: ['./app-todo.component.scss'],
})
export class AppTodoComponent {
  name: string;
  animal: string;

  constructor(public dialog: MatDialog, private _target: Target, private _target2: Target2) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe((result) => {
      // tslint:disable-next-line:no-console
      console.log('The dialog was closed');

      this.animal = result;
    });
  }
}
