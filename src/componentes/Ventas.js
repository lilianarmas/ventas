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
	    	contenido : () => {

	    	},
	    	selectedOptionCliente: '',
	    	selectedOptionProducto: ''
	    }
	    this.formulario = this.formulario.bind(this);
	    this.listaVentas = this.listaVentas.bind(this);
	    this.cargarAgregarVenta = this.cargarAgregarVenta.bind(this);
	    this.cargarModificarVenta = this.cargarModificarVenta.bind(this);
	    this.agregarDetalleVentaMemoria = this.agregarDetalleVentaMemoria.bind(this);
  	}

  	componentWillMount() {
		this.obtenerVentas();
	}

	handleChangeCliente = (selectedOptionCliente) => {
	    this.setState({ selectedOptionCliente });
	}

	handleChangeProducto = (selectedOptionProducto) => {
	    this.setState({ selectedOptionProducto });

	    //Obtener existencia del producto
		fetch('http://localhost:4300/api/productos/'+selectedOptionProducto.value)
	      .then((response) => {
	        return response.json()
	      })
	      .then((producto) => {
	      	document.getElementById('precio').value = producto.data.precio;
	       	document.getElementById('existencia').value = producto.data.existencia;
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
				
				<button type="button" className="btn btn-secondary btn-sm" alt="Ver Detalles de Venta" title="Ver Detalles de Venta" data-toggle="modal" data-target="#ventanaModal" onClick={(e) => this.cargarDetallesVenta(row, e)}><i className="fa fa-list-alt"></i></button>
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

	obtenerVentas(){
		fetch('http://localhost:4300/api/ventas')
	      .then((response) => {
	        return response.json()
	      })
	      .then((ventas) => {
	        this.setState({ ventas: ventas.data })
	      })
	}

	obtenerClientes(callback){
		fetch('http://localhost:4300/api/clientesSeleccion')
	      .then((response) => {
	        return response.json()
	      })
	      .then((clientes) => {
	        this.setState({ clientes: clientes.data });
	        callback();
	      });
	}

	obtenerProductos(callback){
		fetch('http://localhost:4300/api/productosSeleccion')
	      .then((response) => {
	        return response.json()
	      })
	      .then((productos) => {
	        this.setState({ productos: productos.data });
	        callback();
	      });
	}

	obtenerVentaDetalle(idVenta){
		fetch('http://localhost:4300/api/ventasDetalle/'+idVenta)
	      .then((response) => {
	        return response.json()
	      })
	      .then((ventaDetalle) => {
	        this.setState({ ventaDetalle: ventaDetalle.data });
	        console.log(this.state.ventaDetalle);
	      });
	}

	formulario = () => (
	<div>
		<div className="modal-body">		        
			<form>
					      	
				<div className="form-group row">
					<input type="hidden" id="id_venta"/>
				    <label htmlFor="nombre" className="col-sm-2 col-form-label">Cliente</label>
				    <div className="col-sm-10">
					    <Select
					    id="id_cliente"
				        name="id_cliente"
				        value={this.state.selectedOptionCliente}
				        placeholder="Seleccione cliente..."
				        noResultsText="No hay resultados"
				        onChange={this.handleChangeCliente}
				        options={this.state.clientes}/>

				   		<small id="clienteMensaje" className="form-text text-danger"></small>
				    </div>
				    <label htmlFor="fecha" className="col-sm-2 col-form-label">Fecha</label>
				    <div className="col-sm-10">
				      	<input type="text" id="fecha" aria-describedby="fecha" placeholder="Fecha" maxLength="10" size="40" readOnly/>
				   		<small id="fechaMensaje" className="form-text text-danger"></small>
				    </div>
				    <label htmlFor="nombre" className="col-sm-2 col-form-label">Total General</label>
				    <div className="col-sm-10">
				      	<input type="text" id="total_general" aria-describedby="Total General" placeholder="Total General" maxLength="15" size="40" readOnly/>
				   		<small id="totalGeneralMensaje" className="form-text text-danger"></small>
				    </div>
				</div>

			</form>

			<form className="form-horizontal">
				<small id="detalleMensaje" className="form-text text-danger"></small>
			  	<div className="form-group">
			    	<label htmlFor="id_producto" className="sr-only">Producto</label>
			    	<Select
			    	id="id_producto"
		        	name="id_producto"
		        	value={this.state.selectedOptionProducto}
		        	placeholder="Seleccione producto..."
		        	noResultsText="No hay resultados"
		        	onChange={this.handleChangeProducto}
		        	options={this.state.productos}/>
			  	</div>
			</form>

			<form className="form-inline">
			  	<div className="form-group">
			  	  	<label htmlFor="cantidad" className="sr-only">Cantidad</label>
			  	  	<input type="text" className="form-control" id="cantidad" placeholder="Cantidad" size="10"/>
			  	</div>
			  	<div className="form-group">
			  	  	<label htmlFor="precio" className="sr-only">Precio</label>
			  	  	<input type="text" className="form-control" id="precio" placeholder="Precio" size="15" readOnly/>
			  	</div>
			  	<div className="form-group">
			  		<small className="form-text text-primary">&nbsp;Disponibilidad&nbsp;</small>
			  		<label htmlFor="existencia" className="sr-only">Existencia</label>
			  	  	<input type="text" className="form-control" id="existencia" placeholder="Existencia" size="10" readOnly/>
			  	</div>
			  	<button type="button" className="btn btn-primary mb-1" onClick={(e) => this.agregarDetalleVentaMemoria(e)} title="Agregar renglon" alt="Agregar renglon"><i className="fa fa-plus"></i></button>
			</form>

			<BootstrapTable
			  classes="table-sm"
			  keyField="renglon"
			  data={ this.state.ventaDetalle  }
			  columns={ this.columnsVentas }
			  striped
			  hover
			  condensed
			  pagination={ paginationFactory(this.options) }
			  filter={ filterFactory() }/>
			
		</div>
		<div className="modal-footer">
			<button type="button" className="btn btn-primary" onClick={this.guardarVenta.bind(this)}>Guardar</button>
			<button type="button" className="btn btn-secondary" data-dismiss="modal" id="cerrar">Cancelar</button>
		</div>	
	</div>
	);

	listaVentas = () => (
	<div>
		<div className="modal-body">		        
			<BootstrapTable
			  classes="table-sm"
			  keyField="id_venta"
			  data={ this.state.ventaDetalle  }
			  columns={ this.columnsVentas }
			  striped
			  hover
			  condensed
			  pagination={ paginationFactory(this.options) }
			  filter={ filterFactory() }/>
		</div>
		<div className="modal-footer">
			<button type="button" className="btn btn-secondary" data-dismiss="modal" id="cerrar">Cerrar</button>
		</div>	
	</div>
	);

	guardarVenta() {

		var idVenta = parseInt(document.getElementById('id_venta').value,10);
		var totalGeneral = document.getElementById('total_general').value;

		if(this.state.selectedOptionCliente.value>0){
			if(parseFloat(totalGeneral)>0){

				var data = {
					"id_cliente" : this.state.selectedOptionCliente.value,
					"total_general" : totalGeneral
				};

				//Se determina la ruta y el metodo dependiendo si se quiere agregar o modificar
				var ruta = 'http://localhost:4300/api/ventas' + ((idVenta!=null && Number.isInteger(idVenta))?('/'+idVenta):'');
				var metodo = ((idVenta!=null && Number.isInteger(idVenta))?"PUT":'POST');


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
					for(let detalle of this.state.ventaDetalle){
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

		    }else{
	    		document.getElementById('totalGeneralMensaje').innerHTML = "El total general debe ser mayor a 0.";
	    	}

	    }else{
	    	document.getElementById('clienteMensaje').innerHTML = "Debe seleccionar un cliente.";
	    }

	}

	cargarAgregarVenta = (row) => {
		this.setState({
	    	contenido: this.formulario.bind(this),
	    	ventaDetalle : []
	    },
		() => {
			this.obtenerClientes(()=>{

				this.obtenerProductos(()=>{
					var fecha = new Date();
					var dd = fecha.getDate();
					var mm = fecha.getMonth()+1; //January is 0!
					var yyyy = fecha.getFullYear();
	
					if(dd<10) {
					    dd = '0'+dd
					} 
	
					if(mm<10) {
					    mm = '0'+mm
					} 
	
					fecha = dd + '/' + mm + '/' + yyyy;
	
					document.getElementById('titulo_modal').innerHTML = "Agregar Venta";
					this.setState({ 
						selectedOptionCliente : "", 
						selectedOptionProducto : "" 
					});
			    	document.getElementById('id_venta').value = "";
					document.getElementById('fecha').value = fecha;
					document.getElementById('total_general').value = 0;
					document.getElementById('detalleMensaje').innerHTML =  "";

					document.getElementById('cantidad').value = "";
					document.getElementById('precio').value = "";
					document.getElementById('existencia').value = "";
				});
				
			});
		});
	}

	cargarModificarVenta = (row) => {
		this.setState({
	    	contenido: this.formulario.bind(this)
	    },
		() => {
			document.getElementById('titulo_modal').innerHTML = "Modificar Venta";
		    document.getElementById('id_venta').value = row.id_venta;
			document.getElementById('id_cliente').value = row.id_cliente;
			document.getElementById('fecha').value = row.fecha;
			document.getElementById('total_general').value = row.total_general;
		});
	}

	cargarDetallesVenta = (row) => {
		this.setState({
	    	contenido: this.listaVentas.bind(this)
	    },
	    () => {
			document.getElementById('titulo_modal').innerHTML = "<b>Venta:</b> "+row.id_venta +" </br> <b>Cliente:</b> "+row.nombre +" </br> <b>Fecha:</b> "+row.fecha +" </br> <b>Total General:</b> "+row.total_general;
			this.obtenerVentaDetalle(row.id_venta);
		});
	}

	agregarDetalleVentaMemoria(){

		var cantidad = parseInt(document.getElementById('cantidad').value,10);
		var precio = parseFloat(document.getElementById('precio').value);
		var existencia = parseInt(document.getElementById('existencia').value,10);
		document.getElementById('detalleMensaje').innerHTML =  "";

		if(this.state.selectedOptionProducto.value>0 && cantidad>0 && precio>0){

			var duplicado = false;

			for(let detalle of this.state.ventaDetalle){
				if(this.state.selectedOptionProducto.value === detalle.id_producto){
					duplicado = true;
			 	}
			}

			if(!duplicado){

				if(cantidad<=existencia){
					var total = cantidad * precio;
					var total_general = parseFloat(document.getElementById('total_general').value);

					document.getElementById('total_general').value =  total_general + total;

					this.setState({
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
						selectedOptionProducto : "" 
					});

					document.getElementById('cantidad').value = "";
					document.getElementById('precio').value = "";
					document.getElementById('existencia').value = "";
				}else{
					document.getElementById('detalleMensaje').innerHTML = "Debe agregar una cantidad menor o igual a la disponible.";
				}
			}else{
				document.getElementById('detalleMensaje').innerHTML = "El producto ya se encuentra agregado.";
			}
		}else{
			document.getElementById('detalleMensaje').innerHTML = "Debe ingresar un Producto, Cantidad y Precio.";
		}
	}

	render() {
		//const { selectedOptionCliente } = this.state;
		//const { selectedOptionProducto } = this.state;

		return (
			<div className="App">
				<header className="App-header">

				</header>
				<div className="App-intro">

					<main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

						<div className="border-bottom">
							<h1>Ventas</h1>
						</div>

						<br/>

						<button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#ventanaModal" onClick={(e) => this.cargarAgregarVenta(e)}><i className="fa fa-plus"></i>&nbsp;Agregar Venta</button>

						<br/><br/>

						<BootstrapTable
						  classes="table-sm"
						  keyField="id_venta"
						  data={ this.state.ventas  }
						  columns={ this.columns }
						  striped
						  hover
						  condensed
						  pagination={ paginationFactory(this.options) }
						  filter={ filterFactory() }/>

					</main>

					<Modal contenido={this.state.contenido}/>


				</div>
			</div>
		);
	}
}

export default Ventas;