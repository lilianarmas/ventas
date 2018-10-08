import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Select from 'react-select';

import Modal from './Modal';

class Ventas extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      ventas: [], 
      clientes: [], 
      productos: [], 
      ventaDetalle: [],
      id_venta: '',
      fecha: '',
      cantidad: null,
      precio: null,
      existencia: null,
      contenido : () => {

      },
      selectedOptionCliente: '',
      selectedOptionProducto: ''
    }
    this.handleChangeCliente = this.handleChangeCliente.bind(this);
    this.handleChangeProducto = this.handleChangeProducto.bind(this);
    this.obtenerVentas = this.obtenerVentas.bind(this);
    this.obtenerClientes = this.obtenerClientes.bind(this);
    this.obtenerProductos = this.obtenerProductos.bind(this);
    this.obtenerVentaDetalle = this.obtenerVentaDetalle.bind(this);
    this.formulario = this.formulario.bind(this);
    this.listaVentas = this.listaVentas.bind(this);
    this.guardarVenta = this.guardarVenta.bind(this);
    this.cargarAgregarVenta = this.cargarAgregarVenta.bind(this);
    this.cargarModificarVenta = this.cargarModificarVenta.bind(this);
    this.cargarDetallesVenta = this.cargarDetallesVenta.bind(this);
    this.agregarDetalleVentaMemoria = this.agregarDetalleVentaMemoria.bind(this);
  }

  componentWillMount() {
    this.obtenerVentas();
  }

  handleChangeCliente = (selectedOptionCliente) => {
    this.setState({
      selectedOptionCliente,
      clienteMensaje: ''
    });
  }

  handleChangeProducto = (selectedOptionProducto) => {
    this.setState({ selectedOptionProducto });

    //Obtener existencia del producto
    fetch('http://localhost:4300/api/productos/'+selectedOptionProducto.value)
      .then((response) => {
        return response.json()
      })
      .then((producto) => {
        this.setState({
          precio: producto.data.precio,
          existencia: producto.data.existencia
        });
      });
  }

  columns = [{
    dataField: 'id_venta',
    text: 'ID Venta',
    filter: textFilter({
      placeholder: 'Buscar por ID...',
    })
  }, 
  {
  dataField: 'nombre',
    text: 'Cliente',
    filter: textFilter({
      placeholder: 'Buscar por Nombre...',
    })
  },
  {
    dataField: 'fecha',
    text: 'Fecha'
  },
  {
    dataField: 'total_general',
    text: 'Total General'
  },
  {
  dataField: '',
    text: 'Opciones',
    formatter: (cell, row) => {
      return (
        <div>
          <button type='button' className='btn btn-secondary btn-sm' alt='Ver Detalles de Venta' title='Ver Detalles de Venta' data-toggle='modal' data-target='#ventanaModal' onClick={(e) => this.cargarDetallesVenta(row, e)}><i className='fa fa-list-alt'></i></button>
        </div>
      );
    }
  }];

  columnsVentas = [{
    dataField: 'renglon',
    text: 'Renglon'
  },{
    dataField: 'id_producto',
    text: 'ID Producto'
  },{
    dataField: 'descripcion',
    text: 'Descripción Producto'
  },{
    dataField: 'cantidad',
    text: 'Cantidad'
  },{
    dataField: 'precio',
    text: 'Precio'
  },{
    dataField: 'total',
    text: 'Total'
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

  obtenerVentas() {
    fetch('http://localhost:4300/api/ventas')
      .then((response) => {
        return response.json()
      })
      .then((ventas) => {
        this.setState({ ventas: ventas.data })
      })
  }

  obtenerClientes(callback) {
    fetch('http://localhost:4300/api/clientesSeleccion')
      .then((response) => {
        return response.json()
      })
      .then((clientes) => {
        this.setState({ clientes: clientes.data });
        callback();
      });
  }

  obtenerProductos(callback) {
    fetch('http://localhost:4300/api/productosSeleccion')
      .then((response) => {
        return response.json()
      })
      .then((productos) => {
        this.setState({ productos: productos.data });
        callback();
      });
  }

  obtenerVentaDetalle(idVenta) {
    fetch('http://localhost:4300/api/ventasDetalle/'+idVenta)
      .then((response) => {
        return response.json()
      })
      .then((ventaDetalle) => {
        this.setState({ ventaDetalle: ventaDetalle.data });
      });
  }

  formulario = () => (
  <div>
    <div className='modal-body'>		        
      <form>
                  
        <div className='form-group row'>
          <input type='hidden' value={this.state.id_venta}/>
          <label htmlFor='nombre' className='col-sm-2 col-form-label'>Cliente</label>
          <div className='col-sm-10'>
            <Select
              id='id_cliente'
              name='id_cliente'
              value={this.state.selectedOptionCliente}
              placeholder='Seleccione cliente...'
              noResultsText='No hay resultados'
              onChange={this.handleChangeCliente}
              options={this.state.clientes}
            />

            <small className='form-text text-danger'>{this.state.clienteMensaje || ''}</small>
          </div>
          <label htmlFor='fecha' className='col-sm-2 col-form-label'>Fecha</label>
          <div className='col-sm-10'>
            <input type='text' value={this.state.fecha || ''} aria-describedby='fecha' placeholder='Fecha' maxLength='10' size='40' readOnly/>
            <small id='fechaMensaje' className='form-text text-danger'></small>
          </div>
          <label htmlFor='nombre' className='col-sm-2 col-form-label'>Total General</label>
          <div className='col-sm-10'>
            <input type='text' value={this.state.total_general || ''} aria-describedby='Total General' placeholder='Total General' maxLength='15' size='40' readOnly/>
            <small className='form-text text-danger'>{this.state.totalGeneralMensaje || ''}</small>
          </div>
        </div>

      </form>

      <form className='form-horizontal'>
        <small id='detalleMensaje' className='form-text text-danger'></small>
        <div className='form-group'>
          <label htmlFor='id_producto' className='sr-only'>Producto</label>
          <Select
            id='id_producto'
            name='id_producto'
            value={this.state.selectedOptionProducto}
            placeholder='Seleccione producto...'
            noResultsText='No hay resultados'
            onChange={this.handleChangeProducto}
            options={this.state.productos}
          />
        </div>
      </form>

      <form className='form-inline'>
        <div className='form-group'>
          <label htmlFor='cantidad' className='sr-only'>Cantidad</label>
          <input type='text' className='form-control' value={this.state.cantidad || ''} placeholder='Cantidad' size='10' onChange={e => this.setState({ cantidad: e.target.value })} />
        </div>
        <div className='form-group'>
          <label htmlFor='precio' className='sr-only'>Precio</label>
          <input type='text' className='form-control' value={this.state.precio || ''} placeholder='Precio' size='15' readOnly/>
        </div>
        <div className='form-group'>
          <small className='form-text text-primary'>&nbsp;Disponibilidad&nbsp;</small>
          <label htmlFor='existencia' className='sr-only'>Existencia</label>
          <input type='text' className='form-control' value={this.state.existencia || ''} placeholder='Existencia' size='10' readOnly/>
        </div>
        <button type='button' className='btn btn-primary mb-1' onClick={(e) => this.agregarDetalleVentaMemoria(e)} title='Agregar renglon' alt='Agregar renglon'><i className='fa fa-plus'></i></button>
      </form>

      <BootstrapTable
        classes='table-sm'
        keyField='renglon'
        data={ this.state.ventaDetalle  }
        columns={ this.columnsVentas }
        striped
        hover
        condensed
        pagination={ paginationFactory(this.options) }
        filter={ filterFactory() }
      />
      
    </div>
    <div className='modal-footer'>
      <button type='button' className='btn btn-primary' onClick={this.guardarVenta.bind(this)}>Guardar</button>
      <button type='button' className='btn btn-secondary' data-dismiss='modal' id='cerrar'>Cancelar</button>
    </div>	
  </div>
  );

  listaVentas = () => (
  <div>
    <div className='modal-body'>		        
      <BootstrapTable
        classes='table-sm'
        keyField='id_venta'
        data={ this.state.ventaDetalle  }
        columns={ this.columnsVentas }
        striped
        hover
        condensed
        pagination={ paginationFactory(this.options) }
        filter={ filterFactory() }
      />
    </div>
    <div className='modal-footer'>
      <button type='button' className='btn btn-secondary' data-dismiss='modal' id='cerrar'>Cerrar</button>
    </div>	
  </div>
  );

  guardarVenta() {

    var idVenta = parseInt(this.state.id_venta,10);
    var totalGeneral = this.state.total_general;

    if(this.state.selectedOptionCliente.value > 0) {
      if(parseFloat(totalGeneral) > 0) {

        var data = {
          'id_cliente' : this.state.selectedOptionCliente.value,
          'total_general' : totalGeneral
        };

        //Se determina la ruta y el metodo dependiendo si se quiere agregar o modificar
        var ruta = 'http://localhost:4300/api/ventas' + ((idVenta!=null && Number.isInteger(idVenta))?('/'+idVenta):'');
        var metodo = ((idVenta != null && Number.isInteger(idVenta)) ? 'PUT' : 'POST');

        //Se almacena el encabezado de la venta
        fetch(ruta, {
          method: metodo,
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            return response.json()
          })
          .then((venta) => {
              
            //Se recorre el detalle de la venta para almacenarlo
            for(let detalle of this.state.ventaDetalle) {
              detalle.id_venta = venta.id_venta; //ID de la venta generado en la BD
                fetch('http://localhost:4300/api/ventasDetalle', {
                  method: 'POST',
                  body: JSON.stringify(detalle),
                  headers: {
                    'Content-Type': 'application/json'
                  }
              }).then(res => {

                var existencia = {
                  'cantidad' : -detalle.cantidad,
                  'id_producto': detalle.id_producto
                };

                //Se actualiza la existencia del producto
                fetch('http://localhost:4300/api/productosExistencia/'+detalle.id_producto, {
                  method: 'PUT',
                  body: JSON.stringify(existencia),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then(res => {
                  return res;
                }).catch(err => err); 

                return res;
              }).catch(err => err); 
            }

          document.getElementById('cerrar').click();
          this.obtenerVentas();
        }); 

      } else {
        this.setState({ totalGeneralMensaje: 'El total general debe ser mayor a 0.'});
      }

    } else {
      this.setState({ clienteMensaje: 'Debe seleccionar un cliente.'});
    }
  }

  cargarAgregarVenta = (row) => {
    this.setState({
      contenido: this.formulario.bind(this),
      ventaDetalle : []
    },
    () => {
      this.obtenerClientes(()=> {

        this.obtenerProductos(()=> {
          var fecha = new Date();
          var dd = fecha.getDate();
          var mm = fecha.getMonth() + 1; //January is 0!
          var yyyy = fecha.getFullYear();
  
          if(dd < 10) {
            dd = '0'+dd
          } 
  
          if(mm < 10) {
            mm = '0'+mm
          } 
  
          fecha = dd + '/' + mm + '/' + yyyy;

          this.setState({
            tituloModal: 'Agregar Venta',
            selectedOptionCliente : '', 
            selectedOptionProducto : '',
            fecha,
            id_venta: '',
            total_general: 0,
            cantidad: '',
            precio: '',
            existencia: '',
            totalGeneralMensaje: '',
            clienteMensaje: ''
          });

        });
        
      });
    });
  }

  cargarModificarVenta = (row) => {
    this.setState({
      contenido: this.formulario.bind(this)
      },
    () => {
      this.setState({
        tituloModal: 'Modificar Venta',
        id_venta: row.id_venta,
        fecha: row.fecha,
        id_cliente: row.id_cliente,
        total_general: row.total_general
      });
    });
  }

  cargarDetallesVenta = (row) => {
    this.setState({
      contenido: this.listaVentas.bind(this)
    },
    () => {
      this.setState({
        tituloModal : `Venta: ${row.id_venta} | Cliente: ${row.nombre} | Fecha: ${row.fecha} | Total General: ${row.total_general}`
      });
      this.obtenerVentaDetalle(row.id_venta);
    });
  }

  agregarDetalleVentaMemoria() {

    var cantidad = parseInt(this.state.cantidad,10);
    var precio = parseFloat(this.state.precio);
    var existencia = parseInt(this.state.existencia,10);

    this.setState({
      detalleMensaje: '',
      totalGeneralMensaje: ''
    });

    if(this.state.selectedOptionProducto.value > 0 && cantidad > 0 && precio > 0) {

      var duplicado = false;

      for(let detalle of this.state.ventaDetalle) {
        if(this.state.selectedOptionProducto.value === detalle.id_producto) {
          duplicado = true;
        }
      }

      if(!duplicado) {

        if(cantidad <= existencia) {
          var total = cantidad * precio;
          var total_general = parseFloat(this.state.total_general);

          this.setState({
            total_general: total_general + total,
            ventaDetalle: [...this.state.ventaDetalle, {
              'renglon':this.state.ventaDetalle.length+1,
              'id_producto': this.state.selectedOptionProducto.value,
              'descripcion': this.state.selectedOptionProducto.label,
              'cantidad': cantidad,
              'precio': precio,
              'total' : total
            }]
          });

          this.setState({ 
            selectedOptionProducto : '',
            cantidad: '',
            precio: '',
            existencia: ''
          });

        } else {
          this.setState({
            detalleMensaje: 'Debe agregar una cantidad menor o igual a la disponible.'
          });
        }
      } else {
        this.setState({
          detalleMensaje: 'El producto ya se encuentra agregado.'
        });
      }
    } else {
      this.setState({
        detalleMensaje: 'Debe ingresar un Producto, Cantidad y Precio.'
      });
    }
  }

  render() {

    return (
      <div className='App'>
        <header className='App-header'>

        </header>
        <div className='App-intro'>

          <main role='main' className='col-md-9 ml-sm-auto col-lg-10 pt-3 px-4'>

            <div className='border-bottom'>
              <h1>Ventas</h1>
            </div>

            <br/>

            <button type='button' className='btn btn-secondary' data-toggle='modal' data-target='#ventanaModal' onClick={(e) => this.cargarAgregarVenta(e)}><i className='fa fa-plus'></i>&nbsp;Agregar Venta</button>

            <br/><br/>

            <BootstrapTable
              classes='table-sm'
              keyField='id_venta'
              data={ this.state.ventas  }
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

export default Ventas;