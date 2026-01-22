from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserViewSet, RoleViewSet, CourseViewSet, ModuleViewSet, 
    LessonViewSet, EnrollmentViewSet, AssignmentViewSet, 
    SubmissionViewSet, QuizViewSet, ResultViewSet, LessonCompletionViewSet,
    AnnouncementViewSet, CommentViewSet, CertificateViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'modules', ModuleViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'submissions', SubmissionViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'results', ResultViewSet)
router.register(r'lesson-completions', LessonCompletionViewSet)
router.register(r'announcements', AnnouncementViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'certificates', CertificateViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
