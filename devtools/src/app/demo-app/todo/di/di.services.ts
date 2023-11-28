import {Injectable} from '@angular/core';

@Injectable()
export class Service1 {
  value = 'Service One';
  constructor() {
    this.value = this.value + ' Id: ' + Math.floor(Math.random() * 500);
  }
}

@Injectable()
export class Service2 {
  value = 'Service Two';
  constructor() {
    this.value = this.value + ' Id: ' + Math.floor(Math.random() * 500);
  }
}

@Injectable()
export class Service3 {
  value = 'Service Three';
  constructor() {
    this.value = this.value + ' Id: ' + Math.floor(Math.random() * 500);
  }
}

@Injectable()
export class Service4 {
  value = 'Service Four';
  constructor() {
    this.value = this.value + ' Id: ' + Math.floor(Math.random() * 500);
  }
}

export const DI_TREE_SERVICES = [Service1, Service2, Service3, Service4];
