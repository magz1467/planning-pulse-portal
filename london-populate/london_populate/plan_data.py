import requests
from typing import Any
from typing import Generator

SOURCES = [
    "lpa_name",
    "lpa_app_no",
    "last_updated",
    "valid_date",
    "decision_date",
    "id",
    "application_type",
]

URL = "https://planningdata.london.gov.uk/api-guest/applications/_search"

HEADERS = {"X-API-AllowRequest": "be2rmRnt&",
           "Content-Type": "application/json"}


def fetch_planning_data_paginated(size: int = 100) -> Generator[Any, Any, Any]:
    """
    Fetch all planning data using pagination.
    Args:
        size: Number of records per page (default 100)
    Returns:
        List of all planning records
    """

    search_after = None
    total_fetched = 0

    while True:
        # Construct the query
        payload = {
            "size": size,
            "sort": [
                # Sort by ID to ensure consistent pagination
                {"_id": "asc"}
            ],
            "query": {
                "bool": {
                    "must": [
                        # must have centroid new schema location value
                        {"exists": {"field": "centroid"}},
                        # set valid_date for a little filter
                        {"range": {"valid_date": {"gte": "01/01/2023"}}},
                    ]
                }
            },
        }

        # Add search_after for pagination if we're not on the first page
        if search_after:
            payload["search_after"] = search_after

        try:
            print(f"Making request to {URL} with payload: {payload}")
            response = requests.post(URL, headers=HEADERS, json=payload)
            response.raise_for_status()
            data = response.json()
            print(f"Response status: {response.status_code}")
            print(f"Response data: {data}")

            # Get the hits from the response
            hits = data.get("hits", {}).get("hits", [])

            # If no more hits, break the loop
            if not hits:
                print("No more hits found, breaking loop")
                break

            # yield records
            yield from (hit["_source"] for hit in hits)

            # Update total fetched
            total_fetched += len(hits)
            print(f"Fetched {total_fetched} records...")

            # Get the sort values of the last record for the next iteration
            search_after = hits[-1]["sort"]
        except requests.exceptions.RequestException as e:
            print(f"Error making request: {e}")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")
            break

    print(f"Completed fetching {total_fetched} total records")