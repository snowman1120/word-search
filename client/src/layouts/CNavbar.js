import {useState, useEffect} from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import {useStateContext} from 'contexts/ContextProvider';

import Web3 from 'web3';

const CNavbar = () => {
    const { isConnected, setIsConnected } = useStateContext();
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
      const checkConnectedWallet = () => {
        const userData = JSON.parse(localStorage.getItem('userAccount'));
        if (userData != null) {
          setUserInfo(userData);
          setIsConnected(true);
        }
      }
      checkConnectedWallet();
      
      window.ethereum.on('accountsChanged', (e) => {
        // Do something
        if(e.length > 0) {
          const userData = JSON.parse(localStorage.getItem('userAccount'));
          if (userData != null) {
            setUserInfo(userData);
            setIsConnected(true);
          } else {
            onConnect();
          }
        } else {
          localStorage.removeItem('userAccount');
          setUserInfo(null);
          setIsConnected(false);
        }
      });
    }, []);

    const detectCurrentProvider = () => {
        let provider;
        if (window.ethereum) {
          provider = window.ethereum;
        } else if (window.web3) {
          // eslint-disable-next-line
          provider = window.web3.currentProvider;
        } else {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        return provider;
    };

    const onConnect = async () => {
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
        const userData = JSON.parse(localStorage.getItem('userAccount'));
        setUserInfo(userData);
        setIsConnected(true);
    };

    return (
        <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/">WORDYSEARCH</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav>
                    {
                        isConnected ? (
                          <>
                            <img src="/assets/img/metamask.svg" alt="" className='metamask-logo' />
                            <span style={{lineHeight: '36px', marginLeft: '10px'}}>Connected</span>
                          </>
                        ) : <Nav.Link href="#" onClick={onConnect}>Connect to metamask</Nav.Link>
                    }
                </Nav>
                </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}

export default CNavbar;