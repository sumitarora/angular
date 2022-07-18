import {Component} from '@angular/core';

import {Service1} from './services/service1';

@Component({
  selector: 'app-sample-one',
  styleUrls: ['./sample-one.component.scss'],
  templateUrl: './sample-one.component.html'
})
export class SampleOneComponent {
  service1Value = '';
  constructor(s1: Service1) {
    this.service1Value = s1.value;
  }
}
