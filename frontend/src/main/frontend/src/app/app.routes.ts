import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './alert/alert.component';

import { GraphComponent } from './main/graph/graph.component';
import { WorkspaceComponent } from './main/workspace/workspace.component';
import { AdminComponent } from './main/admin/admin.component';
import { HelpComponent } from './main/help/help.component';

import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: MainComponent, canActivate: [AuthGuardService], children: [
    {
      path: '', component: DashboardComponent   //, data: { shouldDetach: true }
    },{ 
      path: 'graph', component: GraphComponent, data: { shouldDetach: true }
    },{ 
      path: 'graph/:id', component: GraphComponent
    },{ 
      path: 'workspace', component: WorkspaceComponent, data: { shouldDetach: true }
    },{ 
      path: 'admin', component: AdminComponent
    },{ 
      path: 'help', component: HelpComponent
    },
  ]},
  // all other routes
  { path: '**', redirectTo: '' }  
];

export const appRoutingProviders: any[] = [

];

export const appRoutes: any = RouterModule.forRoot(routes, { useHash: true });
