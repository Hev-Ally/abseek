from django.contrib.auth import authenticate

from rest_framework import generics
from .serializers import UserSerializer

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Count
from django.http import JsonResponse

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes

from collections import defaultdict

from .models import PersonalInfo, IncidentData, PatientData
from .serializers import (
    UserSerializer,
    PersonalInfoSerializer,
    IncidentDataSerializer,
    PatientDataSerializer,
    UserSerializers  # this seems to be a second serializer for login response, assuming different from UserSerializer
)

# Allow public registration
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


BARANGAY_COORDS = {
    "Alitao": {"lat": 13.922094, "lng": 121.479521},
    "Bagacay": {"lat": 13.915348, "lng": 121.482381},
    "Balubal": {"lat": 13.905871, "lng": 121.521045},
    "Barangay I": {"lat": 13.964352, "lng": 121.523703},
    "Antipolo": {"lat": 13.9473, "lng": 121.5732},
    "Bignay 1": {"lat": 13.9798, "lng": 121.5355},
    "Bignay 2": {"lat": 13.9857, "lng": 121.5399},
    "Bucal": {"lat": 13.9519, "lng": 121.5853},
    "Canda": {"lat": 13.9488, "lng": 121.5395},
    "Castañas": {"lat": 13.9703, "lng": 121.5591},
    "Concepcion 1": {"lat": 13.9774, "lng": 121.4852},
    "Concepcion Banahaw": {"lat": 14.0123, "lng": 121.4779},
    "Concepcion Palasan": {"lat": 13.9912, "lng": 121.4876},
    "Concepcion Pinagbakuran": {"lat": 13.9889, "lng": 121.5036},
    "Gibanga": {"lat": 13.9345, "lng": 121.5891},
    "Guisguis San Roque": {"lat": 13.9452, "lng": 121.5103},
    "Guisguis Talon": {"lat": 13.9411, "lng": 121.5061},
    "Janagdong 1": {"lat": 13.9544, "lng": 121.5047},
    "Janagdong 2": {"lat": 13.9503, "lng": 121.5001},
    "Limbon": {"lat": 13.9681, "lng": 121.5778},
    "Lutucan 1": {"lat": 13.9756, "lng": 121.5108},
    "Lutucan Bata": {"lat": 13.9715, "lng": 121.5062},
    "Lutucan Malabag": {"lat": 13.9661, "lng": 121.5453},
    "Mamala 1": {"lat": 13.9939, "lng": 121.5182},
    "Mamala 2": {"lat": 13.9985, "lng": 121.4957},
    "Manggalang 1": {"lat": 13.9317, "lng": 121.5293},
    "Manggalang Bantilan": {"lat": 13.9218, "lng": 121.5349},
    "Manggalang Kiling": {"lat": 13.9264, "lng": 121.5536},
    "Manggalang Tulo-Tulo": {"lat": 13.9372, "lng": 121.5165},
    "Montecillo": {"lat": 13.9185, "lng": 121.5472},
    "Morong": {"lat": 13.9264, "lng": 121.5536}, # Duplicate entry, keeping the first one
    "Pili": {"lat": 13.9609, "lng": 121.5414},
    "Poblacion 1": {"lat": 13.9626, "lng": 121.5222},
    "Poblacion 2": {"lat": 13.9667, "lng": 121.5267},
    "Poblacion 3": {"lat": 13.9698, "lng": 121.5298},
    "Poblacion 4": {"lat": 13.9739, "lng": 121.5339},
    "Poblacion 5": {"lat": 13.9782, "lng": 121.5261},
    "Poblacion 6": {"lat": 13.9831, "lng": 121.4921},
    "Sampaloc 1": {"lat": 13.9561, "lng": 121.5171},
    "Sampaloc 2": {"lat": 13.9520, "lng": 121.5130},
    "Sampaloc Bogon": {"lat": 13.9433, "lng": 121.5237},
    "Santo Cristo": {"lat": 13.9782, "lng": 121.5261}, # Duplicate entry, keeping the first one
    "Talaan Aplaya": {"lat": 13.9358, "lng": 121.5061},
    "Talaan Pantoc": {"lat": 13.9389, "lng": 121.5442},
    "Tumbaga 1": {"lat": 13.9433, "lng": 121.5237}, # Duplicate entry, keeping the first one
    "Tumbaga 2": {"lat": 13.9474, "lng": 121.5278}
}

# def heatmap_data(request):
#     # Count incidents by barangay
#     incident_counts = defaultdict(int)
#     for incident in IncidentData.objects.all():
#         incident_counts[incident.location] += 1

#     # Format response with coordinates
#     result = []
#     for barangay, count in incident_counts.items():
#         coords = BARANGAY_COORDS.get(barangay)
#         if coords:
#             lat, lng = coords
#             result.append({
#                 "barangay": barangay,
#                 "count": count,
#                 "lat": lat,
#                 "lng": lng
#             })

#     return JsonResponse(result, safe=False)

# class SaveDataView(APIView):
#     def post(self, request, *args, **kwargs):
#         personal_info_data = request.data.get('personalInfo')
#         incident_data = request.data.get('incidentData')
#         patient_data = request.data.get('patientData')

