import click
from sqlalchemy import insert
import itertools

from london_populate.db import (
    create_session,
    db_connect,
)
from london_populate.models import PlanningApplication, create_tables_orm
from london_populate.plan_data import fetch_planning_data_paginated
from london_populate.utils import save_to_file

engine, connection = db_connect(False)
session = create_session(engine)
batch_size: int = 1000


def bulk_insert_from_application_resp(api_data, batch_size=1000):
    """
    Bulk insert planning applications from API data with conflict handling.

    Args:
        api_data: Generator yielding dictionaries containing API response data
        batch_size: Number of records to insert in each batch

    Returns:
        Dictionary containing counts of inserted and updated records
    """
    inserted_count = 0
    try:
        while True:
            # Extract the next batch of data from the generator
            # Safe handling of generators
            batch = list(itertools.islice(api_data, batch_size))
            if not batch:  # If the batch is empty, stop processing
                break

            # Convert the batch using from_api_response
            prepared_batch = [
                PlanningApplication.from_api_response(record) for record in batch
            ]
            session.bulk_save_objects(prepared_batch)
            session.commit()

            # Update counters (assumes result.rowcount reflects total processed)
            inserted_count += len(prepared_batch)

    except Exception as e:
        session.rollback()
        print(f"Error inserting: {str(e)}")
        raise e

    print(f"Processed {inserted_count} records to database")


@click.group()
def cli(): ...


@cli.command("clear", help="Clear the table")
def _clear(): ...


@cli.command(
    "sync",
    help="Sync the table with the current script",
)
def _sync():
    # Fetch all records
    all_records = fetch_planning_data_paginated()
    bulk_insert_from_application_resp(all_records)

    # Save to file
    # if all_records:
    #     save_to_file(list(all_records))


if __name__ == "__main__":
    # create_tables_orm(engine)
    cli()
