import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewWillEnter } from '@ionic/angular';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
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
import { Maestro, MaestroDTO } from '../../models/maestro.model';
import { MaestroService } from '../../services/maestro.service';

@Component({
  selector: 'app-maestros',
  templateUrl: 'maestros.page.html',
  imports: [
    FormsModule,
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonNote,
    IonInput,
    IonModal,
    IonSpinner,
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class MaestrosPage implements ViewWillEnter {
  private readonly maestroService = inject(MaestroService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  maestros: Maestro[] = [];
  cargando = false;
  error = '';

  // Formulario: idEditando en null significa que es un alta
  modalAbierto = false;
  idEditando: number | null = null;
  form: MaestroDTO = this.formVacio();

  constructor() {
    addIcons({ add, create, trash });
  }

  ionViewWillEnter(): void {
    this.cargar();
  }

  recargar(event: RefresherCustomEvent): void {
    this.cargar(() => event.target.complete());
  }

  abrirCrear(): void {
    this.idEditando = null;
    this.form = this.formVacio();
    this.modalAbierto = true;
  }

  async abrirEditar(maestro: Maestro, sliding: IonItemSliding): Promise<void> {
    await sliding.close();
    this.idEditando = maestro.idMaestro;
    this.form = {
      nombre: maestro.nombre,
      aPaterno: maestro.aPaterno,
      aMaterno: maestro.aMaterno,
    };
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  // Las reglas (minimo de letras, solo letras, etc.) las valida la API
  guardar(): void {
    if (this.idEditando === null) {
      this.crear(this.form);
    } else {
      this.actualizar(this.idEditando, this.form);
    }
  }

  async confirmarEliminar(maestro: Maestro, sliding: IonItemSliding): Promise<void> {
    await sliding.close();
    const alert = await this.alertCtrl.create({
      header: 'Eliminar maestro',
      message: `¿Seguro que quieres eliminar a "${maestro.nombre} ${maestro.aPaterno}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminar(maestro.idMaestro),
        },
      ],
    });
    await alert.present();
  }

  private crear(dto: MaestroDTO): void {
    this.maestroService.crear(dto).subscribe({
      next: (response) => {
        if (response.status) {
          this.mostrarToast(response.msg, 'success');
          this.cerrarModal();
          this.cargar();
        } else {
          this.mostrarToast(response.msg, 'warning');
        }
      },
      error: () => this.mostrarToast('Error de conexión con el servidor', 'danger'),
    });
  }

  private actualizar(idMaestro: number, dto: MaestroDTO): void {
    this.maestroService.actualizar(idMaestro, dto).subscribe({
      next: (response) => {
        if (response.status) {
          // Actualizar y Eliminar regresan el mensaje en value, no en msg
          this.mostrarToast(response.value ?? '', 'success');
          this.cerrarModal();
          this.cargar();
        } else {
          this.mostrarToast(response.msg, 'warning');
        }
      },
      error: () => this.mostrarToast('Error de conexión con el servidor', 'danger'),
    });
  }

  private eliminar(idMaestro: number): void {
    this.maestroService.eliminar(idMaestro).subscribe({
      next: (response) => {
        if (response.status) {
          this.mostrarToast(response.value ?? '', 'success');
          this.cargar();
        } else {
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

    this.maestroService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.status && response.value) {
          this.maestros = response.value;
        } else {
          this.error = response.msg || 'No se pudieron cargar los maestros';
          this.maestros = [];
        }
        this.cargando = false;
        onDone?.();
      },
      error: () => {
        this.error = 'Error de conexión con el servidor';
        this.maestros = [];
        this.cargando = false;
        onDone?.();
      },
    });
  }

  private formVacio(): MaestroDTO {
    return { nombre: '', aPaterno: '', aMaterno: '' };
  }
}
