import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import Modal from './Modal';

class Productos extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      productos: [], 
      contenido : () => {
      },
      entradas: [],
      readonly : false,
      tituloModal: '',
      idProducto: '',
      descripcion: '',
      precio: '',
      existencia: '',
      existenciaMensaje: '',
      precioMensaje: '',
      descripcionMensaje: ''
    }

    this.obtenerProductos = this.obtenerProductos.bind(this);
    this.obtenerEntradas = this.obtenerEntradas.bind(this);
    this.actualizarInventario = this.actualizarInventario.bind(this);
    this.formulario = this.formulario.bind(this);
    this.guardarProducto = this.guardarProducto.bind(this);
    this.listaEntradas = this.listaEntradas.bind(this);
    this.eliminarProducto = this.eliminarProducto.bind(this);
    this.cargarAgregarProducto = this.cargarAgregarProducto.bind(this);
    this.cargarModificarProducto = this.cargarModificarProducto.bind(this);
    this.cargarEntradasProducto = this.cargarEntradasProducto.bind(this);
  }

  componentWillMount() {
    this.obtenerProductos();
  }

  columns = [{
    dataField: 'id_producto',
    text: 'ID Producto'
  }, {
    dataField: 'descripcion',
    text: 'Descripción',
    filter: textFilter({
      placeholder: 'Buscar por Descripción...',
    })
  },
  {
    dataField: 'precio',
    text: 'Precio'
  },
  {
    dataField: 'existencia',
    text: 'Existencia'
  },
  {
    dataField: '',
    text: 'Opciones',
    formatter: (cell, row) => {
      return (
        <div>
          <button type='button' className='btn btn-secondary btn-sm' alt='Modificar' title='Modificar' data-toggle='modal' data-target='#ventanaModal' onClick={(e) => this.cargarModificarProducto(row, e)}><i className='fa fa-edit'></i></button>&nbsp;
          <button type='button' className='btn btn-secondary btn-sm' alt='Eliminar' title='Eliminar' onClick={(e) => this.eliminarProducto(row, e)}><i className='fa fa-trash' ></i></button>&nbsp;
          <button type='button' className='btn btn-secondary btn-sm' alt='Ver Entradas a Inventario' title='Ver Entradas a Inventario' data-toggle='modal' data-target='#ventanaModal' onClick={(e) => this.cargarEntradasProducto(row, e)}><i className='fa fa-list-alt'></i></button>
        </div>
      );
    }
  }];

  columnsEntradas = [{
    dataField: 'id_entrada',
    text: 'ID Entrada'
  },{
    dataField: 'fecha',
    text: 'Fecha'
  },{
    dataField: 'cantidad',
    text: 'Cantidad'
  }];

  options = {
    paginationSize: 10,
    pageStartIndex: 1,
    // alwaysShowAllBtns: true, // Always show next and previous button
    // withFirstAndLast: false, // Hide the going to First and Last page button
    hideSizePerPage: true, // Hide the sizePerPage dropdown always
    hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    firstPageText: 'Primera',
    prePageText: 'Anterior',
    nextPageText: 'Siguiente',
    lastPageText: 'Último',
    nextPageTitle: 'Primera página',
    prePageTitle: 'Página anterior',
    firstPageTitle: 'Página siguiente',
    lastPageTitle: 'Última página',
    sizePerPageList: [{
    text: '10', value: 10
    }, {
    text: '20', value: 20
    }, {
    text: 'Todos', value: 50
    }] // A numeric array is also available. the purpose of above example is custom the text
  }

  obtenerProductos = () => {
    fetch('http://localhost:4300/api/productos')
      .then((response) => {
        return response.json()
      })
      .then((productos) => {
        this.setState({ productos: productos.data })
      })
  }

  obtenerEntradas = (idProducto) => {
    fetch(`http://localhost:4300/api/entradasProducto/${idProducto}`)
      .then((response) => {
        return response.json()
      })
      .then((entradas) => {
        this.setState({ entradas: entradas.data });
        console.log(this.state.entradas);
      });
  }

  actualizarInventario = (idProducto,cantidad) => {

    if(cantidad > 0) { 
      var existencia = {
        'cantidad' : cantidad,
        'id_producto': idProducto
      };

      //Se agrega la entrada al inventario
      fetch('http://localhost:4300/api/entradas', {
        method: 'POST',
        body: JSON.stringify(existencia),
        headers: {
            'Content-Type': 'application/json'
        }
      }).then(res => {
        //Se actualiza la existencia del producto
        fetch(`http://localhost:4300/api/productosExistencia/${idProducto}`, {
          method: 'PUT',
          body: JSON.stringify(existencia),
          headers: {
              'Content-Type': 'application/json'
          }
        }).then(res => {
          this.obtenerProductos();
            return res;
        }).catch(err => err);

        return res;
      }).catch(err => err); 
    }
  }

  formulario = () => (
    <div>
      <div className='modal-body'>		        
        <form>
                    
          <div className='form-group row'>
            <input type='hidden' value={this.state.idProducto} />
            <label className='col-sm-2 col-form-label'>Descripción</label>
            <div className='col-sm-10'>
              <input type='text' value={this.state.descripcion || ''} aria-describedby='Descripción' placeholder='Descripción' maxLength='300' size='40' onChange={e => this.setState({ descripcion: e.target.value })} />
              <small className='form-text text-danger'>{this.state.descripcionMensaje}</small>
            </div>
            <label className='col-sm-2 col-form-label'>Precio</label>
            <div className='col-sm-10'>
              <input type='text' value={this.state.precio || ''} aria-describedby='Precio' placeholder='Precio' maxLength='15' size='40' onChange={e => this.setState({ precio: e.target.value })} />
              <small className='form-text text-danger'>{this.state.precioMensaje}</small>
            </div>
            <label className='col-sm-2 col-form-label'>Existencia</label>
            <div className='col-sm-10'>
              <input type='text' value={this.state.existencia || ''} aria-describedby='Existencia Inicial' placeholder='Existencia Inicial' maxLength='10' size='40' readOnly={this.state.readonly} onChange={e => this.setState({ existencia: e.target.value })} />
              <small className='form-text text-danger'>{this.state.existenciaMensaje}</small>
            </div>

            {this.state.idProducto &&
              <div>
                <label className='col-sm-2 col-form-label'>Entrada</label>
                <div className='col-sm-10'>
                  <input type='text' value={this.state.agregarExistencia || ''} aria-describedby='Agregar a existencia' placeholder='Agregar a existencia' maxLength='10' size='40' readOnly={!this.state.readonly} onChange={e => this.setState({ agregarExistencia: e.target.value })} />
                </div>
              </div>
            }
          </div>

        </form>
      </div>
      <div className='modal-footer'>
        <button type='button' className='btn btn-primary' onClick={this.guardarProducto}>Guardar</button>
        <button type='button' className='btn btn-secondary' data-dismiss='modal' id='cerrar'>Cancelar</button>
      </div>	
    </div>
  );

  guardarProducto = () => {
    var idProducto = parseInt(this.state.idProducto,10);
    var descripcion = this.state.descripcion;
    var precio = this.state.precio;
    var existencia = parseInt(this.state.existencia,10);
    var agregarExistencia = parseInt(this.state.agregarExistencia,10);

    this.setState({
      existenciaMensaje: '',
      precioMensaje: '',
      descripcionMensaje: ''
    }, _ => {
      if(descripcion.length > 0) {
        if(parseFloat(precio) > 0) {
          if(parseInt(existencia,10) > 0 || (idProducto != null && Number.isInteger(idProducto))) {

            var data = {
              'descripcion' : descripcion,
              'precio' : precio
            };
  
            //Se determina la ruta y el metodo dependiendo si se quiere agregar o modificar
            var ruta = `http://localhost:4300/api/productos${((idProducto != null && Number.isInteger(idProducto))?('/'+idProducto):'')}`;
            var metodo = ((idProducto != null && Number.isInteger(idProducto))?'PUT':'POST');

            fetch(ruta, {
              method: metodo,
              body: JSON.stringify(data),
              headers: {
                  'Content-Type': 'application/json'
              }
            }).then((response) => {
                return response.json()
              })
              .then((producto) => {
                //Si se quiere agregar mas productos a la existencia
                if(Number.isInteger(agregarExistencia) && agregarExistencia > 0) {
                  if(idProducto != null && Number.isInteger(idProducto)){
                    this.actualizarInventario(idProducto,agregarExistencia);
                  } else { //Si se quiere agregar la existencia inicial
                    this.actualizarInventario(producto.id_producto,existencia);
                  }
                }

                document.getElementById('cerrar').click();
                this.obtenerProductos();
              });
  
            } else {
              this.setState({ existenciaMensaje: 'La existencia incial debe ser mayor a 0.' });
            }
          } else {
            this.setState({ precioMensaje: 'Debe escribir un precio.' });
          }
        } else {
          this.setState({ descripcionMensaje: 'Debe escribir una descripción.' });
        }
    });
  }

  listaEntradas = () => (
    <div>
      <div className='modal-body'>		        
        <BootstrapTable
          classes='table-sm'
          keyField='id_entrada'
          data={ this.state.entradas  }
          columns={ this.columnsEntradas }
          striped
          hover
          condensed
          pagination={ paginationFactory(this.options) }
          filter={ filterFactory() }/>
      </div>
      <div className='modal-footer'>
        <button type='button' className='btn btn-secondary' data-dismiss='modal' id='cerrar'>Cerrar</button>
      </div>	
    </div>
  );

  eliminarProducto (row){
    if(window.confirm(`Confirma que desea eliminar al producto ${row.descripcion}?`)) {

      fetch(`http://localhost:4300/api/productos/${row.id_producto}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        this.obtenerProductos();
        return res;
      }).catch(err => err);

    }
  }

  cargarAgregarProducto = () => {
    this.setState({
      readonly: false,
      contenido: this.formulario.bind(this)
      },
    () => {
      this.setState({ 
        tituloModal: 'Agregar Producto',
        idProducto: '',
        descripcion: '',
        precio: '',
        existencia: '',
        existenciaMensaje: '',
        precioMensaje: '',
        descripcionMensaje: ''
      });
    });
  }

  cargarModificarProducto = (row) => {
    this.setState({
      readonly: true,
        contenido: this.formulario.bind(this)
      },
    () => {
      this.setState({ 
        tituloModal: 'Modificar Producto',
        idProducto: row.id_producto,
        descripcion: row.descripcion,
        precio: row.precio,
        existencia: row.existencia,
        existenciaMensaje: '',
        precioMensaje: '',
        descripcionMensaje: '',
        agregarExistencia: ''
      });
    });
  }

  cargarEntradasProducto = (row) => {
    this.setState({
        contenido: this.listaEntradas.bind(this)
      },
      () => {		
      this.setState({ tituloModal: 'Entradas del Producto al Inventario' });
      this.obtenerEntradas(row.id_producto);
    });
  }

  render() {

    return (
      <div className='App'>
        <header className='App-header'>

        </header>
        <div className='App-intro'>

          <main role='main' className='col-md-9 ml-sm-auto col-lg-10 pt-3 px-4'>

            <div className='border-bottom'>
              <h1>Productos</h1>
            </div>

            <br/>

            <button type='button' className='btn btn-secondary' data-toggle='modal' data-target='#ventanaModal' onClick={() => this.cargarAgregarProducto()}><i className='fa fa-plus'></i>&nbsp;Agregar Producto</button>

            <br/><br/>

            <BootstrapTable
              classes='table-sm'
              keyField='id_producto'
              data={ this.state.productos  }
              columns={ this.columns }
              striped
              hover
              condensed
              pagination={ paginationFactory(this.options) }
              filter={ filterFactory() }
            />

          </main>

          <Modal contenido={this.state.contenido} tituloModal={this.state.tituloModal}/>

        </div>
      </div>
    );
  }
}

export default Productos;
