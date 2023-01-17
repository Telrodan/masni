import { Component } from '@angular/core';

@Component({
  selector: 'masni-handmade-dolls-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  public carouselImages: string[];

  constructor() {
    this.carouselImages = [
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB',
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB',
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB',
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB',
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB',
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB',
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB',
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB',
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB',
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB',
      'https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/322190564_908170907024597_2142960507884425859_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=8H-Z1robUDAAX8xBlod&_nc_ht=scontent-vie1-1.xx&oh=00_AfCRd_UN4CPTFfeciHt4u95M4IdjzwH595bPlHHQPZXDBw&oe=63C91CCB'
    ];
  }
}
