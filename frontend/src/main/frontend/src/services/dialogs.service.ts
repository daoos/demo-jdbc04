import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

import { FullScreenGraphComponent } from '../app/dialogs/full-screen-graph/full-screen-graph.component';

@Injectable()
export class DialogsService {

  constructor(private dialog: MdDialog){     
  }

  public dlgFullScreenGraph(graphJson: any): Observable<any> {
    let dialogRef: MdDialogRef<FullScreenGraphComponent>;
    dialogRef = this.dialog.open(FullScreenGraphComponent, {
        width: '100vw', height: '100vh',
        position: {
          top: '0px', right: '0px'
        }
    });

    dialogRef.componentInstance.graphJson = graphJson;

    return dialogRef.afterClosed();
  }

}
