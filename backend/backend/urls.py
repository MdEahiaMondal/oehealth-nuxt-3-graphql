from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
# from backend.appointment.views import csv_view
from graphene_file_upload.django import FileUploadGraphQLView
from graphql_jwt.decorators import jwt_cookie
from appointment import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql', jwt_cookie(FileUploadGraphQLView.as_view(graphiql=True))),
    path('survey/', views.download_csv, name='allsurvey'),
    path('survey/<int:survey_id>/', views.csv_view, name='surveydownload'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
