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
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';
import { Alumno, AlumnoDTO } from '../../models/alumno.model';
import { Carrera } from '../../models/carrera.model';
import { AlumnoService } from '../../services/alumno.service';
import { CarreraService } from '../../services/carrera.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: 'alumnos.page.html',
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
    IonSelect,
    IonSelectOption,
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
export class AlumnosPage implements ViewWillEnter {
  private readonly alumnoService = inject(AlumnoService);
  private readonly carreraService = inject(CarreraService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  alumnos: Alumno[] = [];
  carreras: Carrera[] = [];
  cargando = false;
  error = '';

  // Formulario: idEditando en null significa que es un alta
  modalAbierto = false;
  idEditando: number | null = null;
  form: AlumnoDTO = this.formVacio();

  constructor() {
    addIcons({ add, create, trash });
  }

  ionViewWillEnter(): void {
    this.cargar();
    this.cargarCarreras();
  }

  recargar(event: RefresherCustomEvent): void {
    this.cargar(() => event.target.complete());
  }

  abrirCrear(): void {
    this.idEditando = null;
    this.form = this.formVacio();
    this.modalAbierto = true;
  }

  async abrirEditar(alumno: Alumno, sliding: IonItemSliding): Promise<void> {
    await sliding.close();
    this.idEditando = alumno.idAlumno;
    this.form = {
      nombre: alumno.nombre,
      aPaterno: alumno.aPaterno,
      aMaterno: alumno.aMaterno,
      idCarrera: alumno.idCarrera,
    };
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  // Las reglas (minimo de letras, solo letras, etc.) las valida la API
  guardar(): void {
    if (!this.form.idCarrera) {
      this.mostrarToast('Selecciona una carrera', 'warning');
      return;
    }

    if (this.idEditando === null) {
      this.crear(this.form);
    } else {
      this.actualizar(this.idEditando, this.form);
    }
  }

  async confirmarEliminar(alumno: Alumno, sliding: IonItemSliding): Promise<void> {
    await sliding.close();
    const alert = await this.alertCtrl.create({
      header: 'Eliminar alumno',
      message: `¿Seguro que quieres eliminar a "${alumno.nombre} ${alumno.aPaterno}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminar(alumno.idAlumno),
        },
      ],
    });
    await alert.present();
  }

  private crear(dto: AlumnoDTO): void {
    this.alumnoService.crear(dto).subscribe({
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

  private actualizar(idAlumno: number, dto: AlumnoDTO): void {
    this.alumnoService.actualizar(idAlumno, dto).subscribe({
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

  private eliminar(idAlumno: number): void {
    this.alumnoService.eliminar(idAlumno).subscribe({
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

    this.alumnoService.obtenerTodos().subscribe({
      next: (response) => {
        if (response.status && response.value) {
          this.alumnos = response.value;
        } else {
          this.error = response.msg || 'No se pudieron cargar los alumnos';
          this.alumnos = [];
        }
        this.cargando = false;
        onDone?.();
      },
      error: () => {
        this.error = 'Error de conexión con el servidor';
        this.alumnos = [];
        this.cargando = false;
        onDone?.();
      },
    });
  }

  // Opciones del ion-select del formulario
  private cargarCarreras(): void {
    this.carreraService.obtenerTodos().subscribe({
      next: (response) => (this.carreras = response.value ?? []),
      error: () => (this.carreras = []),
    });
  }

  private formVacio(): AlumnoDTO {
    return { nombre: '', aPaterno: '', aMaterno: '', idCarrera: 0 };
  }
}
