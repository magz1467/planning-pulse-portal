import json

from sqlalchemy import (
    JSON,
    Column,
    Integer,
    MetaData,
    String,
)
from sqlalchemy.types import TypeDecorator
from geoalchemy2 import Geometry
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from sqlalchemy import MetaData, create_engine
from sqlalchemy.ext.declarative import declarative_base

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
    __tablename__ = "planning_applications"

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
    description = Column(String(1000))
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
    date_building_work_completed_under_previous_permission = Column(String(255))

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
    subdivision_of_building = Column(String(255))
    parking_details = Column(JSON)
    application_details = Column(JSON)
    url_planning_app = Column(String(1000))
    cil_liability = Column(String(255))
    last_updated_by = Column(String(255))

    # PostGIS geometry column
    geom = Column(Geometry(geometry_type="POINT", srid=4326))

    @hybrid_property
    def centroid_as_geom(self):
        """
        Returns the centroid as a PostGIS POINT geometry object.
        """
        if self.centroid:
            try:
                centroid = json.loads(self.centroid)
                lat = centroid.get("lat")
                lng = centroid.get("lng")
                if lat is not None and lng is not None:
                    return f"SRID=4326;POINT({lng} {lat})"
            except (json.JSONDecodeError, TypeError, KeyError):
                pass
        return None

    @validates("centroid")
    def validate_centroid(self, key, value):
        """
        Validates the centroid JSON field and updates the geom column.
        """
        if value:
            try:
                centroid = json.loads(value)
                lat = centroid.get("lat")
                lng = centroid.get("lng")
                if lat is not None and lng is not None:
                    self.geom = f"SRID=4326;POINT({lng} {lat})"
            except (json.JSONDecodeError, TypeError, KeyError):
                self.geom = None
        return value

    def __repr__(self):
        return f"<PlanningApplication(id={self.id}, lpa_app_no={self.lpa_app_no})>"

    @classmethod
    def from_api_response(cls, data):
        """
        Create a PlanningApplication instance from API response data
        """
        # Convert any nested dictionaries to JSON strings
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                data[key] = json.dumps(value)

        return cls(**data)


def create_tables(engine):
    print("Creating tables")
    # metadata.drop_all(engine, checkfirst=True)
    metadata.create_all(engine, checkfirst=True)


def create_tables_orm(engine):
    print("Creating tables orm")
    # Base.metadata.drop_all(engine, checkfirst=True)
    Base.metadata.create_all(engine, checkfirst=True)
