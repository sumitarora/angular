/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {HttpClient} from '@angular/common/http';
import {Attribute, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Host, Inject, Injectable, InjectionToken, Injector, Input, Optional, Output, Self, SkipSelf} from '@angular/core';

import {Todo} from './todo';
import {TodosComponent} from './todos.component';

class Test {
  constructor() {}

  log() {}
}

@Injectable()
class Test2 {
  constructor(private _test: Test) {}

  log() {}
}

export class BaseTodo {
  constructor(private someArg: string) {}
}

export const MY_TOKEN = new InjectionToken('my token');

export class MyClass {}

@Component({
  templateUrl: 'todo.component.html',
  selector: 'app-todo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./todo.component.scss'],
  providers: [
    {provide: Test, useClass: Test}, {provide: Test2, useClass: Test2, deps: [Test]},
    {provide: MY_TOKEN, useClass: MyClass}
  ],
  viewProviders: [Test2]
})
export class TodoComponent extends BaseTodo {
  @Input() todo: Todo;
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor(
      @Attribute('some-attribute') private someAttribute: string, private _test: Test,
      private _test2: Test2, private injector: Injector, private _todos: TodosComponent,
      @Optional() @Self() @Host() @Inject(MY_TOKEN) private _test3: string,
      @SkipSelf() @Optional() private _elementRef: ElementRef) {
    super('test');
  }

  editMode = false;

  toggle(): void {
    this.todo.completed = !this.todo.completed;
    this.update.emit(this.todo);
  }

  completeEdit(label: string): void {
    this.todo.label = label;
    this.editMode = false;
    this.update.emit(this.todo);
  }

  enableEditMode(): void {
    this.editMode = true;
  }
}
