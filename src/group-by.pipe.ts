import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const groups = {};
    value.forEach((o: any) => {
      const group = JSON.stringify(args(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map((group: any) => {
      return groups[group];
    });
  }

}
