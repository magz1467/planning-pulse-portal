import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import * as d3 from 'https://cdn.skypack.dev/d3@7'
import { geoMercator } from 'https://cdn.skypack.dev/d3-geo@3'
import { createCanvas } from 'https://deno.land/x/canvas/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Application {
  application_id: number
  centroid: { lat: number; lon: number }
  description: string
  impact_score: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { applications } = await req.json()
    console.log('Generating visualizations for applications:', applications)

    const results = []

    for (const app of applications.slice(0, 10)) {
      // Basic Map Visualization
      const mapViz = await generateMapVisualization(app)
      
      // Impact Visualization  
      const impactViz = await generateImpactVisualization(app)
      
      // Development Type Visualization
      const devTypeViz = await generateDevTypeVisualization(app)

      results.push({
        application_id: app.application_id,
        visualizations: {
          map: mapViz,
          impact: impactViz, 
          development: devTypeViz
        }
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        visualizations: results 
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error generating visualizations:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})

async function generateMapVisualization(app: Application) {
  const width = 600
  const height = 400
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  // Create base map
  const projection = geoMercator()
    .center([app.centroid.lon, app.centroid.lat])
    .scale(300000)
    .translate([width / 2, height / 2])

  // Add background
  context.fillStyle = '#f8fafc'
  context.fillRect(0, 0, width, height)

  // Draw application location
  const [x, y] = projection([app.centroid.lon, app.centroid.lat])
  context.beginPath()
  context.arc(x, y, 8, 0, 2 * Math.PI)
  context.fillStyle = '#ef4444'
  context.fill()
  context.strokeStyle = '#ffffff'
  context.lineWidth = 2
  context.stroke()

  return canvas.toDataURL()
}

async function generateImpactVisualization(app: Application) {
  const width = 600
  const height = 400
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  // Background
  context.fillStyle = '#f8fafc'
  context.fillRect(0, 0, width, height)

  // Impact radius circles
  const center = { x: width/2, y: height/2 }
  const impactScore = app.impact_score || 50
  const maxRadius = Math.min(width, height) * 0.4
  
  // Draw concentric circles
  const circles = 3
  for (let i = circles; i > 0; i--) {
    const radius = (maxRadius / circles) * i
    const alpha = 0.2 - (i * 0.05)
    
    context.beginPath()
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI)
    context.fillStyle = `rgba(239, 68, 68, ${alpha})`
    context.fill()
  }

  // Center point
  context.beginPath()
  context.arc(center.x, center.y, 8, 0, 2 * Math.PI)
  context.fillStyle = '#ef4444'
  context.fill()
  context.strokeStyle = '#ffffff'
  context.lineWidth = 2
  context.stroke()

  return canvas.toDataURL()
}

async function generateDevTypeVisualization(app: Application) {
  const width = 600
  const height = 400
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  // Background
  context.fillStyle = '#f8fafc'
  context.fillRect(0, 0, width, height)

  // Simple building outline based on description
  const buildingHeight = height * 0.6
  const buildingWidth = width * 0.4
  const x = (width - buildingWidth) / 2
  const y = height - buildingHeight

  // Building shape
  context.beginPath()
  context.rect(x, y, buildingWidth, buildingHeight)
  context.fillStyle = '#ef4444'
  context.fill()
  context.strokeStyle = '#ffffff'
  context.lineWidth = 2
  context.stroke()

  // Roof
  context.beginPath()
  context.moveTo(x - 20, y)
  context.lineTo(x + buildingWidth/2, y - 40)
  context.lineTo(x + buildingWidth + 20, y)
  context.fillStyle = '#dc2626'
  context.fill()
  context.strokeStyle = '#ffffff'
  context.stroke()

  return canvas.toDataURL()
}