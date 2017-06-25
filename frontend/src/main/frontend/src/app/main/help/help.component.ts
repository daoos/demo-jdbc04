import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { TdMediaService } from '@covalent/core';

@Component({
  selector: 'ag-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(
    public media: TdMediaService,
  ) {
  }

  ngOnInit(): void {
    this.media.broadcast();
  }

}
