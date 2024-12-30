from sqlalchemy import MetaData, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


def db_connect(echo=True):
    username = "postgres.jposqxdboetyioymfswd"
    password = "busSux-0xekge-tugvid"
    dbname = "postgres"
    port = 5432
    host = "aws-0-eu-west-2.pooler.supabase.com"

    engine = create_engine(
        f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{dbname}", echo=echo
    )
    connection = engine.connect()

    return engine, connection


def create_session(engine):
    Session = sessionmaker(bind=engine)
    session = Session()

    return session
