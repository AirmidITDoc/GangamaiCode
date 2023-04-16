import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value ? value.toString().trim() : value;
  }

}
