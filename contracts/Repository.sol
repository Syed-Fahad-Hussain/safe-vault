pragma solidity ^0.4.23;

contract Repository {

    struct Data {
        string value;
        string fileHash;
        address toCharge;
    }

    uint constant public WEI_T0_ETH_RATE = 1 ether;

    uint public dataWriteCharge = 1;
    uint public fileUploadCharge = 5;

    uint public ETHToUSDExchangeRate = 500;

    mapping(string => Data) internal data;
}