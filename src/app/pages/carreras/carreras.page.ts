import { Component, inject } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import {
  AlertController,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';
import { Carrera, CarreraDTO } from '../../models/carrera.model';
import { CarreraService } from '../../services/carrera.service';

@Component({
  selector: 'app-carreras',
  templateUrl: 'carreras.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonNote,
    IonSpinner,
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class CarrerasPage implements ViewWillEnter {
  private readonly carreraService = inject(CarreraService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  carreras: Carrera[] = [];
  cargando = false;
  error = '';

  constructor() {
    addIcons({ add, create, trash });
  }

  ionViewWillEnter(): void {
    this.cargar();
  }

  recargar(event: RefresherCustomEvent): void {
    this.cargar(() => event.target.complete());
  }

  // Carrera solo tiene un campo, asi que basta con un Alert en lugar de un modal
  async abrirCrear(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nueva carrera',
      inputs: [{ name: 'descripcion', type: 'text', placeholder: 'Siglas (ej. LTI)' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const dto: CarreraDTO = { descripcion: (data?.descripcion ?? '').trim() };
            this.crear(dto);
          },
        },
      ],
    });
    await alert.present();
  }

  async abrirEditar(carrera: Carrera, sliding: IonItemSliding): Promise<void> {
    await sliding.close();
    const alert = await this.alertCtrl.create({
      header: 'Editar carrera',
      inputs: [
        { name: 'descripcion', type: 'text', value: carrera.descripcion, placeholder: 'Siglas (ej. LTI)' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const dto: CarreraDTO = { descripcion: (data?.descripcion ?? '').trim() };
            this.actualizar(carrera.idCarrera, dto);
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmarEliminar(carrera: Carrera, sliding: IonItemSliding): Promise<void> {
    await sliding.close();
    const alert = await this.alertCtrl.create({
      header: 'Eliminar carrera',
      message: `¿Seguro que quieres eliminar "${carrera.descripcion}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminar(carrera.idCarrera),
        },
      ],
    });
    await alert.present();
  }

  private crear(dto: CarreraDTO): void {
    this.carreraService.crear(dto).subscribe({
      next: (response) => {
        if (response.status) {
          this.mostrarToast(response.msg, 'success');
          this.cargar();
        } else {
          this.mostrarToast(response.msg, 'warning');
        }
      },
      error: () => this.mostrarToast('Error de conexión con el servidor', 'danger'),
    });
  }

  private actualizar(idCarrera: number, dto: CarreraDTO): void {
    this.carreraService.actualizar(idCarrera, dto).subscribe({
      next: (response) => {
        if (response.status) {
          // Actualizar y Eliminar regresan el mensaje en value, no en msg
          this.mostrarToast(response.value ?? '', 'success');
          this.cargar();
        } else {
          this.mostrarToast(response.msg, 'warning');
        }
      },
      error: () => this.mostrarToast('Error de conexión con el servidor', 'danger'),
    });
  }

  private eliminar(idCarrera: number): void {
    this.carreraService.eliminar(idCarrera).subscribe({
      next: (response) => {
        if (response.status) {
          this.mostrarToast(response.value ?? '', 'success');
          this.cargar();
        } else {
          // Ej. la carrera tiene alumnos registrados
          this.mostrarToast(response.msg, 'warning');
        }
      },
      error: () => this.mostrarToast('Error de conexión con el servidor', 'danger'),
    });
  }

  private async mostrarToast(
    msg: string,
    color: 'success' | 'warning' | 'danger' = 'success',
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2500,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

  private cargar(onDone?: () => void): void {
    this.cargando = true;
    this.error = '';

    this.carreraService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.status && response.value) {
          this.carreras = response.value;
        } else {
          this.error = response.msg || 'No se pudieron cargar las carreras';
          this.carreras = [];
        }
        this.cargando = false;
        onDone?.();
      },
      error: () => {
        this.error = 'Error de conexión con el servidor';
        this.carreras = [];
        this.cargando = false;
        onDone?.();
      },
    });
  }
}
