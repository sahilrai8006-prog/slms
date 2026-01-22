from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Role, Course, Module, Lesson, Enrollment, Assignment, Submission, Quiz, Result, LessonCompletion, Announcement, Comment, Certificate
from .serializers import (
    UserSerializer, RoleSerializer, CourseSerializer, ModuleSerializer, 
    LessonSerializer, EnrollmentSerializer, AssignmentSerializer, 
    SubmissionSerializer, QuizSerializer, ResultSerializer, 
    LessonCompletionSerializer, AnnouncementSerializer, CommentSerializer, CertificateSerializer
)

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAdminUser]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create': return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']: return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.instructor != request.user and not request.user.is_staff:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Certificate.objects.filter(student=self.request.user)

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff: return Enrollment.objects.all()
        return Enrollment.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class LessonCompletionViewSet(viewsets.ModelViewSet):
    queryset = LessonCompletion.objects.all()
    serializer_class = LessonCompletionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LessonCompletion.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
        # Check for course completion to issue certificate
        lesson = serializer.validated_data['lesson']
        course = lesson.module.course
        total = Lesson.objects.filter(module__course=course).count()
        done = LessonCompletion.objects.filter(student=self.request.user, lesson__module__course=course).count()
        if total > 0 and done >= total:
            import secrets
            random_id = secrets.token_hex(4).upper() # 8 characters
            Certificate.objects.get_or_create(
                student=self.request.user, 
                course=course,
                defaults={'certificate_id': f"SLMS-{random_id}"}
            )

# Add other viewsets (Assignment, Submission, Quiz, Result) as simple ModelViewSets
class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]
