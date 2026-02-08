#!/usr/bin/env python3
from web3 import Web3

# ✅ Reliable Polygon Amoy RPC
w3 = Web3(Web3.HTTPProvider("https://polygon-amoy.publicnode.com"))

address = "0x309cdda3753Fcc7E34F58db181d57F30A31A48F5"

if w3.is_connected():
    print("✅ Connected to Polygon Amoy testnet")

    balance_wei = w3.eth.get_balance(address)
    balance_pol = w3.from_wei(balance_wei, 'ether')

    print(f"Address: {address}")
    print(f"Balance: {balance_pol} POL")
else:
    print("❌ Connection failed")
