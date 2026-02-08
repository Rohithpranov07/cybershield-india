// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EvidenceRegistry
 * @dev Store cryptographic proof of forensic evidence on-chain
 */
contract EvidenceRegistry {
    
    struct Evidence {
        string caseId;
        string mediaHash;      // SHA-256 hash of media file
        string reportHash;     // SHA-256 hash of PDF report
        uint256 timestamp;
        address submitter;
        bool exists;
    }
    
    // Mapping from case ID to evidence
    mapping(string => Evidence) public evidenceRecords;
    
    // Array to track all case IDs
    string[] public caseIds;
    
    // Events
    event EvidenceStored(
        string indexed caseId,
        string mediaHash,
        string reportHash,
        uint256 timestamp,
        address submitter
    );
    
    event EvidenceVerified(
        string indexed caseId,
        address verifier,
        uint256 timestamp
    );
    
    /**
     * @dev Store evidence on blockchain
     * @param _caseId Unique case identifier
     * @param _mediaHash SHA-256 hash of the media file
     * @param _reportHash SHA-256 hash of the forensic report
     */
    function storeEvidence(
        string memory _caseId,
        string memory _mediaHash,
        string memory _reportHash
    ) public {
        require(bytes(_caseId).length > 0, "Case ID cannot be empty");
        require(bytes(_mediaHash).length == 64, "Invalid media hash length");
        require(!evidenceRecords[_caseId].exists, "Evidence already exists for this case");
        
        evidenceRecords[_caseId] = Evidence({
            caseId: _caseId,
            mediaHash: _mediaHash,
            reportHash: _reportHash,
            timestamp: block.timestamp,
            submitter: msg.sender,
            exists: true
        });
        
        caseIds.push(_caseId);
        
        emit EvidenceStored(
            _caseId,
            _mediaHash,
            _reportHash,
            block.timestamp,
            msg.sender
        );
    }
    
    /**
     * @dev Verify evidence exists and matches
     * @param _caseId Case identifier to verify
     * @param _mediaHash Media hash to verify against
     */
    function verifyEvidence(
        string memory _caseId,
        string memory _mediaHash
    ) public returns (bool) {
        require(evidenceRecords[_caseId].exists, "Evidence not found");
        
        Evidence memory evidence = evidenceRecords[_caseId];
        bool isValid = keccak256(bytes(evidence.mediaHash)) == keccak256(bytes(_mediaHash));
        
        if (isValid) {
            emit EvidenceVerified(_caseId, msg.sender, block.timestamp);
        }
        
        return isValid;
    }
    
    /**
     * @dev Get evidence details
     * @param _caseId Case identifier
     */
    function getEvidence(string memory _caseId) 
        public 
        view 
        returns (
            string memory caseId,
            string memory mediaHash,
            string memory reportHash,
            uint256 timestamp,
            address submitter
        ) 
    {
        require(evidenceRecords[_caseId].exists, "Evidence not found");
        
        Evidence memory evidence = evidenceRecords[_caseId];
        return (
            evidence.caseId,
            evidence.mediaHash,
            evidence.reportHash,
            evidence.timestamp,
            evidence.submitter
        );
    }
    
    /**
     * @dev Get total number of evidence records
     */
    function getTotalCases() public view returns (uint256) {
        return caseIds.length;
    }
    
    /**
     * @dev Get case ID by index
     */
    function getCaseIdByIndex(uint256 index) public view returns (string memory) {
        require(index < caseIds.length, "Index out of bounds");
        return caseIds[index];
    }
}
