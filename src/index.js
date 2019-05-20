import Portis from "@portis/web3";
import Web3 from "web3";
import IPFS from "ipfs";

const secp256k1 = require('secp256k1')
const ecies = require("eth-ecies");
const keccak256 = require('js-sha3').keccak256;

function encrypt(publicKey, data) {
    let userPublicKey = Buffer.from(publicKey, 'hex');
    let bufferData = Buffer.from(data);
    let encryptedData = ecies.encrypt(userPublicKey, bufferData);
    return encryptedData.toString('base64')
}
// Note: Encrypted message is a 113+ byte buffer

function decrypt(privateKey, encryptedData) {
    let userPrivateKey = Buffer.from(privateKey, 'hex');
    let bufferEncryptedData = Buffer.from(encryptedData, 'base64');
    let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);
    return decryptedData.toString('utf8');
}

const portis = new Portis("211b48db-e8cc-4b68-82ad-bf781727ea9e", "rinkeby");

const web3 = new Web3(portis.provider);

document.getElementById("connectWallet").onclick = () => {

    web3.eth.getAccounts().then(accounts => {
        document.getElementById("content").innerHTML = `<p>Wallet Address: ${
    accounts[0]
  }</p>`;
    });
}

document.getElementById("showPortis").onclick = () => portis.showPortis();



// document.getElementById("connectIPFS").onclick = () => {
//     const IPFS = require('ipfs')
// 	const node = new IPFS({ repo: '/var/ipfs/data' })
// 	node.on('error', errorObject => console.error(errorObject))
// }

document.getElementById("signMessage").onclick = () => {

    const msgParams = [{
            type: 'string',
            name: 'Hello from Portis',
            value: 'This message will be signed by you'
        },
        {
            type: 'uint32',
            name: 'Here is a number',
            value: '90210'
        }
    ]
    web3.eth.getAccounts((error, accounts) => {
        web3.currentProvider.sendAsync({
                id: 1,
                method: 'eth_signTypedData',
                params: [msgParams, accounts[0]]
            },
            (error, response) => {

                document.getElementById("content").innerHTML = `<p>Wallet Address: ${JSON.stringify(response)}</p>`;

            },
        );
    });
}