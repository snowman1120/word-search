import {useEffect} from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import {useStateContext} from 'contexts/ContextProvider';

import Web3 from 'web3';

import Login from './Login';
import { detectCurrentProvider } from 'utils/helper';

import setAuthToken from 'utils/setAuthToken';
import { logout } from 'actions/user';

const CNavbar = () => {
    const { setIsConnected, setIsLoggedin } = useStateContext();

    useEffect(() => {
      checkConnection();
      window.ethereum.on('accountsChanged', (accounts) => {
        handleAccountsChanged(accounts);
      });
    }, []);

    function handleAccountsChanged(accounts) {
      // Do something
      if(accounts.length > 0) {
        const userData = JSON.parse(localStorage.getItem('userAccount'));
        if (userData != null) {
          setIsConnected(true);
        } else {
          handleConnect();
        }
      } else {
        localStorage.removeItem('userAccount');
        setIsConnected(false);
        setIsLoggedin(false);
        logout();
      }
    }

    function checkConnection() {
      const currentProvider = detectCurrentProvider();
      currentProvider.request({ method: 'eth_accounts' }).then(handleAccountsChanged).catch(console.error);
    }
    

    const handleConnect = async () => {
        try {
          const currentProvider = detectCurrentProvider();
          if (currentProvider) {
            if (currentProvider !== window.ethereum) {
              console.log(
                'Non-Ethereum browser detected. You should consider trying MetaMask!'
              );
            }
            await currentProvider.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(currentProvider);
            const userAccount = await web3.eth.getAccounts();
            const chainId = await web3.eth.getChainId();
            const account = userAccount[0];
            let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
            ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
            saveUserInfo(ethBalance, account, chainId);
            if (userAccount.length === 0) {
              console.log('Please connect to meta mask');
            }
          }
        } catch (err) {
          console.log(
            'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
          );
        }
    };

    const saveUserInfo = (ethBalance, account, chainId) => {
        const userAccount = {
          account: account,
          balance: ethBalance,
          connectionid: chainId,
        };
        window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
        setIsConnected(true);
    };

    const handleLoggedIn = (token) => {
      if(token) {
        setAuthToken(token);
        setIsLoggedin(true);
      }
    };

    return (
        <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/" className='fw-bold'>WORDYSEARCH</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav>
                    <Login onConnect={handleConnect} onLoggedIn={handleLoggedIn} />
                </Nav>
                </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}

export default CNavbar;