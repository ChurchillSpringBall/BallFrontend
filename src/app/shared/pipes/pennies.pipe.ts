import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'pennies'})
export class PenniesPipe implements PipeTransform {
  transform(value: number, args: string[]): string {
    console.log(value);
    const decimals = ((value % 1) * 100).toFixed(0);
    return decimals.length < 2 ? '0' + decimals : decimals;
  }
}
