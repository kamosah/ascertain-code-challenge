import os
from datetime import date

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.fhir_utils import (
    load_encounters_fhir,
    load_medication_requests_fhir,
    load_patients_fhir,
    push_to_fhir_stream,
)

# Initialize FastAPI
app = FastAPI(
    title="FHIR API",
    description="An API for querying FHIR healthcare data",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data file paths - adjust if needed
DATA_DIR = os.environ.get("DATA_DIR", "data")
PATIENTS_FILE = os.path.join(DATA_DIR, "patients.json")
ENCOUNTERS_FILE = os.path.join(DATA_DIR, "encounters.json")
MEDICATION_REQUESTS_FILE = os.path.join(DATA_DIR, "medication_requests.json")

# Load data at startup
patients = load_patients_fhir(PATIENTS_FILE)
encounters = load_encounters_fhir(ENCOUNTERS_FILE)
med_requests = load_medication_requests_fhir(MEDICATION_REQUESTS_FILE)


# Define Pydantic models for response validation
class Encounter(BaseModel):
    resourceType: str
    id: str
    status: str
    period: dict
    reasonCode: list[dict] | None = None
    
class MedicationRequest(BaseModel):
    resourceType: str
    id: str 
    status: str
    medicationCodeableConcept: dict
    authoredOn: str
    intent: str
    dosageInstruction: list[dict] | None = None

class Patient(BaseModel):
    resourceType: str
    id: str
    full_name: str
    birth_date: date
    gender: str | None = None
    address: str | None = None
    phone: str | None = None
    email: str | None = None
    
class PatientWithRelated(Patient):
    encounters: list[Encounter] | None = None
    medications: list[MedicationRequest] | None = None


# Define model for FHIR resource submission
class FHIRResource(BaseModel):
    resource: dict


@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the FHIR API"}


@app.get("/patients/", response_model=list[Patient], tags=["Patients"])
async def list_patients(limit: int = 10) -> list[Patient]:
    """
    Get all patients.
    
    Parameters:
    - limit: Maximum number of patients to return (default: 10)
    """
    mapped_patients = []
    for p in patients:
        # Extract full name from name array (family name + given names)
        full_name = ""
        if p.get("name") and len(p["name"]) > 0:
            name_obj = p["name"][0]
            given_names = " ".join(name_obj.get("given", []))
            family_name = name_obj.get("family", "")
            full_name = f"{given_names} {family_name}".strip()

        # Transform to match Patient model
        mapped_patient = {
            "resourceType": p.get("resourceType", ""),
            "id": p.get("id", ""),
            "full_name": full_name,
            "birth_date": p.get("birthDate", ""),
            "gender": p.get("gender") if p.get("gender") else None,
            "address": None,  # Simplified for list view
            "phone": None,
            "email": None
        }
        mapped_patients.append(mapped_patient)

    return mapped_patients[:limit]  # Return only the requested number of patients


@app.get("/patients/{patient_id}", response_model=PatientWithRelated, tags=["Patients"])
async def get_patient_details(patient_id: str) -> PatientWithRelated:
    """
    Get details for a specific patient by ID, including related encounters and medications.
    
    Parameters:
    - patient_id: The unique identifier of the patient
    
    Returns:
    - PatientWithRelated: The patient details with related encounters and medications
    
    Raises:
    - 404: If the patient is not found
    """
    # Find the patient in our list
    patient_data = None
    for p in patients:
        if p.get("id") == patient_id:
            patient_data = p
            break
    
    # If patient not found, raise 404
    if not patient_data:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found")
    
    # Extract full name from name array (family name + given names)
    full_name = ""
    if patient_data.get("name") and len(patient_data["name"]) > 0:
        name_obj = patient_data["name"][0]
        given_names = " ".join(name_obj.get("given", []))
        family_name = name_obj.get("family", "")
        full_name = f"{given_names} {family_name}".strip()
    
    # Format address if available
    address = None
    if patient_data.get("address") and len(patient_data["address"]) > 0:
        addr = patient_data["address"][0]
        lines = addr.get("line", [])
        city = addr.get("city", "")
        state = addr.get("state", "")
        postal = addr.get("postalCode", "")
        country = addr.get("country", "")
        
        addr_parts = []
        if lines:
            addr_parts.append(", ".join(lines))
        if city:
            addr_parts.append(city)
        if state:
            addr_parts.append(state)
        if postal:
            addr_parts.append(postal)
        if country:
            addr_parts.append(country)
            
        address = ", ".join(addr_parts)
    
    # Get phone/email if available (telecom field in FHIR)
    phone = None
    email = None
    if patient_data.get("telecom"):
        for telecom in patient_data["telecom"]:
            if telecom.get("system") == "phone" and telecom.get("value"):
                phone = telecom["value"]
            elif telecom.get("system") == "email" and telecom.get("value"):
                email = telecom["value"]
    
    # Transform to match Patient model
    mapped_patient = {
        "resourceType": patient_data.get("resourceType", ""),
        "id": patient_data.get("id", ""),
        "full_name": full_name,
        "birth_date": patient_data.get("birthDate", ""),
        "gender": patient_data.get("gender") if patient_data.get("gender") else None,
        "address": address if address else None,
        "phone": phone if phone else None,
        "email": email if email else None,
        "encounters": [],
        "medications": []
    }
    
    # Find patient encounters
    patient_ref = f"Patient/{patient_id}"
    patient_encounters = []
    
    for enc in encounters:
        if enc.get("subject", {}).get("reference") == patient_ref:
            patient_encounters.append(enc)
    
    mapped_patient["encounters"] = patient_encounters
    
    # Find patient medications
    patient_medications = []
    
    for med in med_requests:
        if med.get("subject", {}).get("reference") == patient_ref:
            patient_medications.append(med)
    
    mapped_patient["medications"] = patient_medications
    
    return mapped_patient


@app.get("/patients/{patient_id}/encounters", response_model=list[Encounter], tags=["Patients"])
async def get_patient_encounters(patient_id: str) -> list[Encounter]:
    """
    Get all encounters for a specific patient by ID.
    
    Parameters:
    - patient_id: The unique identifier of the patient
    
    Returns:
    - list[Encounter]: A list of the patient's encounters
    
    Raises:
    - 404: If the patient is not found
    """
    # Check if patient exists
    patient_exists = False
    for p in patients:
        if p.get("id") == patient_id:
            patient_exists = True
            break
            
    if not patient_exists:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found")
    
    # Find patient encounters
    patient_ref = f"Patient/{patient_id}"
    patient_encounters = []
    
    for enc in encounters:
        if enc.get("subject", {}).get("reference") == patient_ref:
            patient_encounters.append(enc)
    
    return patient_encounters


@app.get("/patients/{patient_id}/medications", response_model=list[MedicationRequest], tags=["Patients"])
async def get_patient_medications(patient_id: str) -> list[MedicationRequest]:
    """
    Get all medication requests for a specific patient by ID.
    
    Parameters:
    - patient_id: The unique identifier of the patient
    
    Returns:
    - list[MedicationRequest]: A list of the patient's medication requests
    
    Raises:
    - 404: If the patient is not found
    """
    # Check if patient exists
    patient_exists = False
    for p in patients:
        if p.get("id") == patient_id:
            patient_exists = True
            break
            
    if not patient_exists:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found")
    
    # Find patient medications
    patient_ref = f"Patient/{patient_id}"
    patient_medications = []
    
    for med in med_requests:
        if med.get("subject", {}).get("reference") == patient_ref:
            patient_medications.append(med)
    
    return patient_medications


@app.post("/fhir/push", tags=["FHIR Operations"])
async def push_patient_to_fhir(resource: FHIRResource):
    """
    Push a patient record to the FHIR server.

    This endpoint accepts a FHIR resource and pushes it to the configured FHIR server.
    """
    try:
        result = push_to_fhir_stream(resource.resource)
        return {
            "status": "success",
            "message": "Resource pushed to FHIR server",
            "result": result,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to push to FHIR server: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
