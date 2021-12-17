import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'bank-control-panel';
  menuItems: any[] = [
    { text: 'Users', icon: '/assets/images/users.svg', route: '/users' }
  ];
}
