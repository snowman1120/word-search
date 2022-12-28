import {useStateContext} from 'contexts/ContextProvider';
import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
const CAlert = () => {
    const { message } = useStateContext();
    const [show, setShow] = useState();

    useEffect(() => {
        if(message && message !== '') setShow(true);
        else setShow(false); 
    }, [message]);

    return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible show={show}>
            {/* <Alert.Heading>Oh snap!</Alert.Heading> */}
            <p className="mb-0"> { message } </p>
        </Alert>
    );
}

export default CAlert;