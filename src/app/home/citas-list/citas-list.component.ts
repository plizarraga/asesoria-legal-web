import { Component, Input, OnInit } from '@angular/core';
import { ICita } from '../../_shared/models/cita.model';

@Component({
  selector: 'app-citas-list',
  templateUrl: './citas-list.component.html',
  styleUrls: ['./citas-list.component.scss']
})
export class CitasListComponent implements OnInit {
  @Input() citas: ICita[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
