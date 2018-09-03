import React, { Component } from 'react';

class Modal extends Component {

	render() {
		return (
			<div className='App'>
				<header className='App-header'>

				</header>
				<div className='App-intro'>

					<div className='modal' tabIndex='-1' role='dialog' id='ventanaModal'>
					  <div className='modal-dialog modal-lg' role='document'>
					    <div className='modal-content'>

					      <div className='modal-header'>
					        <h5 className='modal-title' id='titulo_modal'>{this.props.tituloModal}</h5>
					        <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
					          <span aria-hidden='true'>&times;</span>
					        </button>
					      </div>
					      
					      {this.props.contenido()}

					    </div>
					  </div>
					</div>


				</div>
			</div>
		);
	}
}

export default Modal;
