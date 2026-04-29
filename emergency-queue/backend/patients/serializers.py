from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'   # Include every field
        read_only_fields = ['priority_score', 'priority_level', 'admitted_at', 'updated_at']
        # ↑ These are calculated/set automatically, not sent by the user