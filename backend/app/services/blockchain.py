import os
from web3 import Web3
from dotenv import load_dotenv
import json
import time

load_dotenv()

RPC_URL = os.getenv("POLYGON_RPC_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
WALLET_ADDRESS = os.getenv("WALLET_ADDRESS")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "caseId", "type": "string"},
            {"internalType": "string", "name": "mediaHash", "type": "string"},
            {"internalType": "string", "name": "reportHash", "type": "string"},
        ],
        "name": "storeEvidence",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    }
]

class BlockchainService:
    def __init__(self):
        print("\n🔗 Initializing blockchain service...")

        self.enabled = False
        self.w3 = Web3(Web3.HTTPProvider(RPC_URL))

        if not self.w3.is_connected():
            print("❌ Blockchain connection failed")
            return

        print("✅ Connected to Ethereum Sepolia")

        self.account = self.w3.to_checksum_address(WALLET_ADDRESS)
        self.contract = self.w3.eth.contract(
            address=self.w3.to_checksum_address(CONTRACT_ADDRESS),
            abi=ABI
        )

        balance = self.w3.eth.get_balance(self.account)
        print(f"Wallet balance: {self.w3.from_wei(balance,'ether')} ETH")

        self.enabled = True
        print("✅ Blockchain ready\n")

    def store_evidence(self, case_id, media_hash, report_hash):
        try:
            print("\n📝 Storing evidence on blockchain...")
            print(f"   Case ID: {case_id}")
            print(f"   Media Hash: {media_hash[:20]}...")
            print(f"   Report Hash: {report_hash[:20]}...")

            nonce = self.w3.eth.get_transaction_count(self.account)

            txn = self.contract.functions.storeEvidence(
                case_id,
                media_hash,
                report_hash
            ).build_transaction({
                "from": self.account,
                "nonce": nonce,
                "gas": 300000,
                "gasPrice": self.w3.eth.gas_price,
            })

            print("📤 Sending transaction...")

            signed_txn = self.w3.eth.account.sign_transaction(
                txn, private_key=PRIVATE_KEY
            )

            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)

            print(f"⏳ Waiting for confirmation... {tx_hash.hex()}")

            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)

            print("✅ Evidence stored on blockchain!")
            print("📦 Block:", receipt.blockNumber)

            return {
                "success": True,
                "tx_hash": tx_hash.hex(),
                "block": receipt.blockNumber
            }

        except Exception as e:
            print("❌ Blockchain failed:", str(e))
            return {"success": False, "error": str(e)}

_blockchain = None

def get_blockchain_service():
    global _blockchain
    if _blockchain is None:
        _blockchain = BlockchainService()
    return _blockchain