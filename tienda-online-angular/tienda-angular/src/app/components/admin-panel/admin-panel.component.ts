import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TiendaService } from '../../services/tienda.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  private tiendaService = inject(TiendaService);

  @Output() volver = new EventEmitter<void>();

  // Estado local para categorías
  categorias: Categoria[] = [];

  // Estado para la nueva categoría
  nuevaCategoria: string = '';

  // Estado del formulario del producto
  formData = {
    codigo: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '' // ID de la categoría
  };

  // Estado para las imágenes
  imagenesArchivos: File[] = [];
  imagenesPreviews: string[] = [];

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.tiendaService.obtenerCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats;
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  // Agregar una nueva categoría a la base de datos
  handleAgregarCategoria(e: Event) {
    e.preventDefault();
    const nombreTrim = this.nuevaCategoria.trim();
    if (nombreTrim !== '') {
      this.tiendaService.agregarCategoria(nombreTrim).subscribe({
        next: () => {
          alert(`Categoría "${nombreTrim}" añadida con éxito.`);
          this.nuevaCategoria = '';
          this.cargarCategorias();
          this.tiendaService.cargarCatalogo(); // actualiza catálogo en la tienda
        },
        error: (err) => {
          alert(`Error: ${err.error?.mensaje || 'No se pudo añadir la categoría'}`);
        }
      });
    }
  }

  // Manejar el cambio de archivos de imagen
  handleFileChange(e: any) {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length > 0) {
      this.imagenesArchivos = [...this.imagenesArchivos, ...files];
      const previewUrls = files.map(file => URL.createObjectURL(file));
      this.imagenesPreviews = [...this.imagenesPreviews, ...previewUrls];
    }
  }

  // Eliminar una imagen seleccionada antes de publicar/guardar
  handleEliminarImagen(index: number) {
    this.imagenesArchivos = this.imagenesArchivos.filter((_, i) => i !== index);
    this.imagenesPreviews = this.imagenesPreviews.filter((_, i) => i !== index);
  }

  // Enviar el formulario para Crear producto
  handleSubmit(e: Event) {
    e.preventDefault();

    const form = new FormData();
    form.append('codigo_unico', this.formData.codigo);
    form.append('nombre', this.formData.descripcion);
    form.append('descripcion', this.formData.descripcion);
    form.append('precio', this.formData.precio);
    form.append('stock', this.formData.stock);
    form.append('categoria_id', this.formData.categoria);

    // En creación (POST), el backend requiere que las imágenes se manden bajo la clave 'imagenes'
    this.imagenesArchivos.forEach(file => {
      form.append('imagenes', file);
    });

    this.tiendaService.agregarProducto(form).subscribe({
      next: () => {
        alert('Producto añadido con éxito.');
        this.resetFormulario();
        this.tiendaService.cargarCatalogo();
      },
      error: (err) => alert('Error al añadir producto: ' + err.message)
    });
  }

  private resetFormulario() {
    this.formData = {
      codigo: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: ''
    };
    this.imagenesArchivos = [];
    this.imagenesPreviews = [];
  }

  onVolverClick() {
    this.volver.emit();
  }
}
