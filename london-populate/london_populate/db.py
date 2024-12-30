from sqlalchemy import MetaData, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

metadata = MetaData()
Base = declarative_base()


def db_connect(echo=True):
    username = "postgres.hijnvdjstbihvoxniheq"
    password = "compasslabsinterview"
    dbname = "postgres"
    port = 6543
    host = "aws-0-eu-central-1.pooler.supabase.com"

    engine = create_engine(
        f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{dbname}", echo=echo
    )
    connection = engine.connect()

    return engine, connection


def create_tables(engine):
    metadata.drop_all(engine, checkfirst=True)
    metadata.create_all(engine, checkfirst=True)


def create_tables_orm(engine):
    Base.metadata.drop_all(engine, checkfirst=True)
    Base.metadata.create_all(engine, checkfirst=True)


def create_session(engine):
    Session = sessionmaker(bind=engine)
    session = Session()

    return session
