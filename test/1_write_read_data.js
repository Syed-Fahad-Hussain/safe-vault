var storage = artifacts.require("./Storage.sol");

var ETHToUSDExchangeRate = 500;
var dataWriteCharge = 1;
var fileUploadCharge = 5;

contract('Storage', function (accounts) {
    var key;

    it("should be possible to add value", function () {
        var instance;
        return storage.deployed().then(function (i) {
            instance = i;
            return instance.addData("key", "value", "",  accounts[0], { 
                from: accounts[0],
                value: web3.toWei(dataWriteCharge / ETHToUSDExchangeRate, 'ether'),
                gasPrice: web3.eth.gasPrice
            });
        }).then(function (result) {
            key = result.logs[0].args.key
            assert.equal(result.logs[0].event, "DataAdded", "The Log-Event should be DataAdded");
            assert.equal(result.logs[0].args.value, "value", "Value not added");
            assert.equal(result.logs[0].args.fileHash, "", "File hash should be empty");
        })
    });

    it("should be possible to add file hash", function () {
        var instance;
        return storage.deployed().then(function (i) {
            instance = i;
            return instance.addData("key", "", "QmVunwR4mvC4F5eTYWCGU3Baq9kmaTyRPot6nRGp24D4aJ",  accounts[0], { 
                from: accounts[0],
                value: web3.toWei(fileUploadCharge / ETHToUSDExchangeRate, 'ether'),
                gasPrice: web3.eth.gasPrice
            });
        }).then(function (result) {
            key = result.logs[0].args.key
            assert.equal(result.logs[0].event, "DataAdded", "The Log-Event should be DataAdded");
            assert.equal(result.logs[0].args.fileHash, "QmVunwR4mvC4F5eTYWCGU3Baq9kmaTyRPot6nRGp24D4aJ", "File hash not added");
            assert.equal(result.logs[0].args.value, "", "Value should be empty");
        })
    });

    it("should be possible to add value and file hash", function () {
        var instance;
        return storage.deployed().then(function (i) {
            instance = i;
            return instance.addData("key", "value", "QmVunwR4mvC4F5eTYWCGU3Baq9kmaTyRPot6nRGp24D4aJ",  accounts[0], { 
                from: accounts[0],
                value: web3.toWei(fileUploadCharge / ETHToUSDExchangeRate + dataWriteCharge / ETHToUSDExchangeRate, 'ether'),
                gasPrice: web3.eth.gasPrice
            });
        }).then(function (result) {
            key = result.logs[0].args.key
            assert.equal(result.logs[0].event, "DataAdded", "The Log-Event should be DataAdded");
            assert.equal(result.logs[0].args.value, "value", "Value not added");
            assert.equal(result.logs[0].args.fileHash, "QmVunwR4mvC4F5eTYWCGU3Baq9kmaTyRPot6nRGp24D4aJ", "File hash not added");
        })
    });

    it("should be possible to read data from the blockchain", function () {
        var instance;
        return storage.deployed().then(function (i) {
            instance = i;
            return instance.getData.call(key, { from: accounts[0] });
        }).then(function (result) {
            assert.equal(result[0], "value", "Value not added");
            assert.equal(result[1], "QmVunwR4mvC4F5eTYWCGU3Baq9kmaTyRPot6nRGp24D4aJ", "File hash not added");
        })
    });
});