from djongo import models

class Patient(models.Model):
    # Basic Info
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    chief_complaint = models.CharField(max_length=300)

    # Vital Signs
    heart_rate = models.IntegerField()          # beats per minute
    systolic_bp = models.IntegerField()         # mmHg
    spo2 = models.IntegerField()                # oxygen %, 0-100
    temperature = models.FloatField()           # Celsius
    respiratory_rate = models.IntegerField()    # breaths per minute
    gcs_score = models.IntegerField(default=15) # Glasgow Coma Scale, 3-15

    # Calculated Fields (filled automatically by the API)
    priority_score = models.IntegerField(default=0)   # 0-100
    priority_level = models.CharField(max_length=20, default='low')  # critical/high/medium/low

    # Timestamps
    admitted_at = models.DateTimeField(auto_now_add=True)  # set once on creation
    updated_at = models.DateTimeField(auto_now=True)       # updates every save

    class Meta:
        ordering = ['-priority_score']  # Always return highest priority first

    def __str__(self):
        return f"{self.name} - {self.priority_level} (Score: {self.priority_score})"