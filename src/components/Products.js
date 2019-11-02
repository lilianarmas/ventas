import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import Modal from './Modal';

class Products extends Component {

    constructor(props) {
        super(props)
        this.state = {
            products: [],
            content : () => {
            },
            entries: [],
            readonly : false,
            modalTitle: '',
            productId: '',
            description: '',
            price: '',
            quantity: '',
            quantityMsg: '',
            priceMsg: '',
            descriptionMsg: ''
        }

        this.getProducts = this.getProducts.bind(this);
        this.getEntries = this.getEntries.bind(this);
        this.updateInventory = this.updateInventory.bind(this);
        this.form = this.form.bind(this);
        this.save = this.save.bind(this);
        this.entriesList = this.entriesList.bind(this);
        this.delete = this.delete.bind(this);
        this.loadCreate = this.loadCreate.bind(this);
        this.loadUpdate = this.loadUpdate.bind(this);
        this.loadEntries = this.loadEntries.bind(this);
    }

    componentWillMount() {
        this.getProducts();
    }

    columns = [{
        dataField: 'product_id',
        text: 'ID Producto'
    }, {
        dataField: 'description',
        text: 'Descripción',
        filter: textFilter({
            placeholder: 'Buscar por Descripción...',
        })
    },
    {
        dataField: 'price',
        text: 'Precio'
    },
    {
        dataField: 'quantity',
        text: 'Existencia'
    },
    {
        dataField: '',
        text: 'Opciones',
        formatter: (cell, row) => {
            return (
                <div>
                    <button type='button' className='btn btn-secondary btn-sm' alt='Modificar' title='Modificar' data-toggle='modal' data-target='#modalWindow' onClick={(e) => this.loadUpdate(row, e)}><i className='fa fa-edit'></i></button>&nbsp;
                    <button type='button' className='btn btn-secondary btn-sm' alt='Eliminar' title='Eliminar' onClick={(e) => this.delete(row, e)}><i className='fa fa-trash' ></i></button>&nbsp;
                    <button type='button' className='btn btn-secondary btn-sm' alt='Ver Entradas a Inventario' title='Ver Entradas a Inventario' data-toggle='modal' data-target='#modalWindow' onClick={(e) => this.loadEntries(row, e)}><i className='fa fa-list-alt'></i></button>
                </div>
            );
        }
    }];

