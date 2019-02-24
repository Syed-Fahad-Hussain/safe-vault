import React, { Component } from 'react';
import { Input, Row, Button, Col } from 'react-materialize';
import { Label } from 'react-bootstrap'
import nl2br from 'react-newline-to-break';
import CryptoJS from 'crypto-js';
import mime from 'mime-types';

import getWeb3 from '../utils/getWeb3'

// Current test contract on Ropsten testnet
// const contractAddress = '0x318cb3fb7933bb100ae5c57551f375c2093ae695'

// Current contract on Ethereum main net
const contractAddress = '0x7e0dc1fe2f7a8b9db037aaf3e47244885a059620'

// Contract instance
var storageContract

// Accounts
var mAccounts

// Web3 instance
var web3 = null

// Key and Private key of user
var key = ''
var privateKey = ''

// Decryption parameters
var keySize = 256;
var ivSize = 128;
var iterations = 100;

// Hash of the file
var fileHash = ''

class Read extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            currentStatus: ''
        }
    }

    componentWillMount() {
        getWeb3
            .then(results => {
                web3 = results.web3
                this.instantiateContract()
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    instantiateContract() {
        var contract = web3.eth.contract([{ "constant": false, "inputs": [{ "name": "_key", "type": "string" }, { "name": "_value", "type": "string" }, { "name": "_fileHash", "type": "string" }], "name": "addData", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "WEI_T0_ETH_RATE", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "ETHToUSDExchangeRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "dataWriteCharge", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_charge", "type": "uint256" }], "name": "setDataWriteCharge", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_key", "type": "string" }], "name": "getData", "outputs": [{ "name": "", "type": "string" }, { "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_charge", "type": "uint256" }], "name": "setFileUploadCharge", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_exchangeRate", "type": "uint256" }], "name": "setExchangeRate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "fileUploadCharge", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "key", "type": "string" }, { "indexed": false, "name": "value", "type": "string" }, { "indexed": false, "name": "fileHash", "type": "string" }], "name": "DataAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }])
        storageContract = contract.at(contractAddress);

        web3.eth.getAccounts((error, accounts) => {
            if (accounts.length === 0) {
                alert("Metamask not set up.")
            }
            mAccounts = accounts
            var accountInterval = setInterval(function () {
                if (web3.eth.accounts[0] !== mAccounts[0]) {
                    mAccounts = web3.eth.accounts;
                    alert("Please reload the page.");
                }
            }, 100);
        })
    }

    decrypt(transitmessage, pass) {
        var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
        var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
        var encrypted = transitmessage.substring(64);

        var key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keySize / 32,
            iterations: iterations
        });

        var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC

        })
        return decrypted;
    }

    getData() {
        // return storageContract.getData.call(key, { from: mAccounts[0] }, ((error, result) => {
        return storageContract.getData.call(fileHash, { from: mAccounts[0] }, ((error, result) => {
            var decryptedData = this.decrypt(result[0], privateKey).toString(CryptoJS.enc.Utf8)
            // fileHash = this.decrypt(result[1], privateKey).toString(CryptoJS.enc.Utf8)
            this.setState({
                value: decryptedData
            })
            this.setState({ currentStatus: "Data read." })
        }))
    }

    onReadData(event) {
        event.preventDefault();
        if (fileHash === '' || privateKey === '') {
            alert("All fields are required");
        }
        else {
            this.setState({ currentStatus: "Reading data.." })
            this.getData()
        }
    }

    // onKeyChange(event) {
    //     key = event.target.value
    // }

    onFileHashChange(event) {
        fileHash = event.target.value
    }

    onPrivateKeyChange(event) {
        privateKey = event.target.value
    }

    onDownloadFile(event) {
        event.preventDefault();
        if (fileHash === '') {
            alert("File not available.")
            return
        }
        this.setState({ currentStatus: "Downloading file. Please wait.." })
        var link = document.createElement("a");
        link.download = fileHash;
        // link.href = "https://ipfs.io/ipfs/" + fileHash;
        link.href = "https://safe-vault-with-tokens.firebaseio.com/" + fileHash;
        document.body.appendChild(link);

        var request = new XMLHttpRequest();
        request.open('GET', link.href, true);
        request.responseType = 'blob';
        request.onload = () => {
            var eReader = new FileReader();
            eReader.readAsText(request.response);
            eReader.onload = (e) => {
                this.setState({ currentStatus: "Decrypting file. Please wait.." })
                var decrypted = CryptoJS.AES.decrypt(e.target.result, privateKey).toString(CryptoJS.enc.Latin1);
                // var decrypted = this.decrypt(e.target.result.toString(), privateKey)
                var a = document.createElement("a");
                a.href = decrypted;

                if (!decrypted.toString().includes("data")) {
                    alert("Error in decryption. Most likely caused by the wrong private key.")
                    return;
                }

                let split1 = decrypted.toString().split("data:")
                let split2 = split1[1].split(";base64")
                let type = split2[0]

                a.download = fileHash + '.' + mime.extension(type)
                document.body.appendChild(a);
                a.click();

                this.setState({ currentStatus: "File downloaded." })
            };
        };
        request.send();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onReadData.bind(this)}>
                    <Row style={{ marginBottom: 0 }}>
                        <Col s={3}></Col>
                        <Col s={6}>
                            <Label style={{ color: 'blue' }}>Please enter the password that you used to encrypt this data when you stored it using Write</Label>
                            <Input s={12} type='password' onChange={this.onPrivateKeyChange.bind(this)} name='privateKey' label="Enter Private Key here (used to decrypt data)" />
                            <br />
                            <Label style={{ color: 'blue' }}>Please enter the Hash key in order to locate your data or file</Label>
                            <Input s={12} type='text' name='EntryID' onChange={this.onFileHashChange.bind(this)} label="Enter HashKey here" />
                            <div > Data: </div>
                            <p>
                                {nl2br(this.state.value)}
                            </p>
                            <Label style={{ fontSize: '20px', color: 'red' }}>{this.state.currentStatus}</Label>
                            <div>
                                <br />
                                <Row>
                                    <Col s={1}></Col>
                                    <Col s={5}>
                                        <Button className="btn waves-effect waves-light" type="submit" name="action" title='submit' style={{ backgroundColor: '#145CFF' }}>Read Data</Button>
                                    </Col>
                                    <Col s={5}>
                                        <Button onClick={this.onDownloadFile.bind(this)} className="btn waves-effect waves-light" style={{ backgroundColor: '#145CFF' }}>Download File</Button>
                                    </Col>
                                    <Col s={1}></Col>
                                </Row>
                            </div>
                        </Col>
                        <Col s={4}></Col>
                    </Row>
                </form>
            </div>
        )
    }
}

export default (Read);
