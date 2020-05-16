import Web3 from 'web3';
import Wallet from './contracts/Wallet.json';

const getWeb3 = () => {
    // truffle develope started at ...
    // pass url to node that runs development blockchain
    return new Web3('http://localhost:9545')
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