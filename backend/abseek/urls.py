from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView
from . import views
from .views import BarangayHeatmapData
from .views import save_all_data

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('save-data/', save_all_data, name='save-data'),
    path('heatmap/', BarangayHeatmapData.as_view(), name='barangay-heatmap'),
    # path('save-data/', SaveDataView.as_view(), name='save-data'),
    # path('api/heatmap/', heatmap_data, name='heatmap-data'),
]

