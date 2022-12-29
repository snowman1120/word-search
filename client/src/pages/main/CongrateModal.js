
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
                    <img src='/assets/images/icons/success-green-check-mark-icon.png' alt='' />
                </div>
                <p className='success-modal-message'>congratulations!</p>
                <p className='success-modal-note'>
                    {props.trackTime}
                </p>
            </div>
          </Modal.Body>
        </Modal>
      );
}

export default CongrateModal;