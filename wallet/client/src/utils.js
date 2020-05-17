import Web3 from 'web3';
import Wallet from './contracts/Wallet.json';

const getWeb3 = () => {
    // truffle develope started at ...
    // pass url to node that runs development blockchain
    // accepts transactions that arent signed NOT FOR PRODUCTION
    // return new Web3('http://localhost:9545')
    // *************
    // intergrate for metamask where I need to sign a transactiom(mainnet)
    return new Promise((resolve, reject) => {
        window.addEventListener('load', async() => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                } catch (err) {
                    reject(err)
                }
    
            } else if (window.web3) {
                // old metamask
                resolve(window.web3)
            } else {
                // no metamask
                reject('Must install Metamask')
            }
        })
    })
};
// contract instance
const getWallet = async web3 => {
    const networkId = await web3.eth.net.getId();
    const contractDeployment = Wallet.networks[networkId];
    return new web3.eth.Contract(
        // abi
        Wallet.abi,
        // address of smart contract
        contractDeployment && contractDeployment.address
    )
}

export { getWeb3, getWallet }