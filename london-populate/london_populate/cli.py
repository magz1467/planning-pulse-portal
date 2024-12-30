import click
from db import create_session, db_connect

engine, connection = db_connect(False)
session = create_session(engine)


@click.group()
def cli():
    pass


@cli.command("clear", help="Clear the table")
def _retrieve(): ...


@cli.command(
    "sync",
    help="Sync the table with the current script",
)
def _sync(): ...


if __name__ == "__main__":
    cli()
