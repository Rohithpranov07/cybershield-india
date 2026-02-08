#!/usr/bin/env python3
from eth_account import Account
import secrets

print("=" * 60)
print("Creating Ethereum Wallet for CyberShield India")
print("=" * 60)

# Generate private key
private_key = "0x" + secrets.token_hex(32)

# Create account
account = Account.from_key(private_key)

print("\n✅ Wallet Created Successfully!\n")
print("Address:", account.address)
print("Private Key:", private_key)

print("\n⚠️  IMPORTANT:")
print("1. Save the private key in your .env file")
print("2. NEVER share your private key")
print("3. Get test MATIC from: https://faucet.polygon.technology/")
print("4. Network: Mumbai Testnet")
print("\n" + "=" * 60)
