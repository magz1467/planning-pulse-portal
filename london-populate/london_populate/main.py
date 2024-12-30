from sqlalchemy import desc
from constants import BATCH_SIZE, CONTRACT_ADDRESS
from db import create_session, db_connect
from rpc import UniswapV3PoolState, get_provider_uri
from models import PoolState
from tqdm import tqdm


def sync(session, start: int, end: int):
    # needs retry logic for rpc calls and better batch worker

    uniswap_pool_state = UniswapV3PoolState(get_provider_uri(), CONTRACT_ADDRESS)

    for batch_start in tqdm(
        range(start, end + 1, BATCH_SIZE),
        desc=f"Syncing pool state in batches of {BATCH_SIZE}",
    ):
        batch_end = min(batch_start + BATCH_SIZE - 1, end)

        pool_states = []
        for block in tqdm(range(batch_start, batch_end + 1), desc="Syncing batch"):
            pool_state_at_block = uniswap_pool_state.get_pool_state(block)
            pool_states.append(
                PoolState(
                    block=pool_state_at_block["block"],
                    liquidity=str(pool_state_at_block["liquidity"]),
                    price=str(pool_state_at_block["price"]),
                )
            )

        try:
            # try to bulk save in a single commit, individual if duplication found
            session.bulk_save_objects(pool_states)
            session.commit()
        except Exception:
            session.rollback()
            print("bulk insert failed, likely duplication, trying incremental approach")
            for pool in pool_states:
                # quick way to be done with duplicates, merging with existing
                session.merge(pool)
                session.commit()

        # save batch
        session.commit()


def get_latest_pool_state(session) -> int:
    return session.query(PoolState).order_by(desc(PoolState.block)).first().block


def main():
    try:
        engine, connection = db_connect()
        session = create_session(engine)

        pool_state = UniswapV3PoolState(get_provider_uri(), CONTRACT_ADDRESS)
        latest_block_number = pool_state.get_block_number()
        sync(session, latest_block_number - 10, latest_block_number)
    finally:
        session.close()
        connection.close()


if __name__ == "__main__":
    main()
