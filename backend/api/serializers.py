from rest_framework import serializers
from .models import User, Role, Course, Module, Lesson, Enrollment, Assignment, Submission, Quiz, Result

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.SerializerMethodField()
    role = serializers.CharField(write_only=True, required=False) # Accept role name (e.g., 'Student')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'role_name', 'bio', 'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_role_name(self, obj):
        return obj.role.name if obj.role else None

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        role_name = validated_data.pop('role', 'Student') # Default to Student
        
        # Get or create role
        role_instance, created = Role.objects.get_or_create(name=role_name)
        
        instance = self.Meta.model(**validated_data)
        instance.role = role_instance
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = Module
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    class Meta:
        model = Course
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'
