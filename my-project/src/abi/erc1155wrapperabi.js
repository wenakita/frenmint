const ERC1155ABI = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}, {"name": "_id", "type": "uint256"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "_owners", "type": "address[]"}, {"name": "_ids", "type": "uint256[]"}],
        "name": "balanceOfBatch",
        "outputs": [{"name": "", "type": "uint256[]"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "_operator", "type": "address"}, {"name": "_approved", "type": "bool"}],
        "name": "setApprovalForAll",
        "outputs": [],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}, {"name": "_operator", "type": "address"}],
        "name": "isApprovedForAll",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_from", "type": "address"},
            {"name": "_to", "type": "address"},
            {"name": "_id", "type": "uint256"},
            {"name": "_value", "type": "uint256"},
            {"name": "_data", "type": "bytes"}
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_from", "type": "address"},
            {"name": "_to", "type": "address"},
            {"name": "_ids", "type": "uint256[]"},
            {"name": "_values", "type": "uint256[]"},
            {"name": "_data", "type": "bytes"}
        ],
        "name": "safeBatchTransferFrom",
        "outputs": [],
        "type": "function"
    }
];