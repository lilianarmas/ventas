import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Select from 'react-select';

import Modal from './Modal';

class Sales extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sales: [],
            clients: [],
            products: [],
            saleDetail: [],
            sale_id: '',
            date: '',
            quantity: null,
            price: null,
            existence: null,
            content : () => {

            },
            selectedOptionClient: '',
            selectedOptionProduct: ''
        }
        this.handleChangeClient = this.handleChangeClient.bind(this);
        this.handleChangeProduct = this.handleChangeProduct.bind(this);
        this.getSales = this.getSales.bind(this);
        this.getCLients = this.getCLients.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.getSaleDetail = this.getSaleDetail.bind(this);
        this.form = this.form.bind(this);
        this.salesList = this.salesList.bind(this);
        this.save = this.save.bind(this);
        this.loadCreate = this.loadCreate.bind(this);
        this.loadUpdate = this.loadUpdate.bind(this);
        this.loadSaleDetail = this.loadSaleDetail.bind(this);
        this.addDetailInMemory = this.addDetailInMemory.bind(this);
    }

    componentWillMount() {
        this.getSales();
    }

    handleChangeClient = selectedOptionClient => {
        this.setState({
            selectedOptionClient,
            clientMsg: ''
        });
    }

    handleChangeProduct = selectedOptionProduct => {
        this.setState({ selectedOptionProduct });

        //Obtener existencia del producto
        fetch('http://localhost:4300/api/products/'+selectedOptionProduct.value)
            .then(response => {
                return response.json()
            })
            .then(product => {
                this.setState({
                    price: product.data.price,
                    existence: product.data.quantity
                });
            });
    }

    columns = [{
        dataField: 'sale_id',
        text: 'ID Venta',
        filter: textFilter({
            placeholder: 'Buscar por ID...',
        })
    },
    {
    dataField: 'name',
        text: 'Cliente',
        filter: textFilter({
            placeholder: 'Buscar por Nombre...',
        })
    },
    {
        dataField: 'date',
        text: 'Fecha'
    },
    {
        dataField: 'grand_total',
        text: 'Total General'
    },
    {
    dataField: '',
        text: 'Opciones',
        formatter: (cell, row) => {
            return (
                <div>
                    <button type='button' className='btn btn-secondary btn-sm' alt='Ver Detalles de Venta' title='Ver Detalles de Venta' data-toggle='modal' data-target='#modalWindow' onClick={(e) => this.loadSaleDetail(row, e)}><i className='fa fa-list-alt'></i></button>
                </div>
            );
        }
    }];

    columnsSales = [{
        dataField: 'item',
        text: 'Renglon'
    },{
        dataField: 'product_id',
        text: 'ID Producto'
    },{
        dataField: 'description',
        text: 'Descripción Producto'
    },{
        dataField: 'quantity',
        text: 'Cantidad'
    },{
        dataField: 'price',
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

    getSales() {
        fetch('http://localhost:4300/api/sales')
            .then((response) => {
                return response.json()
            })
            .then((sales) => {
                this.setState({ sales: sales.data })
            })
    }

    getCLients(callback) {
        fetch('http://localhost:4300/api/clientsList')
            .then((response) => {
                return response.json()
            })
            .then((clients) => {
                this.setState({ clients: clients.data });
                callback();
            });
    }

    getProducts(callback) {
        fetch('http://localhost:4300/api/productsList')
            .then((response) => {
                return response.json()
            })
            .then((products) => {
                this.setState({ products: products.data });
                callback();
            });
    }

    getSaleDetail(saleId) {
        fetch('http://localhost:4300/api/salesDetail/'+saleId)
            .then((response) => {
                return response.json()
            })
            .then((saleDetail) => {
                this.setState({ saleDetail: saleDetail.data });
            });
    }

    form = () => (
    <div>
        <div className='modal-body'>
            <form>

                <div className='form-group row'>
                    <input type='hidden' value={this.state.sale_id}/>
                    <label htmlFor='name' className='col-sm-2 col-form-label'>Cliente</label>
                    <div className='col-sm-10'>
                        <Select
                            id='client_id'
                            name='client_id'
                            value={this.state.selectedOptionClient}
                            placeholder='Seleccione cliente...'
                            noResultsText='No hay resultados'
                            onChange={this.handleChangeClient}
                            options={this.state.clients}
                        />

                        <small className='form-text text-danger'>{this.state.clientMsg || ''}</small>
                    </div>
                    <label htmlFor='date' className='col-sm-2 col-form-label'>Fecha</label>
                    <div className='col-sm-10'>
                        <input type='text' value={this.state.date || ''} aria-describedby='date' placeholder='Fecha' maxLength='10' size='40' readOnly/>
                        <small id='dateMsg' className='form-text text-danger'></small>
                    </div>
                    <label htmlFor='name' className='col-sm-2 col-form-label'>Total General</label>
                    <div className='col-sm-10'>
                        <input type='text' value={this.state.grand_total || ''} aria-describedby='Total General' placeholder='Total General' maxLength='15' size='40' readOnly/>
                        <small className='form-text text-danger'>{this.state.grandTotalMsg || ''}</small>
                    </div>
                </div>

            </form>

            <form className='form-horizontal'>
                <small id='detMsg' className='form-text text-danger'></small>
                <div className='form-group'>
                    <label htmlFor='product_id' className='sr-only'>Producto</label>
                    <Select
                        id='product_id'
                        name='product_id'
                        value={this.state.selectedOptionProduct}
                        placeholder='Seleccione producto...'
                        noResultsText='No hay resultados'
                        onChange={this.handleChangeProduct}
                        options={this.state.products}
                    />
                </div>
            </form>

            <form className='form-inline'>
                <div className='form-group'>
                    <label htmlFor='quantity' className='sr-only'>Cantidad</label>
                    <input type='text' className='form-control' value={this.state.quantity || ''} placeholder='Cantidad' size='10' onChange={e => this.setState({ quantity: e.target.value })} />
                </div>
                <div className='form-group'>
                    <label htmlFor='price' className='sr-only'>Precio</label>
                    <input type='text' className='form-control' value={this.state.price || ''} placeholder='Precio' size='15' readOnly/>
                </div>
                <div className='form-group'>
                    <small className='form-text text-primary'>&nbsp;Disponibilidad&nbsp;</small>
                    <label htmlFor='existence' className='sr-only'>Existencia</label>
                    <input type='text' className='form-control' value={this.state.existence || ''} placeholder='Existencia' size='10' readOnly/>
                </div>
                <button type='button' className='btn btn-primary mb-1' onClick={(e) => this.addDetailInMemory(e)} title='Agregar item' alt='Agregar item'><i className='fa fa-plus'></i></button>
            </form>

            <BootstrapTable
                classes='table-sm'
                keyField='item'
                data={ this.state.saleDetail  }
                columns={ this.columnsSales }
                striped
                hover
                condensed
                pagination={ paginationFactory(this.options) }
                filter={ filterFactory() }
            />

        </div>
        <div className='modal-footer'>
            <button type='button' className='btn btn-primary' onClick={this.save.bind(this)}>Guardar</button>
            <button type='button' className='btn btn-secondary' data-dismiss='modal' id='close'>Cancelar</button>
        </div>
    </div>
    );

    salesList = () => (
    <div>
        <div className='modal-body'>
            <BootstrapTable
                classes='table-sm'
                keyField='sale_id'
                data={ this.state.saleDetail  }
                columns={ this.columnsSales }
                striped
                hover
                condensed
                pagination={ paginationFactory(this.options) }
                filter={ filterFactory() }
            />
        </div>
        <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' data-dismiss='modal' id='close'>Cerrar</button>
        </div>
    </div>
    );

    save() {

        var saleId = parseInt(this.state.sale_id,10);
        var grandTotal = this.state.grand_total;

        if(this.state.selectedOptionClient.value > 0) {
            if(parseFloat(grandTotal) > 0) {

                var data = {
                    'client_id' : this.state.selectedOptionClient.value,
                    'total' : grandTotal
                };

                //Se determina la ruta y el metodo dependiendo si se quiere agregar o modificar
                var url = 'http://localhost:4300/api/sales' + ((saleId!=null && Number.isInteger(saleId))?('/'+saleId):'');
                var method = ((saleId != null && Number.isInteger(saleId)) ? 'PUT' : 'POST');

                //Se almacena el encabezado de la venta
                fetch(url, {
                    method,
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        return response.json()
                    })
                    .then(sale => {

                        //Se recorre el detalle de la venta para almacenarlo
                        for(let detail of this.state.saleDetail) {
                            detail.sale_id = sale.sale_id; //ID de la venta generado en la BD
                                fetch('http://localhost:4300/api/salesDetail', {
                                    method: 'POST',
                                    body: JSON.stringify(detail),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                            }).then(res => {

                                var existence = {
                                    'quantity' : -detail.quantity,
                                    'product_id': detail.product_id
                                };

                                //Se actualiza la existencia del producto
                                fetch('http://localhost:4300/api/productExistence/'+detail.product_id, {
                                    method: 'PUT',
                                    body: JSON.stringify(existence),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then(res => {
                                    return res;
                                }).catch(err => err);

                                return res;
                            }).catch(err => err);
                        }

                    document.getElementById('close').click();
                    this.getSales();
                });

            } else {
                this.setState({ grandTotalMsg: 'El total general debe ser mayor a 0.'});
            }

        } else {
            this.setState({ clientMsg: 'Debe seleccionar un cliente.'});
        }
    }

    loadCreate = (row) => {
        this.setState({
            content: this.form.bind(this),
            saleDetail : []
        },
        () => {
            this.getCLients(()=> {

                this.getProducts(()=> {
                    var date = new Date();
                    var dd = date.getDate();
                    var mm = date.getMonth() + 1; //January is 0!
                    var yyyy = date.getFullYear();

                    if(dd < 10) {
                        dd = '0'+dd
                    }

                    if(mm < 10) {
                        mm = '0'+mm
                    }

                    date = dd + '/' + mm + '/' + yyyy;

                    this.setState({
                        modalTitle: 'Agregar Venta',
                        selectedOptionClient : '',
                        selectedOptionProduct : '',
                        date,
                        sale_id: '',
                        grand_total: 0,
                        quantity: '',
                        price: '',
                        existence: '',
                        grandTotalMsg: '',
                        clientMsg: ''
                    });

                });

            });
        });
    }

    loadUpdate = (row) => {
        this.setState({
            content: this.form.bind(this)
            },
        () => {
            this.setState({
                modalTitle: 'Modificar Venta',
                sale_id: row.sale_id,
                date: row.date,
                client_id: row.client_id,
                total: row.grand_total
            });
        });
    }

    loadSaleDetail = (row) => {
        this.setState({
            content: this.salesList.bind(this)
        },
        () => {
            this.setState({
                modalTitle : `Venta: ${row.sale_id} | Cliente: ${row.name} | Fecha: ${row.date} | Total General: ${row.grand_total}`
            });
            this.getSaleDetail(row.sale_id);
        });
    }

    addDetailInMemory() {
        var quantity = parseInt(this.state.quantity,10);
        var price = parseFloat(this.state.price);
        var existence = parseInt(this.state.existence,10);

        this.setState({
            detMsg: '',
            grandTotalMsg: ''
        });

        if(this.state.selectedOptionProduct.value > 0 && quantity > 0 && price > 0) {

            var duply = false;

            for(let detail of this.state.saleDetail) {
                if(this.state.selectedOptionProduct.value === detail.product_id) {
                    duply = true;
                }
            }

            if(!duply) {

                if(quantity <= existence) {
                    var total = quantity * price;
                    var grand_total = parseFloat(this.state.grand_total);

                    this.setState({
                        grand_total: grand_total + total,
                        saleDetail: [...this.state.saleDetail, {
                            'item':this.state.saleDetail.length+1,
                            'product_id': this.state.selectedOptionProduct.value,
                            'description': this.state.selectedOptionProduct.label,
                            'quantity': quantity,
                            'price': price,
                            'total' : total
                        }]
                    });

                    this.setState({
                        selectedOptionProduct : '',
                        quantity: '',
                        price: '',
                        existence: ''
                    });

                } else {
                    this.setState({
                        detMsg: 'Debe agregar una quantity menor o igual a la disponible.'
                    });
                }
            } else {
                this.setState({
                    detMsg: 'El producto ya se encuentra agregado.'
                });
            }
        } else {
            this.setState({
                detMsg: 'Debe ingresar un Producto, Cantidad y Precio.'
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

                        <button type='button' className='btn btn-secondary' data-toggle='modal' data-target='#modalWindow' onClick={(e) => this.loadCreate(e)}><i className='fa fa-plus'></i>&nbsp;Agregar Venta</button>

                        <br/><br/>

                        <BootstrapTable
                            classes='table-sm'
                            keyField='sale_id'
                            data={ this.state.sales  }
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

export default Sales;
