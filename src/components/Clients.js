import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import Modal from './Modal';

class Clients extends Component {

    constructor(props) {
        super(props)

        this.state = {
            clients: [],
            salesClient: [],
            content: () => {
            },
            modalTitle: '',
            clientId: '',
            name: '',
            nameMsg: ''
        }

        this.getClients = this.getClients.bind(this);
        this.getClientSales = this.getClientSales.bind(this);
        this.form = this.form.bind(this);
        this.salesList = this.salesList.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.loadCreate = this.loadCreate.bind(this);
        this.loadUpdate = this.loadUpdate.bind(this);
        this.loadSales = this.loadSales.bind(this);
    }

    componentWillMount() {
        this.getClients();
    }

    columns = [{
        dataField: 'client_id',
        text: 'ID Cliente',
        filter: textFilter({
            placeholder: 'Buscar por ID...',
        })
    }, {
        dataField: 'name',
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
                    <button type='button' className='btn btn-secondary btn-sm' alt='Modificar' title='Modificar' data-toggle='modal' data-target='#modalWindow' onClick={(e) => this.loadUpdate(row, e)}><i className='fa fa-edit'></i></button>&nbsp;
                    <button type='button' className='btn btn-secondary btn-sm' alt='Eliminar' title='Eliminar' onClick={(e) => this.delete(row, e)}><i className='fa fa-trash' ></i></button>&nbsp;
                    <button type='button' className='btn btn-secondary btn-sm' alt='Ver Ventas al Cliente' title='Ver Ventas al Cliente' data-toggle='modal' data-target='#modalWindow' onClick={(e) => this.loadSales(row, e)}><i className='fa fa-list-alt'></i></button>&nbsp;
                </div>
            );
        }
    }
    ];

    columnsSales = [{
        dataField: 'sale_id',
        text: 'ID Venta'
    }, {
        dataField: 'date',
        text: 'Fecha'
    }, {
        dataField: 'total',
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

    getClients = () => {
        fetch('http://localhost:4300/api/clients')
            .then((response) => {
                return response.json()
            })
            .then((clients) => {
                this.setState({ clients: clients.data })
            })
    }

    getClientSales = clientId => {
        fetch(`http://localhost:4300/api/salesClient/${clientId}`)
            .then((response) => {
                return response.json()
            })
            .then((salesClient) => {
                this.setState({ salesClient: salesClient.data });
                console.log(this.state.salesClient);
            })
    }

    form = () => (
        <div>
            <div className='modal-body'>
                <form>
                    <div className='form-group row'>
                        <input type='hidden' value={this.state.clientId} />
                        <label htmlFor='name' className='col-sm-2 col-form-label'>Nombre</label>
                        <div className='col-sm-10'>
                            <input type='text' value={this.state.name || ''} aria-describedby='Nombre Cliente' placeholder='Nombre Cliente' maxLength='200' size='40' onChange={e => this.setState({ name: e.target.value })} />
                            <small className='form-text text-danger'>{this.state.nameMsg}</small>
                        </div>
                    </div>
                </form>
            </div>
            <div className='modal-footer'>
                <button type='button' className='btn btn-primary' onClick={this.save}>Guardar</button>
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
                    data={this.state.salesClient}
                    columns={this.columnsSales}
                    striped
                    hover
                    condensed
                    pagination={paginationFactory(this.options)}
                    filter={filterFactory()} />
            </div>
            <div className='modal-footer'>
                <button type='button' className='btn btn-secondary' data-dismiss='modal' id='close'>Cerrar</button>
            </div>
        </div>
    );

    save = () => {
        const clientId = parseInt(this.state.clientId, 20);
        const name = this.state.name;

        this.setState({ nameMsg: '' });

        if (name.length > 0) {

            const data = {
                'name': name
            };

            //Se determina la ruta y el metodo dependiendo si se quiere agregar o modificar
            const url = `http://localhost:4300/api/clients${((clientId != null && Number.isInteger(clientId)) ? ('/' + clientId) : '')}`;
            const method = ((clientId != null && Number.isInteger(clientId)) ? 'PUT' : 'POST');

            fetch(url, {
                method,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                document.getElementById('close').click();
                this.getClients();
                return res;
            }).catch(err => err);

        } else {
            this.setState({ nameMsg: 'Debe escribir un nombre.' });
        }
    }

    delete = row => {
        if (window.confirm('Confirma que desea eliminar al cliente ' + row.name + '?')) {
            fetch(`http://localhost:4300/api/clients/${row.client_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                this.getClients();
                return res;
            }).catch(err => err);
        }
    }

    loadCreate = () => {
        this.setState({
            content: this.form
        },
        () => {
            this.setState({
                modalTitle: 'Agregar Cliente',
                clientId: '',
                name: '',
                nameMsg: ''
            });
        });
    }

    loadUpdate = row => {
        this.setState({
            content: this.form
        },
            () => {
                this.setState({
                    modalTitle: 'Modificar Cliente',
                    clientId: row.client_id,
                    name: row.name,
                    nameMsg: ''
                });
            });
    }

    loadSales = (row) => {
        this.setState({
            content: this.salesList
        },
        () => {
            this.setState({ modalTitle: `Ventas al Cliente ${row.name}` });
            this.getClientSales(row.client_id);
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

                        <button type='button' className='btn btn-secondary' data-toggle='modal' data-target='#modalWindow' onClick={(e) => this.loadCreate(e)}><i className='fa fa-plus'></i>&nbsp;Agregar Cliente</button>

                        <br /><br />

                        <BootstrapTable
                            classes='table-sm'
                            keyField='client_id'
                            data={this.state.clients}
                            columns={this.columns}
                            striped
                            hover
                            condensed
                            pagination={paginationFactory(this.options)}
                            filter={filterFactory()}
                        />

                    </main>

                    <Modal content={this.state.content} modalTitle={this.state.modalTitle} />
                </div>
            </div>
        );
    }
}

export default Clients;
