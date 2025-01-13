import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { calculateDistance } from "./distance";

export const transformApplicationData = (app: any, center?: LatLngTuple): Application | null => {
  if (!app) return null;

  try {
    const coordinates: [number, number] | undefined = app.centroid ? [
      app.centroid.lat || 0,
      app.centroid.lon || 0
    ] : undefined;

    let distance = 'N/A';
    if (center && coordinates) {
      const distanceValue = calculateDistance(coordinates[0], coordinates[1], center[0], center[1]);
      distance = typeof distanceValue === 'number' ? `${distanceValue.toFixed(1)} km` : 'N/A';
    }

    return {
      id: app.id,
      application_id: app.application_id,
      title: app.ai_title || app.title,
      address: `${[app.site_name, app.street_name, app.locality, app.postcode].filter(Boolean).join(', ')}`,
      status: app.status || 'Unknown',
      distance,
      reference: app.lpa_app_no,
      description: app.description,
      applicant: app.applicant,
      submissionDate: app.valid_date,
      decisionDue: app.decision_target_date,
      type: app.application_type,
      ward: app.ward,
      officer: app.officer,
      consultationEnd: app.last_date_consultation_comments,
      image: app.image_url,
      coordinates,
      ai_title: app.ai_title,
      postcode: app.postcode,
      impact_score: app.impact_score,
      impact_score_details: app.impact_score_details,
      image_map_url: app.image_map_url,
      last_date_consultation_comments: app.last_date_consultation_comments,
      valid_date: app.valid_date,
      centroid: app.centroid,
      impacted_services: app.impacted_services,
      application_type_full: app.application_type_full,
      class_3: app.class_3,
      image_link: app.image_link
    };
  } catch (error) {
    console.error('Error transforming application data:', error);
    return null;
  }
}