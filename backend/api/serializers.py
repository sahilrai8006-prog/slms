from rest_framework import serializers
from .models import User, Role, Course, Module, Lesson, Enrollment, Assignment, Submission, Quiz, Result, LessonCompletion, Announcement, Comment, Certificate

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.SerializerMethodField()
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'role', 'role_name', 'bio', 'profile_picture', 'date_joined']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_role_name(self, obj):
        return obj.role.name if obj.role else None

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        role_name = validated_data.pop('role', 'Student')
        role_instance, _ = Role.objects.get_or_create(name=role_name)
        instance = self.Meta.model(**validated_data)
        instance.role = role_instance
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user']

class LessonSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = Lesson
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = Module
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    announcements = AnnouncementSerializer(many=True, read_only=True)
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['instructor']

class EnrollmentSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()
    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ['student']

    def get_progress_percentage(self, obj):
        try:
            total_lessons = Lesson.objects.filter(module__course=obj.course).count()
            if total_lessons == 0: return 0
            completed_lessons = LessonCompletion.objects.filter(student=obj.student, lesson__module__course=obj.course).count()
            return round((completed_lessons / total_lessons) * 100)
        except:
            return 0

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['course'] = CourseSerializer(instance.course).data
        return rep

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

class LessonCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonCompletion
        fields = '__all__'
        read_only_fields = ['student']

class CertificateSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.title', read_only=True)
    class Meta:
        model = Certificate
        fields = '__all__'
