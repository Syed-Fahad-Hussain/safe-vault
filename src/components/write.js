import React, {Component} from 'react';
import {Input, Row, Button, Col} from 'react-materialize';
import {Label} from 'react-bootstrap';
import CryptoJS from 'crypto-js';
import getWeb3 from '../utils/getWeb3'
import {storage} from '../config/firebaseConfiguration';
import StorageController from "../interface/storageController";

const sha256 = require('sha-256-js');
const utf8 = require('utf8');

var mAccounts
var fileHash = '';
var web3;// = null
var privateKey = ''

var keySize = 256;
var iterations = 100;

var fileName = ''
var fileContent = ''

class Write extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buffer: '',
            currentStatus: '',
            HashStateMessage: '',
            transactionHash: '',
            open: false
        }
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    async componentDidMount() {
        this.checkweb3();
    }

    checkweb3() {
        getWeb3
            .then(results => {
                web3 = results.web3
                this.instantiateContract()
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    async instantiateContract() {
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

    encrypt(msg, pass) {
        this.setState({currentStatus: "Encrypting data. Please wait.."})

        var salt = CryptoJS.lib.WordArray.random(128 / 8);
        var key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keySize / 32,
            iterations: iterations
        });

        var iv = CryptoJS.lib.WordArray.random(128 / 8);
        var encrypted = CryptoJS.AES.encrypt(msg, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC

        });

        var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
        return transitmessage;
    }


    onSaveData(event) {
        event.preventDefault();

        if (fileHash === '') {
            alert("Please select file to upload")
            return
        }

        if (mAccounts[0] === '' || privateKey === '') {
            alert("All the fields are required");
            return
        }
        if (mAccounts.length === 0) {
            alert("Metamask not set up")
            return
        } else {
            this.uploadFile();
        }
    }

    onPrivateKeyChange(event) {
        privateKey = event.target.value
    }

    uploadFile = async () => {
        this.setState({currentStatus: "Encrypting and uploading file. Please wait.."})
        var encrypted = CryptoJS.AES.encrypt(fileContent, privateKey)

        var eFile = new File([encrypted.toString()], "file.encrypted", {type: "text/plain"})
        let eReader = new FileReader()
        eReader.readAsArrayBuffer(eFile)
        eReader.onloadend = (e) => {
            this.convertToBuffer(eReader)
        }
    };

    captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        fileName = file.name;
        let reader = new window.FileReader()
        reader.readAsDataURL(file)

        reader.onloadend = (e) => {
            fileContent = e.target.result;

            fileHash = sha256(utf8.encode(fileContent));
            this.setState({HashStateMessage: fileHash})

        }

    };

    convertToBuffer = async (reader) => {
        const buffer = await Buffer.from(reader.result);
        this.setState({buffer: buffer});

        let storageRef = storage.ref(fileHash);
        let file = this.state.buffer;
        let that = this;
        storageRef.put(file).then(function (snapshot) {
            console.log('Uploaded a Blob or File');
            that.setState({currentStatus: "File Uploaded"})
        })
            .catch(err => {
                console.log(err)
            });

        const accounts = await web3.eth.getAccounts();
        await StorageController.methods
            .addData(fileHash).send({
                from: accounts[0]
            }).on('transactionHash', (hash) => {
                that.setState({transactionHash: 'https://rinkeby.etherscan.io/tx/' + hash})
            }).on('confirmation', function () {
                console.log("Transaction confirmed");
            });
    };

    render() {
        return (
            <div>
                <form onSubmit={this.onSaveData.bind(this)}>
                    <Row style={{marginBottom: 0}}>
                        <Col s={3}></Col>
                        <Col s={6}>
                            <Label style={{color: 'blue'}}>Save any information on the blockchain fully encrypted.
                                Please remember your private key as this will be used to decrypt and read your
                                information when you need it. Use Safe-Vault to save contracts and other important
                                information that need to be public, but secure and encrypted. BlockSave is useful for
                                Legal, Real Estate, Insurance, Financial contracts and for many other industries.
                                <br/>
                            </Label>
                            <br/>
                            <Label style={{color: 'blue'}}>Please select a document, preferably a pdf, to store and
                                upload. The document will be encrypted to protect it</Label>
                            <br/>
                            <input
                                type="file"
                                onChange={this.captureFile}
                            />
                            <br/>
                            <br/>
                            <Label style={{color: 'blue'}}>Please enter a password here that will be ued to encrypt your
                                data and file. Do not forget this password as you will need it to read your data or file
                                later</Label>
                            <Input s={12} type="password" onChange={this.onPrivateKeyChange.bind(this)}
                                   name='privateKey' label="Enter Private Key here (used to encrypt data)"/>
                            <br/>
                            <br/>
                            <br/>
                            <Label style={{fontSize: '20px', color: 'red'}}>{this.state.currentStatus}</Label>
                            <br/>
                            <Row>
                                <Col s={4}></Col>
                                <Col s={4}>
                                    <Button className="btn waves-effect waves-light" type="submit" name="action"
                                            title='submit'
                                            style={{display: 'block', margin: 0, backgroundColor: '#004EFF'}}>Save
                                        Data</Button>
                                </Col>
                                <Col s={4}></Col>
                            </Row>
                            {(this.state.transactionHash) ? (<div>
                                <Label style={{color: 'blue'}}> Track Your Transaction here: </Label><br/>
                                <a href={this.state.transactionHash} target="_blank">{this.state.transactionHash}</a>
                                <br/>
                                <Label style={{color: 'blue'}}> To check your token, put the below address in your
                                    Metamask
                                    <br/>
                                    0xb3a8db32c23b2a5953a8c216031f39795720cdf6
                                </Label>
                            </div>) : (null)}


                        </Col>
                        <Col s={3}></Col>
                    </Row>
                </form>
            </div>
        )
    }
}

export default (Write);
