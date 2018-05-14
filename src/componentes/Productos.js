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
			readonly : false
		}
	    this.formulario = this.formulario.bind(this);
	    this.cargarAgregarProducto = this.cargarAgregarProducto.bind(this);
	    this.cargarModificarProducto = this.cargarModificarProducto.bind(this);
	    this.listaEntradas = this.listaEntradas.bind(this);
	    this.actualizarInventario = this.actualizarInventario.bind(this);
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
	    		<button type="button" className="btn btn-secondary btn-sm" alt="Modificar" title="Modificar" data-toggle="modal" data-target="#ventanaModal" onClick={(e) => this.cargarModificarProducto(row, e)}><i className="fa fa-edit"></i></button>&nbsp;
				<button type="button" className="btn btn-secondary btn-sm" alt="Eliminar" title="Eliminar" onClick={(e) => this.eliminarProducto(row, e)}><i className="fa fa-trash" ></i></button>&nbsp;
				<button type="button" className="btn btn-secondary btn-sm" alt="Ver Entradas a Inventario" title="Ver Entradas a Inventario" data-toggle="modal" data-target="#ventanaModal" onClick={(e) => this.cargarEntradasProducto(row, e)}><i className="fa fa-list-alt"></i></button>
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

	obtenerProductos(){
		fetch('http://localhost:4300/api/productos')
	      .then((response) => {
	        return response.json()
	      })
	      .then((productos) => {
	        this.setState({ productos: productos.data })
	      })
	}

	obtenerEntradas(idProducto){
		fetch('http://localhost:4300/api/entradasProducto/'+idProducto)
	      .then((response) => {
	        return response.json()
	      })
	      .then((entradas) => {
	        this.setState({ entradas: entradas.data });
	        console.log(this.state.entradas);
	      });
	}

	actualizarInventario(idProducto,cantidad){

		if(cantidad>0){
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
				fetch('http://localhost:4300/api/productosExistencia/'+idProducto, {
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
		<div className="modal-body">		        
			<form>
					      	
				<div className="form-group row">
					<input type="hidden" id="id_producto"/>
				    <label htmlFor="descripcion" className="col-sm-2 col-form-label">Descripción</label>
				    <div className="col-sm-10">
				      	<input type="text" id="descripcion" aria-describedby="Descripción" placeholder="Descripción" maxLength="300" size="40"/>
				   		<small id="descripcionMensaje" className="form-text text-danger"></small>
				    </div>
				    <label htmlFor="precio" className="col-sm-2 col-form-label">Precio</label>
				    <div className="col-sm-10">
				      	<input type="text" id="precio" aria-describedby="Precio" placeholder="Precio" maxLength="15" size="40"/>
				   		<small id="precioMensaje" className="form-text text-danger"></small>
				    </div>
				    <label htmlFor="existencia" className="col-sm-2 col-form-label">Existencia</label>
				    <div className="col-sm-10">
				      	<input type="text" id="existencia" aria-describedby="Existencia Inicial" placeholder="Existencia Inicial" maxLength="10" size="40" readOnly={this.state.readonly} />
				   		<small id="existenciaMensaje" className="form-text text-danger"></small>
				    </div>


				    <label htmlFor="agregar_existencia" className="col-sm-2 col-form-label">Entrada</label>
				    <div className="col-sm-10">
				      	<input type="text" id="agregar_existencia" aria-describedby="Agregar a existencia" placeholder="Agregar a existencia" maxLength="10" size="40" readOnly={!this.state.readonly} />
				    </div>
				  	

				</div>



			</form>
		</div>
		<div className="modal-footer">
			<button type="button" className="btn btn-primary" onClick={this.guardarProducto.bind(this)}>Guardar</button>
			<button type="button" className="btn btn-secondary" data-dismiss="modal" id="cerrar">Cancelar</button>
		</div>	
	</div>
	);

	guardarProducto() {

		var idProducto = parseInt(document.getElementById('id_producto').value,10);
		var descripcion = document.getElementById('descripcion').value;
		var precio = document.getElementById('precio').value;
		var existencia = parseInt(document.getElementById('existencia').value,10);
		var agregarExistencia = parseInt(document.getElementById('agregar_existencia').value,10);

		document.getElementById('existenciaMensaje').innerHTML = "";
		document.getElementById('precioMensaje').innerHTML = "";
		document.getElementById('descripcionMensaje').innerHTML = "";

		if(descripcion.length>0){
			if(parseFloat(precio)>0){
				if(parseInt(existencia,10)>0 || (idProducto!=null && Number.isInteger(idProducto))){

					var data = {
						"descripcion" : descripcion,
						"precio" : precio
					};

					//Se determina la ruta y el metodo dependiendo si se quiere agregar o modificar
					var ruta = 'http://localhost:4300/api/productos' + ((idProducto!=null && Number.isInteger(idProducto))?('/'+idProducto):'');
					var metodo = ((idProducto!=null && Number.isInteger(idProducto))?"PUT":'POST');
						

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
				    		if((idProducto!=null && Number.isInteger(idProducto)) && agregarExistencia>0){
				    			this.actualizarInventario(idProducto,agregarExistencia);
				    		}else{ //Si se quiere agregar la existencia inicial
				    			this.actualizarInventario(producto.id_producto,existencia);
				    		}

				    		document.getElementById('cerrar').click();
				    		this.obtenerProductos();
				      });

			    }else{
		    		document.getElementById('existenciaMensaje').innerHTML = "La existencia incial debe ser mayor a 0.";
		    	}
		    }else{
	    		document.getElementById('precioMensaje').innerHTML = "Debe escribir un precio.";
	    	}

	    }else{
	    	document.getElementById('descripcionMensaje').innerHTML = "Debe escribir una descripción.";
	    }

	}

	listaEntradas = () => (
	<div>
		<div className="modal-body">		        
			<BootstrapTable
			  classes="table-sm"
			  keyField="id_entrada"
			  data={ this.state.entradas  }
			  columns={ this.columnsEntradas }
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

	eliminarProducto (row){
		if(window.confirm('Confirma que desea eliminar al producto '+row.descripcion+'?')){


			

			fetch('http://localhost:4300/api/productos/'+row.id_producto, {
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

	cargarAgregarProducto = (row) => {
		this.setState({
			readonly: false,
	    	contenido: this.formulario.bind(this)
	    },
		() => {
			document.getElementById('titulo_modal').innerHTML = "Agregar Producto";
		    document.getElementById('id_producto').value = "";
			document.getElementById('descripcion').value = "";
			document.getElementById('precio').value = "";
			document.getElementById('existencia').value = "";

			document.getElementById('existenciaMensaje').innerHTML = "";
			document.getElementById('precioMensaje').innerHTML = "";
			document.getElementById('descripcionMensaje').innerHTML = "";
		});
	}

	cargarModificarProducto = (row) => {
		this.setState({
			readonly: true,
	    	contenido: this.formulario.bind(this)
	    },
		() => {
			document.getElementById('titulo_modal').innerHTML = "Modificar Producto";
			document.getElementById('id_producto').value = row.id_producto;
			document.getElementById('descripcion').value = row.descripcion;
			document.getElementById('precio').value = row.precio;
			document.getElementById('existencia').value = row.existencia;

			document.getElementById('existenciaMensaje').innerHTML = "";
			document.getElementById('precioMensaje').innerHTML = "";
			document.getElementById('descripcionMensaje').innerHTML = "";
		});
	}

	cargarEntradasProducto = (row) => {
		this.setState({
	    	contenido: this.listaEntradas.bind(this)
	    },
	    () => {
			document.getElementById('titulo_modal').innerHTML = "Entradas del Producto al Inventario";
			this.obtenerEntradas(row.id_producto);
		});
	}

	render() {


		return (
			<div className="App">
				<header className="App-header">

				</header>
				<div className="App-intro">

					<main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

						<div className="border-bottom">
							<h1>Productos</h1>
						</div>

						<br/>

						<button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#ventanaModal" onClick={(e) => this.cargarAgregarProducto(e)}><i className="fa fa-plus"></i>&nbsp;Agregar Producto</button>

						<br/><br/>

						<BootstrapTable
						  classes="table-sm"
						  keyField="id_producto"
						  data={ this.state.productos  }
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

export default Productos;
