import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRouterLink,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { people, person, school } from 'ionicons/icons';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    RouterLink,
  ],
})
export class InicioPage {
  constructor() {
    addIcons({ people, person, school });
  }
}
