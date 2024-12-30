import json

from sqlalchemy import (
    JSON,
    TEXT,
    Column,
    Integer,
    MetaData,
    String,
)
from sqlalchemy.types import TypeDecorator
from geoalchemy2 import Geometry
from sqlalchemy import MetaData
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import delete

metadata = MetaData()
Base = declarative_base()


def query_all(session):
    result = session.query(PlanningApplication)
    print(result.all())


class FlexibleType(TypeDecorator):
    impl = String

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, list):
            return json.dumps(value)
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        try:
            return json.loads(value)
        except:
            return value


class PlanningApplication(Base):
    __tablename__ = "applications"

    # Primary key
    application_id = Column(Integer, primary_key=True, autoincrement=True)

    # Original ID from API (now unique but not primary key)
    id = Column(String(255), unique=True, nullable=False)

    # Basic application details
    lpa_app_no = Column(String(255))
    lpa_name = Column(String(255))
    application_type = Column(String(255))
    application_type_full = Column(String(255))
    status = Column(String(255))
    description = Column(TEXT)
    bo_system = Column(String(255))

    # Dates
    valid_date = Column(String(255))
    decision_date = Column(String(255))
    decision_target_date = Column(String(255))
    last_updated = Column(String(255))
    last_synced = Column(String(255))
    last_date_consultation_comments = Column(String(255))
    lapsed_date = Column(String(255))
    actual_commencement_date = Column(String(255))
    actual_completion_date = Column(String(255))
    date_building_work_started_under_previous_permission = Column(String(255))
    date_building_work_completed_under_previous_permission = Column(
        String(255))

    # Location details
    borough = Column(String(255))
    ward = Column(String(255))
    site_name = Column(String(255))
    site_number = Column(String(255))
    street_name = Column(String(255))
    secondary_street_name = Column(String(255))
    locality = Column(String(255))
    postcode = Column(String(20))

    # Spatial data
    centroid_easting = Column(String(255))
    centroid_northing = Column(String(255))
    centroid = Column(JSON)
    polygon = Column(JSON)
    wgs84_polygon = Column(JSON)

    # Reference numbers and IDs
    pp_id = Column(String(255))
    uprn = Column(String(255))
    epc_number = Column(String(255))
    # Custom type to handle both string and list
    title_number = Column(FlexibleType)
    reference_no_of_permission_being_relied_on = Column(String(255))

    # Decision related
    decision = Column(String(255))
    decision_process = Column(String(255))
    decision_agency = Column(String(255))
    # Store as JSON to handle both list and null
    decision_conditions = Column(JSON)

    # Appeal related
    appeal_status = Column(String(255))
    appeal_decision = Column(String(255))
    appeal_decision_date = Column(String(255))
    appeal_start_date = Column(String(255))

    # Additional details
    development_type = Column(String(255))
    subdivision_of_building = Column(TEXT)
    parking_details = Column(JSON)
    application_details = Column(JSON)
    url_planning_app = Column(TEXT)
    cil_liability = Column(String(255))
    last_updated_by = Column(String(255))

    # PostGIS geometry column
    geom = Column(Geometry(geometry_type="POINT", srid=4326))

    def __repr__(self):
        return f"<PlanningApplication(id={self.id}, lpa_app_no={self.lpa_app_no})>"

    @classmethod
    def from_api_response(cls, data):
        """
        Create a PlanningApplication instance from API response data
        """

        def truncate_strings(value):
            """Recursively truncate string values to 1000 characters."""
            if isinstance(value, str):  # If the value is a string, truncate it
                return value[:1000]
            elif isinstance(
                value, dict
            ):  # If it's a dictionary, recurse through its items
                return {key: truncate_strings(val) for key, val in value.items()}
            elif isinstance(value, list):  # If it's a list, recurse through each item
                return [truncate_strings(item) for item in value]
            else:
                return (
                    value  # Return the value as is if it's not a string, dict, or list
                )

        # Truncate the `id` field to ensure it's within the 255 character limit
        if "id" in data and isinstance(data["id"], str):
            data["id"] = data["id"][:255]

        # Recursively truncate all other strings in the data
        # Handle geom explicitly from centroid if available
        data = truncate_strings(data)

        if "centroid" in data:
            try:
                centroid = data["centroid"]
                lat = centroid.get("lat")
                lon = centroid.get("lon")
                if lat is not None and lon is not None:
                    data["geom"] = f"SRID=4326;POINT({lon} {lat})"
            except (json.JSONDecodeError, TypeError, KeyError) as e:
                data["geom"] = None
                raise e

        return cls(**data)


def create_tables(engine):
    print("Creating tables")
    # metadata.drop_all(engine, checkfirst=True)
    metadata.create_all(engine, checkfirst=True)


def create_tables_orm(engine):
    print("Creating tables orm")
    # Base.metadata.drop_all(engine, checkfirst=True)
    Base.metadata.create_all(engine, checkfirst=True)


def delete_tables_orm(session):
    stmt = delete(PlanningApplication)
    session.execute(stmt)
    session.commit()
