import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: "filtroDia"
})
export class HoyPipe  implements PipeTransform {
  transform(value, args:string){
    if (args.toLowerCase() != '') {
        if(value != undefined){
            return value.filter((item)=>
            item.DiaSemana.toLowerCase().indexOf(args.toLowerCase()) != -1
      );
        }
    }
    return value;
  }
}