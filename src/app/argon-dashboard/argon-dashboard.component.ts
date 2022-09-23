import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-argon-dashboard',
  templateUrl: './argon-dashboard.component.html',
  styleUrls: ['./argon-dashboard.component.scss']
})
export class ArgonDashboardComponent implements OnInit {
  mainMenus = [
    {
      name: 'Dashboard',
      logo: '<i class="fa-solid fa-house-chimney"></i>',
      isActive: false,
      subMenus: [
        {
          name: 'Dashboard',
          short: 'D',
          link: '#'
        },
        {
          name: 'Alternative',
          short: 'A',
          link: '#'
        }
      ]
    },
    {
      name: 'Examples',
      logo: '<i class="fa-solid fa-file-lines"></i>',
      isActive: false,
      subMenus: [
        {
          name: 'Pricing',
          short: 'P',
          link: '#'
        },
        {
          name: 'Login',
          short: 'L',
          link: '#'
        }
      ]
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onMenuClick(index: number) {
    this.mainMenus.map((x, i)=> {
      return x.isActive = i !== index ? false : x.isActive;
    });
    this.mainMenus[index].isActive = !this.mainMenus[index].isActive;
  }

}
