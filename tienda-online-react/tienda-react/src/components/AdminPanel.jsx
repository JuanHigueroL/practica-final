import React, { useState } from 'react';

export default function AdminPanel({ categorias, onAgregarCategoria, onAgregarProducto, onVolver }) {
  // Estado para la nueva categoría
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  // Estado del formulario del producto
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: ''
  });
  
  // Estado para las imágenes físicas
  const [imagenesArchivos, setImagenesArchivos] = useState([]);
  const [imagenesPreviews, setImagenesPreviews] = useState([]);

  const handleAgregarCategoria = async (e) => {
    e.preventDefault();
    if (nuevaCategoria.trim() !== '') {
      try {
        const response = await fetch('http://localhost:3000/api/categorias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nuevaCategoria.trim() })
        });
        if (response.ok) {
          onAgregarCategoria(); // Llama a recargar de App.jsx
          alert(`Categoría "${nuevaCategoria.trim()}" añadida con éxito.`);
          setNuevaCategoria('');
        } else {
          const data = await response.json();
          alert(`Error: ${data.mensaje || 'No se pudo añadir la categoría'}`);
        }
      } catch (err) {
        // Error silenciado
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImagenesArchivos(prev => [...prev, ...files]);
      const previewsUrls = files.map(f => URL.createObjectURL(f));
      setImagenesPreviews(prev => [...prev, ...previewsUrls]);
    }
  };
  
  const handleEliminarImagen = (index) => {
    setImagenesArchivos(prev => prev.filter((_, i) => i !== index));
    setImagenesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('codigo_unico', formData.codigo);
    form.append('nombre', formData.descripcion); 
    form.append('descripcion', formData.descripcion);
    form.append('precio', formData.precio);
    form.append('stock', formData.stock);
    form.append('categoria_id', formData.categoria);
    
    imagenesArchivos.forEach(file => {
      form.append('imagenes', file);
    });

    try {
      const response = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        body: form
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || data.mensaje || 'Error al añadir producto');

      onAgregarProducto(); // Recarga desde App.jsx
      
      setFormData({ codigo: '', descripcion: '', precio: '', stock: '', categoria: '' });
      setImagenesArchivos([]);
      setImagenesPreviews([]);
      alert('Producto añadido con éxito al backend y catálogo.');
    } catch(err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light py-5">
      <div className="container">
        
        {/* Encabezado del Panel de Administración */}
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-4">
          <h1 className="fw-bold mb-0 d-flex align-items-center gap-3">
            <i className="bi bi-gear-fill text-primary" />
            Panel de Administración
          </h1>
          <button className="btn btn-primary fw-bold px-4 py-2 shadow-sm rounded-pill d-flex align-items-center gap-2" onClick={onVolver}>
            <i className="bi bi-arrow-left" />
            Volver a la Tienda
          </button>
        </div>

        <div className="row g-4">
          {/* COLUMNA IZQUIERDA: GESTIÓN DE CATEGORÍAS */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4">
                <h5 className="fw-bold"><i className="bi bi-tags-fill text-primary me-2"/>Gestión de Categorías</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleAgregarCategoria} className="mb-4">
                  <label className="form-label text-muted small fw-bold">Añadir Nueva Categoría</label>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control bg-light border-0" 
                      placeholder="Ej: Deportes"
                      value={nuevaCategoria}
                      onChange={(e) => setNuevaCategoria(e.target.value)}
                      required
                    />
                    <button className="btn btn-primary fw-bold" type="submit">
                      <i className="bi bi-plus-lg" /> Añadir 
                    </button>
                  </div>
                </form>
                
                <h6 className="fw-bold text-muted mb-3 small">Categorías Activas</h6>
                <div className="d-flex flex-wrap gap-2">
                  {categorias.map((cat) => (
                    <span key={cat.id} className="badge bg-secondary bg-opacity-25 text-body fs-6 py-2 px-3 fw-medium rounded-pill border">
                      {cat.nombre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: AÑADIR PRODUCTO NUEVO */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-header bg-transparent border-0 pt-4 pb-2 px-4">
                <h5 className="fw-bold"><i className="bi bi-box-seam-fill text-primary me-2"/>Añadir Nuevo Producto</h5>
                <p className="text-muted small mb-0">Rellena los detalles para añadir un producto al catálogo principal.</p>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit} className="row g-4">
                  
                  {/* Código */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Código del Producto</label>
                    <input type="text" className="form-control bg-light border-0 py-2" name="codigo" value={formData.codigo} onChange={handleChange} required placeholder="Ej: PRD-001" />
                  </div>

                  {/* Categoría Dinámica */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Categoría</label>
                    <select className="form-select bg-light border-0 py-2" name="categoria" value={formData.categoria} onChange={handleChange} required>
                      <option value="" disabled>Selecciona una categoría...</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Descripción */}
                  <div className="col-12">
                    <label className="form-label fw-bold">Descripción / Nombre</label>
                    <input type="text" className="form-control bg-light border-0 py-2" name="descripcion" value={formData.descripcion} onChange={handleChange} required placeholder="Escribe un título descriptivo..." />
                  </div>

                  {/* Precio */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Precio Unitario (€)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 text-muted">€</span>
                      <input type="number" step="0.01" min="0" className="form-control bg-light border-0 py-2" name="precio" value={formData.precio} onChange={handleChange} required placeholder="0.00" />
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Stock Inicial</label>
                    <input type="number" min="1" className="form-control bg-light border-0 py-2" name="stock" value={formData.stock} onChange={handleChange} required placeholder="10" />
                  </div>

                  {/* Input de Archivos (Imágenes) */}
                  <div className="col-12">
                     <label className="form-label fw-bold">Fotografías del Producto</label>
                    <div className="rounded-4 p-4 text-center bg-light mt-1 position-relative" style={{ border: '2px dashed #dee2e6' }}>
                      <i className="bi bi-cloud-arrow-up text-primary fs-1 mb-2 d-block" />
                      <h6 className="fw-bold mb-1">Arrastra imágenes o haz clic para seleccionarlas</h6>
                      <p className="text-muted small mb-0">Formato JPG o PNG. Hasta 10 imágenes.</p>
                      
                      <input 
                        type="file" 
                        name="imagenes"
                        multiple
                        className="form-control position-absolute w-100 h-100 opacity-0" 
                        style={{ top: 0, left: 0, cursor: 'pointer' }}
                        accept="image/*" 
                        onChange={handleFileChange} 
                        title="Selecciona imágenes para el producto"
                        required={imagenesArchivos.length === 0}
                      />
                    </div>
                  </div>

                  {/* Previsualización Imágenes (Botón de eliminar incluido) */}
                  {imagenesPreviews.length > 0 && (
                    <div className="col-12">
                      <label className="form-label fw-bold text-muted small">Imágenes Seleccionadas</label>
                      <div className="d-flex flex-wrap gap-3 p-3 bg-light rounded-4 border">
                        {imagenesPreviews.map((preview, i) => (
                          <div key={i} className="position-relative" style={{ width: '80px', height: '80px' }}>
                            <img src={preview} alt={`Preview ${i}`} className="w-100 h-100 object-fit-cover rounded shadow-sm border" />
                            <button 
                              type="button" 
                              className="btn btn-sm btn-danger position-absolute rounded-circle p-0 d-flex align-items-center justify-content-center shadow"
                              style={{ top: '-8px', right: '-8px', width: '24px', height: '24px' }}
                              onClick={() => handleEliminarImagen(i)}
                              title="Eliminar imagen"
                            >
                              <i className="bi bi-x fw-bold" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Acciones del formulario */}
                  <div className="col-12 mt-4 pt-3 border-top">
                    <div className="d-flex justify-content-end gap-3">
                      <button type="submit" className="btn btn-primary px-5 py-2 fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2">
                        <i className="bi bi-send-check-fill" /> Publicar Producto
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
