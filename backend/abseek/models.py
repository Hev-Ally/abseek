from django.db import models

class PersonalInfo(models.Model):
    full_name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    emergency_contact = models.CharField(max_length=100)

class Incident(models.Model):
    case_id = models.CharField(max_length=50, unique=True)
    location = models.CharField(max_length=255)
    species = models.CharField(max_length=100)
    date_time = models.DateTimeField()
    bite_site = models.CharField(max_length=100)
    personal_info = models.ForeignKey(PersonalInfo, on_delete=models.CASCADE)

class Patient(models.Model):
    patient_id = models.CharField(max_length=50, unique=True)
    vaccination_status = models.CharField(max_length=50)
    vaccination_date = models.DateField()
    personal_info = models.ForeignKey(PersonalInfo, on_delete=models.CASCADE)

# Create your models here.
