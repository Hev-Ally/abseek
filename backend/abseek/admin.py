from django.contrib import admin
from .models import PatientData, IncidentData, PersonalInfo

# Register your models here.
admin.site.register(PatientData)
admin.site.register(IncidentData)
admin.site.register(PersonalInfo)