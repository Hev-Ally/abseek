from django.db import models
from django.contrib.auth.models import User
import string,random



def generate_unique_patient_id():
    while True:
        patient_id = 'PAT' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        if not PatientData.objects.filter(patient_id=patient_id).exists():
            return patient_id

def generate_unique_case_id():
    while True:
        case_id = 'CAS' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        if not PatientData.objects.filter(case_id=case_id).exists():
            return case_id






class PersonalInfo(models.Model):
    full_name = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    phone_number = models.CharField(max_length=15)

    email = models.EmailField()
    address = models.TextField()
    emergency_contact = models.CharField(max_length=255)

    def __str__(self):
        return self.full_name


class IncidentData(models.Model):
    case_id = models.CharField(max_length=100, unique=True, default=generate_unique_case_id)
    location = models.CharField(max_length=255)  # This is the barangay name
    ANIMAL_TYPE_CHOICES = [
    ('Dog', 'Dog'),
    ('Cat', 'Cat'),
    ('Other', 'Other'),
]

    species = models.CharField(max_length=20, choices=ANIMAL_TYPE_CHOICES)

    date_time = models.DateTimeField()
    bite_site = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.location} - {self.case_id}"


class PatientData(models.Model):
    patient_id = models.CharField(max_length=100, unique=True, default=generate_unique_patient_id)
    vaccination_status = models.CharField(max_length=100)
    vaccination_date = models.DateField()

    def __str__(self):
        return self.patient_id


# Create your models here.
