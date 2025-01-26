import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import VectorTile from '@mapbox/vector-tile'
import Protobuf from 'pbf'
import * as turf from 'https://cdn.skypack.dev/@turf/turf?dts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Extract z, x, y from URL path
    const url = new URL(req.url)
    const parts = url.pathname.split('/')
    const z = parts[parts.length - 3]
    const x = parts[parts.length - 2]
    const y = parts[parts.length - 1]

    if (!z || !x || !y) {
      console.error('Invalid tile coordinates:', { z, x, y })
      throw new Error('Invalid tile coordinates')
    }

    console.log(`Fetching MVT tile: z=${z}, x=${x}, y=${y}`)

    // Construct Searchland MVT URL with explicit point geometry and forced simplification
    const searchlandUrl = `https://api.searchland.co.uk/v1/maps/mvt/planning_applications/${z}/${x}/${y}?geometry_type=point&simplify=true&force_point=true`

    console.log('Requesting from Searchland:', searchlandUrl)

    // Forward request to Searchland with detailed error handling
    const response = await fetch(searchlandUrl, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SEARCHLAND_API_KEY')}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Searchland API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Searchland API error: ${response.status} - ${errorText}`)
    }

    // Get the MVT binary data
    const mvtBuffer = await response.arrayBuffer()
    
    // Parse the vector tile
    const tile = new VectorTile(new Protobuf(mvtBuffer))
    
    // Log tile layers and features for debugging
    Object.keys(tile.layers).forEach(layerName => {
      const layer = tile.layers[layerName]
      console.log(`Layer: ${layerName}, features: ${layer.length}`)
      
      // Inspect feature types
      for (let i = 0; i < layer.length; i++) {
        const feature = layer.feature(i)
        console.log(`Feature ${i} type: ${feature.type}`)
        
        // Convert type 4 (MULTIPOINT) to type 1 (POINT)
        if (feature.type === 4) {
          // Take first point of multipoint
          const geometry = feature.loadGeometry()
          if (geometry && geometry.length > 0 && geometry[0].length > 0) {
            feature.type = 1
            feature.geometry = [geometry[0][0]]
          }
        }

        // Convert MultiPolygon to Polygon if needed
        if (feature.type === "MultiPolygon") {
          try {
            const geojson = feature.toGeoJSON()
            const flattened = turf.flatten(geojson)
            // Take the first polygon if multiple exist
            if (flattened.features.length > 0) {
              const polygon = flattened.features[0]
              feature.geometry = polygon.geometry.coordinates
              feature.type = "Polygon"
            }
          } catch (error) {
            console.error('Error converting MultiPolygon:', error)
          }
        }
      }
    })

    // Log successful response with details
    console.log(`Successfully processed tile z=${z}/x=${x}/y=${y}:`, {
      size: mvtBuffer.byteLength,
      contentType: response.headers.get('content-type'),
      status: response.status
    })

    return new Response(mvtBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/x-protobuf',
      },
    })
  } catch (error) {
    console.error('Error processing MVT request:', {
      error: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Error processing vector tile request'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})