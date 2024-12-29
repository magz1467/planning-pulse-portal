import requests
import json


def fetch_planning_data():
    url = "https://planningdata.london.gov.uk/api-guest/applications/_search"

    headers = {"X-API-AllowRequest": "be2rmRnt&", "Content-Type": "application/json"}

    payload = {
        # "query": {"bool": {"must": [{"range": {"valid_date": {"gte": "01/01/2001"}}}]}},
        "_source": [
            "lpa_name",
            # "lpa_app_no",
            # "last_updated",
            # "valid_date",
            # "decision_date",
            # "id",
            # "application_type",
        ],
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx, 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")
        return None


# Execute the request
if __name__ == "__main__":
    result = fetch_planning_data()
    if result:
        print(json.dumps(result, indent=2))
        # keys = result["hits"]["hits"][0]["_source"].keys()
        # print(keys)
