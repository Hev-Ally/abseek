from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializers
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from .models import PersonalInfo, Incident, Patient
from .serializers import PersonalInfoSerializer, IncidentSerializer, PatientSerializer

@api_view(['POST'])
def save_all_data(request):
    personal_info_serializer = PersonalInfoSerializer(data=request.data.get('personalInfo'))

    if not personal_info_serializer.is_valid():
        return Response({
            'error': 'Invalid personal info',
            'errors': personal_info_serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    personal_info = personal_info_serializer.save()

    # Attach foreign key for incident and patient data
    incident_data = request.data.get('incidentData', {})
    incident_data['personal_info'] = personal_info.id

    patient_data = request.data.get('patientData', {})
    patient_data['personal_info'] = personal_info.id

    incident_serializer = IncidentSerializer(data=incident_data)
    patient_serializer = PatientSerializer(data=patient_data)

    if incident_serializer.is_valid() and patient_serializer.is_valid():
        incident_serializer.save()
        patient_serializer.save()
        return Response({'message': 'All data saved successfully'}, status=status.HTTP_201_CREATED)

    # If either incident or patient data is invalid, delete the saved personal_info to prevent orphan data
    personal_info.delete()

    return Response({
        'error': 'Invalid incident or patient data',
        'incident_errors': incident_serializer.errors,
        'patient_errors': patient_serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializers(user).data})
    
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        if User.objects.filter(username=data['username']).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)