import Web3 from 'web3';
import './App.css';

let web3 = undefined;

// need to move this on env file
const serverUrl = 'http://localhost:3001/';

function App() {
  const fetchNonce = async () => {
    return (await fetch(`${serverUrl}token`)).json();
  }

  const signMessage = async (nonce, address) => {
    return web3.eth.personal.sign(`login${nonce}`, address)
  }

  const authenticate = async (address, signature, nonce) => {
    return (await fetch(`${serverUrl}auth`, {
      body: JSON.stringify({ address, signature, nonce }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })).json()
  }

  const web3Enable = async () => {
    if (!window.ethereum) {
      window.alert('Please install MetaMask first.');
      return;
    }
    if (!web3) {
      try {
        await window.ethereum.enable();
        web3 = new Web3(window.ethereum);
      } catch (error) {
        window.alert('You need to allow MetaMask.');
        return;
      }
    }
    let address = (await web3.eth.getAccounts())[0];
    return address.toLowerCase();
  }

  const login = async () => {
    try {
      let userAddress = await web3Enable();
      let nonce = await fetchNonce();
      let message = await signMessage(nonce, userAddress);
      window.alert((await authenticate(userAddress, message, nonce)).message);
    } catch (error) {
      window.alert('error--' + error.message);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={login} style={{width: 100, height: 60, backgroundColor: "#f5841f"}}>Login</button>
      </header>
    </div>
  );
}

export default App;
