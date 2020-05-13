const { expectRevert } = require('@openzeppelin/test-helpers')
// contract artifact allows you to intgrate with contract
const Wallet = artifacts.require('Wallet');

// truffle blockchain generates 10 addresses funded with fake ether
// I access this array of addresses using the accounts argument
contract('Wallet', (accounts) => {
    let wallet;
    beforeEach(async () => {
// using 3 addresses, the second argument is the quorum(minumum number of participants for transfer to be approved)
        wallet = await Wallet.new([accounts[0],accounts[1],accounts[2]], 2);
        // send ether to wallet using web3
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 1000});
    });
    // Test #1
    it('Should have correct approvers and quorum', async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();
        assert(approvers.length === 3);
        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);
        assert(quorum.toNumber() === 2);
    });
    it('Should create transfers', async () => {
        // create transfer
        await wallet.createTransfer(100,accounts[5], {from: accounts[0]});
        const transfers = await wallet.getTransfers();
        assert(transfers.length === 1);
        assert(transfers[0].id === '0');
        assert(transfers[0].amount === '100');
        assert(transfers[0].to === accounts[5]);
        assert(transfers[0].approvals=== '0');
        assert(transfers[0].sent === false);
    });
    it('Should not create transfers if sender is not approved', async () => {
        await expectRevert(
        wallet.createTransfer(100, accounts[5], {from:accounts[4]}),
        'only approver is allowed'
        ); 
    });
});