import Web3 from 'web3';
import Wallet from './contracts/Wallet.json';

const getWeb3 = () => {
    // pass url to node that runs development blockchain. Accepts transactions that arent signed NOT FOR PRODUCTION
    // return new Web3('http://localhost:9545')
    // *************
    // integrate metamask when I need to sign a transaction(mainnet)
    return new Promise((resolve, reject) => {
        // avoids race conditions with web3 injection timing
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    window.ethereum.enable();
                    resolve(web3)
                } catch (err) { 
                    reject(err)
                }
            } else if(window.web3) {
                // old metamask
                    resolve(window.web3)
            } 

    // Fallback to localhost: DEVELOPMENT
            else {
                const provider = new Web3.providers.HttpProvider(
                "http://localhost:9545"
                );
                const web3 = new Web3(provider);
                console.log("No web3 instance injected, using Local web3.");
                resolve(web3);
            }
            // ******************ALTERNATE***********************
            // else {
            //     // no metamask
            //     reject('You must install Metamask')
            // }
    })
};
// contract instance
const getWallet = async web3 => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Wallet.networks[networkId];
    return new web3.eth.Contract(
        // abi
        Wallet.abi,
        // address of smart contract
        deployedNetwork && deployedNetwork.address
    );
};

export { getWeb3, getWallet }