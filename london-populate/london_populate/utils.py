import json
from typing import List, Dict, Any


def save_to_file(
    records: List[Dict[Any, Any]], filename: str = "planning_data.json"
) -> None:
    """
    Save the fetched records to a JSON file.
    Args:
        records: List of planning records
        filename: Output filename (default: 'planning_data.json')
    """
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
    print(f"Saved {len(records)} records to {filename}")
