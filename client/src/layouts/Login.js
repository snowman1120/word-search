import {useStateContext} from 'contexts/ContextProvider';
import { useState } from 'react';
import { Nav, NavDropdown, Spinner, Button } from 'react-bootstrap';

import Web3 from 'web3';

import { getUser, register, authenticate, logout } from 'actions/user';
import { detectCurrentProvider } from 'utils/helper';

const Login = (props) => {
    const { isConnected, isLoggedin, setMessage, setIsLoggedin } = useStateContext();
    const [ isLoading, setIsLoading ] = useState(false);
    const onConnect = props.onConnect;
    const onLoggedIn = props.onLoggedIn;

    const onError = ( message ) => {
        setMessage(message);
        setIsLoading(false);
    }

    const handleLogin = () => {
        const userData = JSON.parse(window.localStorage.getItem('userAccount'));
        if(!userData) {
            setMessage('Please activate MetaMask first.');
            return;
        }
        setIsLoading(true);
        const account = userData.account;
        getUser(account, onError, handleRegister);
    }

    const handleRegister = ( user ) => {
        if(!user) {
            const userData = JSON.parse(window.localStorage.getItem('userAccount'));
            if(!userData) {
                setMessage('Please activate MetaMask first.');
                setIsLoading(false);
                return;
            }
            register( userData.account, onError, handleSignMessage );
        }
        else handleSignMessage( user );
    }

    const handleSignMessage = async ( { account, nonce } ) => {
        const currentProvider = detectCurrentProvider();
        if (currentProvider) {
            try {
                const web3 = new Web3(currentProvider);
                const signature = await web3?.eth.personal.sign(
                  `I am signing my one-time nonce: ${nonce}`, account, '' // MetaMask will ignore the password argument here
                );
                handleAuthenticate( { account, signature } );
            } catch (err) {
                setIsLoading(false);
            }
        } else {
            setMessage('There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.');
            setIsLoading(false);
        }
    }

    const handleAuthenticate = ( { account, signature } ) => {
        authenticate( { account, signature }, onError, handleLoggedIn );
    }

    const handleLoggedIn = (token) => {
        setIsLoading(false);
        onLoggedIn(token);
    }

    const handleLogout = () => {
        setIsLoggedin(false);
        logout();
    }

    return (
        <>
            {
                isConnected ? (
                    <>
                    <img src="/assets/img/metamask.svg" alt="" className='metamask-logo me-2' />
                    {/* <span style={{lineHeight: '36px', marginLeft: '10px'}}>Connected</span> */}

                    {
                        isLoggedin ? (
                        <>
                            <NavDropdown title="Logged in" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#" onClick={handleLogout}>Log out</NavDropdown.Item>
                            </NavDropdown>
                        </>
                        ) : 
                        (
                            isLoading ? (
                            <Button variant="primary" disabled>
                                <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                />
                                <span className='ms-2'>Loading...</span>
                            </Button>) : 
                                // <Nav.Link href="#" onClick={handleLogin}>Login</Nav.Link>
                                (<Button variant="primary" className='ps-4 pe-4' onClick={handleLogin}>
                                    Log in
                                </Button>)
                        )
                    }
                    </>
                ) : <Nav.Link href="#" onClick={onConnect}>Connect to metamask</Nav.Link>
            }
        </>
    );
}

export default Login;