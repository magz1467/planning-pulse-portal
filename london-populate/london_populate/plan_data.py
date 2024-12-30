import requests
import json
from typing import List, Dict, Any


def fetch_planning_data_paginated(size: int = 100) -> List[Dict[Any, Any]]:
    """
    Fetch all planning data using pagination.
    Args:
        size: Number of records per page (default 100)
    Returns:
        List of all planning records
    """
    url = "https://planningdata.london.gov.uk/api-guest/applications/_search"

    headers = {"X-API-AllowRequest": "be2rmRnt&", "Content-Type": "application/json"}

    # Initialize variables
    all_records = []
    search_after = None
    total_fetched = 0

    while True:
        # Construct the query
        payload = {
            "size": size,
            "sort": [
                {"_id": "asc"}  # Sort by ID to ensure consistent pagination
            ],
            "query": {
                "bool": {
                    "must": [
                        {"exists": {"field": "centroid"}},
                        {"range": {"valid_date": {"gte": "01/01/2024"}}},
                    ]
                }
            },
            # "_
            #     "lpa_name",
            #     "lpa_app_no",
            #     "last_updated",
            #     "valid_date",
            #     "decision_date",
            #     "id",
            #     "application_type",
            # ],
        }

        # Add search_after for pagination if we're not on the first page
        if search_after:
            payload["search_after"] = search_after

        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()

            # Get the hits from the response
            hits = data.get("hits", {}).get("hits", [])

            # If no more hits, break the loop
            if not hits:
                break

            # Add the records to our collection
            all_records.extend([hit["_source"] for hit in hits])

            # Update total fetched
            total_fetched += len(hits)
            print(f"Fetched {total_fetched} records...")

            # Get the sort values of the last record for the next iteration
            print(hits[-1])
            search_after = hits[-1]["sort"]
            if total_fetched > 10:
                print("Fetched 10")
                return all_records

        except requests.exceptions.RequestException as e:
            print(f"Error making request: {e}")
            break

    print(f"Completed fetching {len(all_records)} total records")
    return all_records


