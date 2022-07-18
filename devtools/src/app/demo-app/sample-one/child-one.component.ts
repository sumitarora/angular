import {Component} from '@angular/core';

import {Service1} from './services/service1';
import {Service2} from './services/service2';

@Component({
  selector: 'app-child-one',
  providers: [Service2],
  template: `
    <div class="child">
      <h4>App Child One</h4>
      <p class="service">{{ service1Value }}</p>
      <p class="service">{{ service2Value }}</p>
      <app-child-two></app-child-two>
    </div>
  `
})
export class ChildOneComponent {
  service1Value: string;
  service2Value: string;

  constructor(s1: Service1, s2: Service2) {
    this.service1Value = s1.value;
    this.service2Value = s2.value;
  }
}
