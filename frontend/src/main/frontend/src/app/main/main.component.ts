import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MdSnackBar } from '@angular/material';
import { TdMediaService } from '@covalent/core';
import { TdLoadingService, LoadingType, LoadingMode } from '@covalent/core';

@Component({
  selector: 'ag-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit {

  title: string;

  routes: Object[] = [{
      title: 'Dashboard',
      route: '/',
      icon: 'dashboard',
    }, {
      title: 'Graph Query',
      route: '/graph',
      icon: 'view_quilt',
    }, {
      title: 'Workspace',
      route: '/workspace',
      icon: 'receipt',
    }, {
      title: 'Administration',
      route: '/admin',
      icon: 'people',
    }, {
      title: 'Help',
      route: '/help',
      icon: 'view_module',
    }
  ];

  constructor(
    private _router: Router,
    private _titleService: Title,
    public media: TdMediaService,
    private _loadingService: TdLoadingService,
    private _snackBarService: MdSnackBar    
    ) {}


  ngOnInit() {
    // console.log("MainComponent.ngOnInit():");
    this.media.broadcast();

    this._titleService.setTitle( this.routes[0]['title'] );
    this.title = this._titleService.getTitle();
  }

  ngAfterViewInit(){
    // console.log("MainComponent.ngAfterViewInit():");
  }

  logout(): void {
    this._router.navigate(['/login']);
  }

  routeSub( link: string, title: string ): void {
    this._titleService.setTitle( title );
    this.title = this._titleService.getTitle();
    // change sub-page
    this._router.navigate([link]);
    this.showSnackBar('routeSub: link='+link);
  }

  showSnackBar(msg: string): void {
    this._snackBarService.open(msg, 'X', { duration: 1000 });
  } 
    
}
