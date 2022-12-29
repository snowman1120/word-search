
import Modal from 'react-bootstrap/Modal';

const CongrateModal = ( props ) => {
    return (
        <Modal
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <div className='success-modal'>
                <div className="success-modal-mark">
                    <img src='/assets/img/success-green-check-mark-icon.png' alt='' />
                </div>
                <h1 className='success-modal-message'>congratulations!</h1>
                <h4 className='success-modal-note'>
                    {props.trackTime}
                </h4>
            </div>
          </Modal.Body>
        </Modal>
      );
}

export default CongrateModal;