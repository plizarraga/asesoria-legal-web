import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HomeService } from '../home.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-citas-details',
  templateUrl: './citas-details.component.html',
  styleUrls: ['./citas-details.component.scss']
})
export class CitasDetailsComponent implements OnInit {

  public id: string;

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.homeService.getById(this.id)
      .pipe(first())
      .subscribe((cita) => console.log(cita));
  }
}
