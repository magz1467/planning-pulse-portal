import click
from .db import create_session, db_connect
from .plan_data import fetch_planning_data_paginated
from .utils import save_to_file

engine, connection = db_connect(False)
session = create_session(engine)


@click.group()
def cli():
    # Fetch all records
    all_records = fetch_planning_data_paginated()

    record_keys = set()
    for record in all_records:
        for k, v in record.items():
            record_keys.add((k, type(v)))

    # Save to file
    if all_records:
        save_to_file(all_records)

    print(list(record_keys))


@cli.command("clear", help="Clear the table")
def _retrieve(): ...


@cli.command(
    "sync",
    help="Sync the table with the current script",
)
def _sync(): ...


if __name__ == "__main__":
    cli()