    columnsEntries = [{
        dataField: 'entry_id',
        text: 'ID Entrada'
    },{
        dataField: 'date',
        text: 'Fecha'
    },{
        dataField: 'quantity',
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

    getProducts = () => {
        fetch('http://localhost:4300/api/products')
            .then((response) => {
                return response.json()
            })
            .then((products) => {
                this.setState({ products: products.data })
            })
    }

    getEntries = (productId) => {
        fetch(`http://localhost:4300/api/productEntries/${productId}`)
            .then((response) => {
                return response.json()
            })
            .then((entries) => {
                this.setState({ entries: entries.data });
                console.log(this.state.entries);
            });
    }

    updateInventory = (productId,quantityAdd) => {

        if(quantityAdd > 0) {
            var quantity = {
                'quantity' : quantityAdd,
                'product_id': productId
            };

            //Se agrega la entrada al inventario
            fetch('http://localhost:4300/api/entries', {
                method: 'POST',
                body: JSON.stringify(quantity),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                //Se actualiza la existencia del producto
                fetch(`http://localhost:4300/api/productExistence/${productId}`, {
                    method: 'PUT',
                    body: JSON.stringify(quantity),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    this.getProducts();
                    return res;
                }).catch(err => err);

                return res;
            }).catch(err => err);
        }
    }

    form = () => (
        <div>
            <div className='modal-body'>
                <form>

                    <div className='form-group row'>
                        <input type='hidden' value={this.state.productId} />
                        <label className='col-sm-2 col-form-label'>Descripción</label>
                        <div className='col-sm-10'>
                            <input type='text' value={this.state.description || ''} aria-describedby='Descripción' placeholder='Descripción' maxLength='300' size='40' onChange={e => this.setState({ description: e.target.value })} />
                            <small className='form-text text-danger'>{this.state.descriptionMsg}</small>
                        </div>
                        <label className='col-sm-2 col-form-label'>Precio</label>
                        <div className='col-sm-10'>
                            <input type='text' value={this.state.price || ''} aria-describedby='Precio' placeholder='Precio' maxLength='15' size='40' onChange={e => this.setState({ price: e.target.value })} />
                            <small className='form-text text-danger'>{this.state.priceMsg}</small>
                        </div>
                        <label className='col-sm-2 col-form-label'>Existencia</label>
                        <div className='col-sm-10'>
                            <input type='text' value={this.state.quantity || ''} aria-describedby='Existencia Inicial' placeholder='Existencia Inicial' maxLength='10' size='40' readOnly={this.state.readonly} onChange={e => this.setState({ quantity: e.target.value })} />
                            <small className='form-text text-danger'>{this.state.quantityMsg}</small>
                        </div>

                        {this.state.productId &&
                            <div>
                                <label className='col-sm-2 col-form-label'>Entrada</label>
                                <div className='col-sm-10'>
                                    <input type='text' value={this.state.addExistence || ''} aria-describedby='Agregar a existencia' placeholder='Agregar a existencia' maxLength='10' size='40' readOnly={!this.state.readonly} onChange={e => this.setState({ addExistence: e.target.value })} />
                                </div>
                            </div>
                        }
                    </div>

                </form>
            </div>
            <div className='modal-footer'>
                <button type='button' className='btn btn-primary' onClick={this.save}>Guardar</button>
                <button type='button' className='btn btn-secondary' data-dismiss='modal' id='close'>Cancelar</button>
            </div>
        </div>
    );

    save = () => {
        var productId = parseInt(this.state.productId,10);
        var description = this.state.description;
        var price = this.state.price;
        var quantity = parseInt(this.state.quantity,10);
        var addExistence = parseInt(this.state.addExistence,10);

        this.setState({
            quantityMsg: '',
            priceMsg: '',
            descriptionMsg: ''
        }, _ => {
            if(description.length > 0) {
                if(parseFloat(price) > 0) {
                    if(parseInt(quantity,10) > 0 || (productId != null && Number.isInteger(productId))) {

                        var data = {
                            'description' : description,
                            'price' : price,
                            'quantity' : quantity
                        };

                        //Se determina la ruta y el metodo dependiendo si se quiere agregar o modificar
                        var url = `http://localhost:4300/api/products${((productId != null && Number.isInteger(productId))?('/'+productId):'')}`;
                        var method = ((productId != null && Number.isInteger(productId))?'PUT':'POST');

                        fetch(url, {
                            method,
                            body: JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((response) => {
                                return response.json()
                            })
                            .then((product) => {
                                //Si se quiere agregar mas productos a la existencia
                                if(Number.isInteger(addExistence) && addExistence > 0) {
                                    if(productId != null && Number.isInteger(productId)){
                                        this.updateInventory(productId,addExistence);
                                    } else { //Si se quiere agregar la existencia inicial
                                        this.updateInventory(product.product_id,quantity);
                                    }
                                }

                                document.getElementById('close').click();
                                this.getProducts();
                            });

                        } else {
                            this.setState({ quantityMsg: 'La existencia incial debe ser mayor a 0.' });
                        }
                    } else {
                        this.setState({ priceMsg: 'Debe escribir un precio.' });
                    }
                } else {
                    this.setState({ descriptionMsg: 'Debe escribir una descripción.' });
                }
        });
    }

    entriesList = () => (
        <div>
            <div className='modal-body'>
                <BootstrapTable
                    classes='table-sm'
                    keyField='entry_id'
                    data={ this.state.entries  }
                    columns={ this.columnsEntries }
                    striped
                    hover
                    condensed
                    pagination={ paginationFactory(this.options) }
                    filter={ filterFactory() }/>
            </div>
            <div className='modal-footer'>
                <button type='button' className='btn btn-secondary' data-dismiss='modal' id='close'>Cerrar</button>
            </div>
        </div>
    );

    delete (row){
        if(window.confirm(`Confirma que desea eliminar al producto ${row.description}?`)) {

            fetch(`http://localhost:4300/api/products/${row.product_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                this.getProducts();
                return res;
            }).catch(err => err);

        }
    }

    loadCreate = () => {
        this.setState({
            readonly: false,
            content: this.form.bind(this)
            },
        () => {
            this.setState({
                modalTitle: 'Agregar Producto',
                productId: '',
                description: '',
                price: '',
                quantity: '',
                quantityMsg: '',
                priceMsg: '',
                descriptionMsg: ''
            });
        });
    }

    loadUpdate = (row) => {
        this.setState({
            readonly: true,
                content: this.form.bind(this)
            },
        () => {
            this.setState({
                modalTitle: 'Modificar Producto',
                productId: row.product_id,
                description: row.description,
                price: row.price,
                quantity: row.quantity,
                quantityMsg: '',
                priceMsg: '',
                descriptionMsg: '',
                addExistence: ''
            });
        });
    }

    loadEntries = (row) => {
        this.setState({
                content: this.entriesList.bind(this)
            },
            () => {
            this.setState({ modalTitle: 'Entradas del Producto al Inventario' });
            this.getEntries(row.product_id);
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

                        <button type='button' className='btn btn-secondary' data-toggle='modal' data-target='#modalWindow' onClick={() => this.loadCreate()}><i className='fa fa-plus'></i>&nbsp;Agregar Producto</button>

                        <br/><br/>

                        <BootstrapTable
                            classes='table-sm'
                            keyField='product_id'
                            data={ this.state.products  }
                            columns={ this.columns }
                            striped
                            hover
                            condensed
                            pagination={ paginationFactory(this.options) }
                            filter={ filterFactory() }
                        />

                    </main>

                    <Modal content={this.state.content} modalTitle={this.state.modalTitle}/>

                </div>
            </div>
        );
    }
}

export default Products;
