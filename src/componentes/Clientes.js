import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import Modal from './Modal';

class Clientes extends Component {

  constructor(props) {
    super(props)

    this.state = {
      clientes: [],
      ventasCliente: [],
      contenido: () => {
      },
      tituloModal: '',
      idCliente: '',
      nombre: '',
      nombreMensaje: ''
    }

    this.obtenerClientes = this.obtenerClientes.bind(this);
    this.obtenerVentasCliente = this.obtenerVentasCliente.bind(this);
    this.formulario = this.formulario.bind(this);
    this.listaVentas = this.listaVentas.bind(this);
    this.guardarCliente = this.guardarCliente.bind(this);
    this.eliminarCliente = this.eliminarCliente.bind(this);
    this.cargarAgregarCliente = this.cargarAgregarCliente.bind(this);
    this.cargarModificarCliente = this.cargarModificarCliente.bind(this);
    this.cargarVentasCliente = this.cargarVentasCliente.bind(this);

  }

  componentWillMount() {
    this.obtenerClientes();
  }

  columns = [{
    dataField: 'id_cliente',
    text: 'ID Cliente',
    filter: textFilter({
      placeholder: 'Buscar por ID...',
    })
  }, {
    dataField: 'nombre',
    text: 'Nombre',
    filter: textFilter({
      placeholder: 'Buscar por Nombre...',
    })
  }, {
    dataField: '',
    text: 'Opciones',
    formatter: (cell, row) => {
      return (
        <div>
          <button type='button' className='btn btn-secondary btn-sm' alt='Modificar' title='Modificar' data-toggle='modal' data-target='#ventanaModal' onClick={(e) => this.cargarModificarCliente(row, e)}><i className='fa fa-edit'></i></button>&nbsp;
            <button type='button' className='btn btn-secondary btn-sm' alt='Eliminar' title='Eliminar' onClick={(e) => this.eliminarCliente(row, e)}><i className='fa fa-trash' ></i></button>&nbsp;
            <button type='button' className='btn btn-secondary btn-sm' alt='Ver Ventas al Cliente' title='Ver Ventas al Cliente' data-toggle='modal' data-target='#ventanaModal' onClick={(e) => this.cargarVentasCliente(row, e)}><i className='fa fa-list-alt'></i></button>&nbsp;
          </div>
      );
    }
  }
  ];

  columnsVentas = [{
    dataField: 'id_venta',
    text: 'ID Venta'
  }, {
    dataField: 'fecha',
    text: 'Fecha'
  }, {
    dataField: 'total_general',
    text: 'Total General'
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

  obtenerClientes = () => {
    fetch('http://localhost:4300/api/clientes')
      .then((response) => {
        return response.json()
      })
      .then((clientes) => {
        this.setState({ clientes: clientes.data })
      })
  }

  obtenerVentasCliente = idCliente => {
    fetch(`http://localhost:4300/api/ventasCliente/${idCliente}`)
      .then((response) => {
        return response.json()
      })
      .then((ventasCliente) => {
        this.setState({ ventasCliente: ventasCliente.data });
        console.log(this.state.ventasCliente);
      })
  }

  formulario = () => (
    <div>
      <div className='modal-body'>
        <form>

          <div className='form-group row'>
            <input type='hidden' value={this.state.idCliente} />
            <label htmlFor='nombre' className='col-sm-2 col-form-label'>Nombre</label>
            <div className='col-sm-10'>
              <input type='text' value={this.state.nombre || ''} aria-describedby='Nombre Cliente' placeholder='Nombre Cliente' maxLength='200' size='40' onChange={e => this.setState({ nombre: e.target.value })} />
              <small className='form-text text-danger'>{this.state.nombreMensaje}</small>
            </div>
          </div>

        </form>
      </div>
      <div className='modal-footer'>
        <button type='button' className='btn btn-primary' onClick={this.guardarCliente}>Guardar</button>
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
          data={this.state.ventasCliente}
          columns={this.columnsVentas}
          striped
          hover
          condensed
          pagination={paginationFactory(this.options)}
          filter={filterFactory()} />
      </div>
      <div className='modal-footer'>
        <button type='button' className='btn btn-secondary' data-dismiss='modal' id='cerrar'>Cerrar</button>
      </div>
    </div>
  );

  guardarCliente = () => {

    const idCliente = parseInt(this.state.idCliente, 20);
    const nombre = this.state.nombre;

    this.setState({ nombreMensaje: '' });

    if (nombre.length > 0) {

      const data = {
        'nombre': nombre
      };

      //Se determina la ruta y el metodo dependiendo si se quiere agregar o modificar
      const ruta = `http://localhost:4300/api/clientes${((idCliente != null && Number.isInteger(idCliente)) ? ('/' + idCliente) : '')}`;
      const metodo = ((idCliente != null && Number.isInteger(idCliente)) ? 'PUT' : 'POST');

      fetch(ruta, {
        method: metodo,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        document.getElementById('cerrar').click();
        this.obtenerClientes();
        return res;
      }).catch(err => err);

    } else {
      this.setState({ nombreMensaje: 'Debe escribir un nombre.' });
    }

  }

  eliminarCliente = (row) => {
    if (window.confirm('Confirma que desea eliminar al cliente ' + row.nombre + '?')) {
      fetch(`http://localhost:4300/api/clientes/${row.id_cliente}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        this.obtenerClientes();
        return res;
      }).catch(err => err);
    }
  }

  cargarAgregarCliente = () => {
    this.setState({
      contenido: this.formulario
    },
      () => {

        this.setState({
          tituloModal: 'Agregar Cliente',
          idCliente: '',
          nombre: '',
          nombreMensaje: ''
        });

      });
  }

  cargarModificarCliente = (row) => {
    this.setState({
      contenido: this.formulario
    },
      () => {

        this.setState({
          tituloModal: 'Modificar Cliente',
          idCliente: row.id_cliente,
          nombre: row.nombre,
          nombreMensaje: ''
        });
      });
  }

  cargarVentasCliente = (row) => {
    this.setState({
      contenido: this.listaVentas
    },
      () => {
        this.setState({ tituloModal: `Ventas al Cliente ${row.nombre}` });
        this.obtenerVentasCliente(row.id_cliente);
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
              <h1>Clientes</h1>
            </div>

            <br />

            <button type='button' className='btn btn-secondary' data-toggle='modal' data-target='#ventanaModal' onClick={(e) => this.cargarAgregarCliente(e)}><i className='fa fa-plus'></i>&nbsp;Agregar Cliente</button>

            <br /><br />

            <BootstrapTable
              classes='table-sm'
              keyField='id_cliente'
              data={this.state.clientes}
              columns={this.columns}
              striped
              hover
              condensed
              pagination={paginationFactory(this.options)}
              filter={filterFactory()}
            />

          </main>

          <Modal contenido={this.state.contenido} tituloModal={this.state.tituloModal} />

        </div>
      </div>
    );
  }
}

export default Clientes;
