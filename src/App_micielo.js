import React, { Component } from 'react';

import './App.css';



class App extends Component {

/*
    this.state={
      titulo:'Clientes',
      idCliente:'',
      nombre:'',
      datos:[
        {idCliente:'1',
         nombre:'Peter'},
         {idCliente:'2',
         nombre:'Tony'}
      ]
    };
*/

  constructor(props){
    super(props);
    this.state={
      titulo:'Clientes',
      idCliente:'',
      nombre:'',
      datos:[]
    };
    this.guardar = this.guardar.bind(this);
    //this.editar = this.editar.bind(this);
    this.obtener_Datos = this.obtener_Datos.bind(this);
    this.listar = this.listar.bind(this);

    
  }

  obtener_Datos(){
    console.log('obtener_Datos');
    /*this.setState({
      titulo:'proveedor',
      desc:'desc proveedor'
    });*/
  } 

  
  guardar(e){
    e.preventDefault(); // Evita que se recargue la pagina al presionar el boton

    let datas = this.state.datos; //crea el objeto datas a partir del objeto datos del estado

    //crea un objeto y le asigna las variables del formulario
    let data = {
      idCliente:this.refs.idCliente.value,
      nombre:this.refs.nombre.value
    }

    datas.push(data); //le añade al objeto datas los datos del formulario

    //modifica la variable de estado y reemplaza el objeto datos con el objeto datas
    this.setState({
      datos: datas
    });    

    this.refs.formCliente.reset(); // limpia los imput del formulario
    this.refs.idCliente.focus();
    //console.log(this.state.datos);
  }
  editar(){
      this.refs.idCliente.value=this.setState.datos.idCliente;
      
    }

  //crea un listado de los clientes
  listar(){    
    return(this.state.datos.map((dato, i) => { 
       return(<tr key={dato.idCliente}>
                <td>{dato.ideCliente}</td>
                <td>{dato.nombre}</td>
                <td><button >Editar</button></td>
                <td><button >Eliminar</button></td>
              </tr>) }));
  }


  render() {
    
    let data = this.listar();
    //let d = this.state.datos.map((dato, i) => { return(<li key={dato.idCliente}>{dato.nombre} </li>) })
    console.log('render'+this.state.datos);
    return (
      <div className="App">
        <p>{this.state.titulo}</p>
        <div>
          <form ref="formCliente" onSubmit={this.guardar} >      
            <input type="text" ref="idCliente"/>
            <input type="text" ref="nombre"/>
            <button >save</button>
          </form> 
        </div>
        
        <div>
          <table> 
            <tbody>
              {data}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
