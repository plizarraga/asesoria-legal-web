import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { HomeService } from '../home.service';
import { ICita } from '../../_shared/models/cita.model';

@Component({
  selector: 'app-citas-details',
  templateUrl: './citas-details.component.html',
  styleUrls: ['./citas-details.component.scss']
})
export class CitasDetailsComponent implements OnInit {

  public id: string;
  public cita: ICita;

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.homeService.getById(this.id)
      .pipe(first())
      .subscribe((cita) => {
        this.cita = cita;
        console.log(cita);
      });
  }
}