#         # Validate and save Personal Info
#         personal_serializer = PersonalInfoSerializer(data=personal_info_data)
#         if not personal_serializer.is_valid():
#             return Response(personal_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         personal_serializer.save()

#         # Validate and save Incident Data
#         incident_serializer = IncidentDataSerializer(data=incident_data)
#         if not incident_serializer.is_valid():
#             return Response(incident_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         incident_serializer.save()

#         # Validate and save Patient Data
#         patient_serializer = PatientDataSerializer(data=patient_data)
#         if not patient_serializer.is_valid():
#             return Response(patient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         patient_serializer.save()

#         return Response({"message": "Data saved successfully"}, status=status.HTTP_201_CREATED)
    
class BarangayHeatmapData(APIView):
    def get(self, request):
        # Get counts by barangay and species
        incident_data = IncidentData.objects.values('location', 'species').annotate(count=Count('id'))
        
        # Group by barangay
        barangay_data = defaultdict(lambda: {'total_count': 0, 'animals': defaultdict(int)})
        
        for entry in incident_data:
            barangay = entry['location']
            species = entry['species']
            count = entry['count']
            
            barangay_data[barangay]['total_count'] += count
            barangay_data[barangay]['animals'][species] += count
        
        # Format response with coordinates and animal breakdown
        data = []
        for barangay, info in barangay_data.items():
            coords = BARANGAY_COORDS.get(barangay)
            if coords:
                # Convert defaultdict to regular dict for JSON serialization
                animals_dict = dict(info['animals'])
                
                data.append({
                    'barangay': barangay,
                    'lat': coords['lat'],
                    'lng': coords['lng'],
                    'count': info['total_count'],
                    'animals': animals_dict,
                    # Add animal breakdown as a formatted string for display
                    'animal_breakdown': ', '.join([f"{animal}: {count}" for animal, count in animals_dict.items()])
                })
        
        return Response(data)

# Alternative view that provides more detailed statistics
class DetailedBarangayStats(APIView):
    def get(self, request):
        # Get all incidents with related info
        incidents = IncidentData.objects.select_related().values(
            'location', 'species', 'date_time', 'bite_site'
        )
        
        # Group by barangay
        barangay_stats = defaultdict(lambda: {
            'total_cases': 0,
            'animals': defaultdict(int),
            'recent_incidents': []
        })
        
        for incident in incidents:
            barangay = incident['location']
            species = incident['species']
            
            barangay_stats[barangay]['total_cases'] += 1
            barangay_stats[barangay]['animals'][species] += 1
            
            # Keep track of recent incidents (you can limit this)
            barangay_stats[barangay]['recent_incidents'].append({
                'species': species,
                'date': incident['date_time'].strftime('%Y-%m-%d'),
                'bite_site': incident['bite_site']
            })
        
        # Format response
        data = []
        for barangay, stats in barangay_stats.items():
            coords = BARANGAY_COORDS.get(barangay)
            if coords:
                data.append({
                    'barangay': barangay,
                    'lat': coords['lat'],
                    'lng': coords['lng'],
                    'total_cases': stats['total_cases'],
                    'animals': dict(stats['animals']),
                    'recent_incidents': stats['recent_incidents'][:5]  # Limit to 5 most recent
                })
        
        return Response(data)
    
    

@api_view(['POST'])
@permission_classes([AllowAny])
def save_all_data(request):
    # permission_classes = [AllowAny]
    try:
        # if not request.user.is_staff:
        #     return Response({"error": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)
        personal_info_data = request.data.get('personalInfo')
        incident_data = request.data.get('incidentData')
        patient_data = request.data.get('patientData')

        if not personal_info_data or not incident_data or not patient_data:
            return Response({'error': 'Missing data in request'}, status=status.HTTP_400_BAD_REQUEST)

        personal_info_serializer = PersonalInfoSerializer(data=personal_info_data)
        if not personal_info_serializer.is_valid():
            return Response({
                'error': 'Invalid personal info',
                'errors': personal_info_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        personal_info = personal_info_serializer.save()

        # Attach foreign key
        incident_data['personal_info'] = personal_info.id
        patient_data['personal_info'] = personal_info.id

        # Create serializers
        incident_serializer = IncidentDataSerializer(data=incident_data)
        patient_serializer = PatientDataSerializer(data=patient_data)

        incident_valid = incident_serializer.is_valid()
        patient_valid = patient_serializer.is_valid()

        if incident_valid and patient_valid:
            incident_serializer.save()
            patient_serializer.save()
            return Response({'message': 'All data saved successfully'}, status=status.HTTP_201_CREATED)

        # Rollback personal_info if others fail
        personal_info.delete()

        return Response({
            'error': 'Invalid incident or patient data',
            'incident_errors': incident_serializer.errors if not incident_valid else {},
            'patient_errors': patient_serializer.errors if not patient_valid else {}
        }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Login view with token response
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializers(user).data})

# Registration endpoint
class RegisterView(APIView):
    # permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({
                'message': 'User registered successfully',
                'token': token.key,
                'user': UserSerializers(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)