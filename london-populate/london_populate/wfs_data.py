from owslib.wfs import WebFeatureService
from typing import Generator, Any
import json

def fetch_wfs_data() -> Generator[Any, Any, Any]:
    """
    Fetch planning data using WFS.
    Returns:
        Generator yielding dictionaries containing WFS response data
    """
    # WFS endpoint
    url = 'https://api.landhawk.uk/wfs'
    
    try:
        # Initialize WFS client
        wfs = WebFeatureService(url=url, version='2.0.0')
        
        # Get feature data
        response = wfs.getfeature(
            typename='landhawk:planning_applications',
            bbox=(51.28,-0.51,51.69,0.33),  # London bounding box
            srsname='EPSG:4326',
            outputFormat='json'
        )
        
        # Parse response
        data = json.loads(response.read().decode('utf-8'))
        
        # Yield features
        for feature in data['features']:
            # Transform WFS data to match your table schema
            transformed = {
                'application_reference': feature['properties'].get('reference'),
                'description': feature['properties'].get('description'),
                'status': feature['properties'].get('status'),
                'decision_date': feature['properties'].get('decision_date'),
                'submission_date': feature['properties'].get('received_date'),
                'location': feature.get('geometry'),
                'raw_data': feature,
                'source_url': url,
                'address': feature['properties'].get('address'),
                'url': feature['properties'].get('url'),
                'ward': feature['properties'].get('ward'),
                'consultation_end_date': feature['properties'].get('consultation_end'),
                'decision_details': feature['properties'].get('decision_details'),
                'application_type': feature['properties'].get('type'),
                'applicant_name': feature['properties'].get('applicant'),
                'agent_details': feature['properties'].get('agent'),
                'constraints': feature['properties'].get('constraints')
            }
            yield transformed
            
    except Exception as e:
        print(f"Error fetching WFS data: {str(e)}")