import React, {Component} from 'react';
import {Input, Row, Button, Col} from 'react-materialize';
import {Label} from 'react-bootstrap'
import CryptoJS from 'crypto-js';
import getWeb3 from '../utils/getWeb3'
import StorageController from "../interface/storageController";


var mAccounts
var web3 = null
var privateKey = ''

// Decryption parameters
var keySize = 256;
var iterations = 100;
var fileHash = ''

class Read extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            currentStatus: ''
        }
    }

    componentDidMount() {
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
        web3.eth.getAccounts((error, accounts) => {
            if (accounts.length === 0) {
                alert("Metamask not set up.")
            }
            mAccounts = accounts
            setInterval(function () {
                if (web3.eth.accounts[0] !== mAccounts[0]) {
                    mAccounts = web3.eth.accounts;
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

    async getData() {
        const accounts = await web3.eth.getAccounts();
        await StorageController.methods
            .data(accounts[0]).call().then(Hash => {
                fileHash = Hash;
            });
    }

    async onReadData(event) {
        event.preventDefault();

        await this.getData();
        this.setState({currentStatus: "Reading data.."})
    }

    async onButtonClick(event) {
        await this.onReadData(event);
        this.onDownloadFile(event);
    }

    onPrivateKeyChange(event) {
        privateKey = event.target.value
    }

    onDownloadFile(event) {
        event.preventDefault();
        if (privateKey === '') {
            alert("Incorrect Private key")
            return
        }

        this.setState({currentStatus: "Downloading file. Please wait.."})
        var link = document.createElement("a");
        link.href = 'https://firebasestorage.googleapis.com/v0/b/safe-vault-with-tokens.appspot.com/o/' + fileHash + "?alt=media&token=234ab920-5365-45f9-8f23-37100eef24ad";
        document.body.appendChild(link);

        var request = new XMLHttpRequest();
        request.open('GET', link.href, true);
        request.responseType = 'blob';
        request.onload = () => {
            var eReader = new FileReader();
            eReader.readAsText(request.response);
            eReader.onload = (e) => {
                this.setState({currentStatus: "Decrypting file. Please wait.."})
                var decrypted = CryptoJS.AES.decrypt(e.target.result, privateKey).toString(CryptoJS.enc.Latin1);
                var a = document.createElement("a");
                a.href = decrypted;

                if (!decrypted.toString().includes("data")) {
                    alert("Error in decryption. Most likely caused by the wrong private key.")
                    return;
                }

                let split1 = decrypted.toString().split("data:")
                let split2 = split1[1].split(";base64")
                let type = split2[0]

                a.download = fileHash;
                document.body.appendChild(a);
                a.click();

                this.setState({currentStatus: "File downloaded."})
            };
        };
        request.send();
    }

    render() {
        return (
            <div>
                <form>
                    <Row style={{marginBottom: 0}}>
                        <Col s={3}></Col>
                        <Col s={6}>
                            <Label style={{color: 'blue'}}>Please enter the password that you used to encrypt this data
                                when you stored it using Write</Label>
                            <Input s={12} type='password' onChange={this.onPrivateKeyChange.bind(this)}
                                   name='privateKey' label="Enter Private Key here (used to decrypt data)"/>
                            <br/>
                            <div>
                                <Label style={{fontSize: '20px', color: 'red'}}>{this.state.currentStatus}</Label>
                            </div>
                            <div>
                                <br/>
                                <Row>
                                    <Col>
                                        <br/>
                                        <Button onClick={this.onButtonClick.bind(this)}
                                                className="btn waves-effect waves-light"
                                                style={{backgroundColor: '#145CFF', marginLeft: '300px'}}>Download
                                            File</Button>
                                    </Col>
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
