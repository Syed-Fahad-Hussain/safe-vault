var storage = artifacts.require("./Storage.sol");

var ETHToUSDExchangeRate = 1000;
var dataWriteCharge = 2;
var fileUploadCharge = 10;

contract('Storage', function (accounts) {
    var key;

    it("should be possible to set exchange rate", function () {
        var instance;
        return storage.deployed().then(function (i) {
            instance = i;
            return instance.setExchangeRate(ETHToUSDExchangeRate, { 
                from: accounts[0],
                gasPrice: web3.eth.gasPrice
            });
        }).then(function (result) {
            return instance.ETHToUSDExchangeRate.call({ from: accounts[0] })
        }).then(function(result) {
            assert.equal(result.toString(), ETHToUSDExchangeRate.toString(), "Exchange rate not set");
        })
    });

    it("should be possible to set value write charge", function () {
        var instance;
        return storage.deployed().then(function (i) {
            instance = i;
            return instance.setDataWriteCharge(dataWriteCharge, { 
                from: accounts[0],
                gasPrice: web3.eth.gasPrice
            });
        }).then(function (result) {
            return instance.dataWriteCharge.call({ from: accounts[0] })
        }).then(function(result) {
            assert.equal(result.toString(), dataWriteCharge.toString(), "Data write charge not set");
        })
    });

    it("should be possible to set file upload charge", function () {
        var instance;
        return storage.deployed().then(function (i) {
            instance = i;
            return instance.setFileUploadCharge(fileUploadCharge, { 
                from: accounts[0],
                gasPrice: web3.eth.gasPrice
            });
        }).then(function (result) {
            return instance.fileUploadCharge.call({ from: accounts[0] })
        }).then(function(result) {
            assert.equal(result.toString(), fileUploadCharge.toString(), "File upload charge not set");
        })
    });
});