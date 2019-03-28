pragma solidity ^0.4.24;

import "./Token.sol";

contract Storage is Owned {

    event DataAdded(string fileHash);

    mapping(address => string) public data;
    Token public token;
    uint public numberOfTokens = 1;

    constructor(address _tokenAddress) public {
        owner = msg.sender;
        token = Token(_tokenAddress);
    }

    function addData(string memory _fileHash) public {
        require(keccak256(_fileHash) != keccak256(""));
        data[msg.sender] = _fileHash;

        address user = msg.sender;
        token.mintTokens(user, numberOfTokens);
        emit DataAdded(_fileHash);
    }

    function setNumberOfTokens(uint _numberOfTokens) public onlyOwner {
        numberOfTokens = _numberOfTokens;
    }
}
