from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Patient
from .serializers import PatientSerializer
from .priority import calculate_priority_score, score_to_priority_level


# GET all patients / POST a new patient
class PatientListView(APIView):

    def get(self, request):
        """Returns all patients sorted by priority score (highest first)."""
        patients = Patient.objects.all()

        # Optional filter by priority level: /api/patients/?priority=critical
        priority_filter = request.query_params.get('priority')
        if priority_filter:
            patients = patients.filter(priority_level=priority_filter)

        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Admits a new patient. Calculates priority automatically."""
        serializer = PatientSerializer(data=request.data)

        if serializer.is_valid():
            # Calculate priority score before saving
            vitals = {
                'heart_rate': request.data.get('heart_rate'),
                'systolic_bp': request.data.get('systolic_bp'),
                'spo2': request.data.get('spo2'),
                'temperature': request.data.get('temperature'),
                'respiratory_rate': request.data.get('respiratory_rate'),
                'gcs_score': request.data.get('gcs_score', 15),
            }
            score = calculate_priority_score(vitals)
            level = score_to_priority_level(score)

            # Save with the calculated values
            serializer.save(priority_score=score, priority_level=level)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# GET one patient / PUT (update) / DELETE
class PatientDetailView(APIView):

    def get_object(self, pk):
        """Helper to find a patient by ID."""
        try:
            return Patient.objects.get(pk=pk)
        except Patient.DoesNotExist:
            return None

    def get(self, request, pk):
        """Get a single patient's full details."""
        patient = self.get_object(pk)
        if not patient:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    def put(self, request, pk):
        """Update a patient's vitals. Recalculates priority automatically."""
        patient = self.get_object(pk)
        if not patient:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PatientSerializer(patient, data=request.data, partial=True)

        if serializer.is_valid():
            # Recalculate priority with new vitals
            vitals = {
                'heart_rate': request.data.get('heart_rate', patient.heart_rate),
                'systolic_bp': request.data.get('systolic_bp', patient.systolic_bp),
                'spo2': request.data.get('spo2', patient.spo2),
                'temperature': request.data.get('temperature', patient.temperature),
                'respiratory_rate': request.data.get('respiratory_rate', patient.respiratory_rate),
                'gcs_score': request.data.get('gcs_score', patient.gcs_score),
            }
            score = calculate_priority_score(vitals)
            level = score_to_priority_level(score)

            serializer.save(priority_score=score, priority_level=level)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Remove a patient from the queue."""
        patient = self.get_object(pk)
        if not patient:
            return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

        patient.delete()
        return Response({'message': 'Patient discharged'}, status=status.HTTP_204_NO_CONTENT)