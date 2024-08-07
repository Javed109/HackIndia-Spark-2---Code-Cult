// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalData {
    struct Record {
        address owner;
        string dataHash;
        uint timestamp;
    }

    mapping(bytes32 => Record) public records;
    mapping(address => bytes32[]) public ownerRecords;

    event RecordAdded(address indexed owner, bytes32 recordId, string dataHash, uint timestamp);

    function addRecord(bytes32 recordId, string memory dataHash) public {
        require(records[recordId].timestamp == 0, "Record already exists");
        records[recordId] = Record(msg.sender, dataHash, block.timestamp);
        ownerRecords[msg.sender].push(recordId);
        emit RecordAdded(msg.sender, recordId, dataHash, block.timestamp);
    }

    function getRecord(bytes32 recordId) public view returns (address, string memory, uint) {
        Record memory record = records[recordId];
        return (record.owner, record.dataHash, record.timestamp);
    }

    function getOwnerRecords(address owner) public view returns (bytes32[] memory) {
        return ownerRecords[owner];
    }
}

