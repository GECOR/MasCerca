import {Component, Input, OnInit} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'mis-notas',
  templateUrl: 'notas.html'
})

export class NotasComponent implements OnInit {
  
  @Input() nota;

  constructor(public platform: Platform
    , public params: NavParams
    , public viewCtrl: ViewController) {}

  
  ngOnInit(){
     if(!this.nota)
        this.nota = 'No hay notas para mostrar';  
  }

}