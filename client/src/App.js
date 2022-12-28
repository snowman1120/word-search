import {  useEffect } from 'react';
import {BrowserRouter} from 'react-router-dom';

// Routes
import CRoutes from './CRoutes';

// Layout
import CNavbar from 'layouts/CNavbar';

// react-bootstrap components
import Container from 'react-bootstrap/Container';

import { loadUser } from 'actions/user';
import setAuthToken from 'utils/setAuthToken';
import {useStateContext} from 'contexts/ContextProvider';

import Web3 from 'web3';
import { detectCurrentProvider } from 'utils/helper';

import { logout } from 'actions/user';

// bootstrap.css
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const { setMessage, setIsLoggedin } = useStateContext();
    const handleLoadUser = async ( user ) => {
        if(user && user.account) {
            try {
                const currentProvider = detectCurrentProvider();
                if (currentProvider) {
                  if (currentProvider !== window.ethereum) {
                    setMessage(
                      'Non-Ethereum browser detected. You should consider trying MetaMask!'
                    );
                  }
                  const web3 = new Web3(currentProvider);
                  const userAccount = await web3.eth.getAccounts();
                  if (userAccount.length === 0) {
                    setMessage('Please connect to meta mask');
                  }
                  const account = userAccount[0];
                  if(account !== user.account) {
                    logout();
                  } else {
                    setIsLoggedin(true);
                  }
                }
            } catch (err) {
                setMessage(
                  'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
                );
            }
        }
    }

    useEffect(() => {
        if (localStorage.metaAccount) {
            // if there is a token set axios headers for all requests
            setAuthToken(localStorage.metaAccount);
        }
        loadUser( handleLoadUser );
    }, []);

    return (
        <div className='App'>
            <BrowserRouter>
                <CNavbar />
                <Container>
                    <CRoutes />
                </Container>
            </BrowserRouter>
        </div>
    )
}

export default App;