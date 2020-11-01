import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { HomeService } from './home.service';
import { ICita } from '../_shared/models/cita.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public citasProximas: ICita[] = [];
  public citasArchivadas: ICita[] = [];

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getAll()
      .pipe(first())
      .subscribe(citas => {
        this.citasProximas = citas.filter(x => Date.parse(x.fecha) > Date.now());
        this.citasArchivadas = citas.filter(x => Date.parse(x.fecha) < Date.now());
      });
  }
}
