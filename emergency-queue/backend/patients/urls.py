from django.urls import path
from . import views

urlpatterns = [
    path('patients/', views.PatientListView.as_view()),        # GET all, POST new
    path('patients/<int:pk>/', views.PatientDetailView.as_view()),  # GET/PUT/DELETE one
]