import {Component} from '@angular/core';

import {Service1} from './services/service1';

@Component({
  selector: 'app-di-tree',
  providers: [Service1],
  template: `
    <div class="outer">
      <h4>DI App</h4>
      <p class="service">{{ service1Value }}</p>
      <app-child-one></app-child-one>
      <hr />
      <app-child-four></app-child-four>
    </div>
  `
})
export class DITreeComponent {
  service1Value: string;

  constructor(private s1: Service1) {
    this.service1Value = s1.value;
  }
}
