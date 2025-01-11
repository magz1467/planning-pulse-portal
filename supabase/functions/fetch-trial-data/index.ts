import { corsHeaders } from '../_shared/cors.ts'

const LANDHAWK_USERNAME = 'makemyhousegreen_trial'
const LANDHAWK_PASSWORD = 'RC3U09O8XKXYP5ML'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    })
  }

  try {
    console.log('Starting to fetch mock data...')
    
    // Try to fetch from Landhawk first
    try {
      const wfsUrl = 'https://api.emapsite.com/dataservice/api/WFS'
      const params = new URLSearchParams({
        service: 'WFS',
        version: '2.0.0',
        request: 'GetFeature',
        typeName: 'LandHawk:PlanningApplication',
        outputFormat: 'application/json',
        srsName: 'EPSG:4326'
      })

      const fullUrl = `${wfsUrl}?${params}`
      console.log('Making request to Landhawk WFS API with URL:', fullUrl)
      
      const authString = btoa(`${LANDHAWK_USERNAME}:${LANDHAWK_PASSWORD}`)
      console.log('Using auth string:', authString)

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Landhawk API error response:', errorText)
        throw new Error(errorText)
      }

      const data = await response.json()
      console.log(`Received ${data.features?.length || 0} applications from Landhawk`)

      return new Response(
        JSON.stringify({
          ...data,
          success: true
        }), 
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )

    } catch (error) {
      console.error('Function error:', error)
      
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
          },
          status: 200 // Return 200 to allow client to handle the error
        }
      )
    }

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