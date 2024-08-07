// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalData {
    // Structure to hold medical data
    struct Data {
        address owner;
        string content;
        bool consent;
    }

    // Array to store all medical data records
    Data[] public dataRecords;

    // Event to be emitted when data is uploaded
    event DataUploaded(uint indexed index, address indexed owner, string content);

    // Event to be emitted when consent is updated
    event ConsentUpdated(uint indexed index, address indexed owner, bool consent);

    // Function to upload medical data
    function uploadData(string memory content) public {
        dataRecords.push(Data(msg.sender, content, false));
        emit DataUploaded(dataRecords.length - 1, msg.sender, content);
    }

    // Function to update consent for a specific data record
    function updateConsent(uint index, bool consent) public {
        require(index < dataRecords.length, "Invalid index");
        require(dataRecords[index].owner == msg.sender, "Not the owner of the data");
        dataRecords[index].consent = consent;
        emit ConsentUpdated(index, msg.sender, consent);
    }

    // Function to retrieve a specific data record
    function getData(uint index) public view returns (address, string memory, bool) {
        require(index < dataRecords.length, "Invalid index");
        Data memory record = dataRecords[index];
        return (record.owner, record.content, record.consent);
    }

    // Function to get the total number of data records
    function getDataCount() public view returns (uint) {
        return dataRecords.length;
    }
}
