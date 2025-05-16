from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PersonalInfo, Incident, Patient

class PersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalInfo
        fields = '__all__'

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

