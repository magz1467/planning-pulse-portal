from typing import Any, Dict

from constants import ANKR_KEY
from web3 import Web3


def get_provider_uri():
    return f"https://rpc.ankr.com/arbitrum/{ANKR_KEY}"


class CallRpc:
    def __init__(self, rpc_url: str):
        self.rpc_url = rpc_url
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))

    def get_block_number(self):
        return self.w3.eth.block_number


class UniswapV3PoolState(CallRpc):
    ABI = """[
        {
            "inputs": [],
            "name": "slot0",
            "outputs": [
                {"type": "uint160", "name": "sqrtPriceX96"},
                {"type": "int24", "name": "tick"},
                {"type": "uint16", "name": "observationIndex"},
                {"type": "uint16", "name": "observationCardinality"},
                {"type": "uint16", "name": "observationCardinalityNext"},
                {"type": "uint8", "name": "feeProtocol"},
                {"type": "bool", "name": "unlocked"}
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "liquidity",
            "outputs": [{"type": "uint128"}],
            "stateMutability": "view",
            "type": "function"
        }
    ]"""

    def __init__(self, rpc_url: str, pool_address: str):
        super().__init__(rpc_url)
        self.pool_address = pool_address
        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(pool_address), abi=self.ABI
        )

    def get_pool_state(self, block_identifier: int) -> Dict[str, Any]:
        slot0 = self.contract.functions.slot0().call(block_identifier=block_identifier)
        liquidity = self.contract.functions.liquidity().call(
            block_identifier=block_identifier
        )

        # Calculate price from sqrtPriceX96
        sqrt_price_x96 = slot0[0]
        price = (sqrt_price_x96**2) * (10**12) / (2**192)

        return {
            "price": price,
            "tick": slot0[1],
            "liquidity": liquidity,
            "sqrtPriceX96": sqrt_price_x96,
            "block": block_identifier,
        }
