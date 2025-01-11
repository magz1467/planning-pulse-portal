import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    })
  }

  try {
    console.log('Starting to fetch mock data...')
    
    // Mock data representing planning applications in London
    const mockData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "1",
          geometry: {
            type: "Point",
            coordinates: [-0.1278, 51.5074]
          },
          properties: {
            application_reference: "2024/001",
            description: "Construction of a new residential building",
            status: "Under Consideration",
            submission_date: "2024-01-01",
            decision_date: null,
            address: "123 Mock Street, London",
            ward: "City of London",
            consultation_end_date: "2024-03-01",
            application_type: "Full Planning Permission",
            applicant_name: "Mock Developer Ltd"
          }
        },
        {
          type: "Feature",
          id: "2",
          geometry: {
            type: "Point",
            coordinates: [-0.1243, 51.5033]
          },
          properties: {
            application_reference: "2024/002",
            description: "Change of use from office to residential",
            status: "Approved",
            submission_date: "2024-01-02",
            decision_date: "2024-01-15",
            address: "456 Test Road, London",
            ward: "Westminster",
            consultation_end_date: "2024-02-28",
            application_type: "Change of Use",
            applicant_name: "Test Developments Ltd"
          }
        }
      ],
      success: true
    };

    return new Response(
      JSON.stringify(mockData), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        features: [] // Return empty features array for graceful degradation
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 to allow client to handle the error
      }
    )
  }
})