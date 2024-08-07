// contracts/MedicalData.sol
pragma solidity ^0.8.0;

contract MedicalData {
    struct Data {
        address owner;
        string content;
        bool consent;
    }

    Data[] public data;

    function uploadData(string memory content) public {
        data.push(Data(msg.sender, content, false));
    }

    function giveConsent(uint index, bool consent) public {
        require(data[index].owner == msg.sender, "Not the owner");
        data[index].consent = consent;
    }

    function getData(uint index) public view returns (address, string memory, bool) {
        Data memory d = data[index];
        return (d.owner, d.content, d.consent);
    }
}
