from sqlalchemy import BigInteger, Column, DateTime, Float, MetaData, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

metadata = MetaData()
Base = declarative_base()


def insert_pool_state(session, block, liquidity, price):
    new_block_data = PoolState(block=block, liquidity=str(liquidity), price=price)
    # quick way to be done with duplicates
    session.merge(new_block_data)
    session.commit()


def query_all(session):
    result = session.query(PoolState)
    print(result.all())


class PoolState(Base):
    __tablename__ = "BlockPriceLiquidity"

    block = Column(BigInteger, primary_key=True)  # int8
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    liquidity = Column(String)  # text
    price = Column(Float(precision=8))  # float8

    def __repr__(self):
        return f"<BlockData(block={self.block}, created_at={self.created_at}, liquidity={self.liquidity}, price={self.price})>"


# Example of how to create the table
def create_tables(engine):
    Base.metadata.create_all(engine)
