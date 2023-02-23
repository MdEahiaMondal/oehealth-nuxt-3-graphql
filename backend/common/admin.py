import mimetypes
import os

from django.contrib import admin
from django.http.response import HttpResponse
from django.urls import path
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from .models import (Duration,
                     Tooth, Treatment,
                     Diagnostic, Specialization,
                     Qualification, LookUp,
                     LookUpType, Company,
                     CompanyUser, DoctorType,
                     Question, QuestionResponse,
                     Priority,
                     Question, QuestionResponse,
                     Priority,CompanyLang,
                     DiagnosticLang,TreatmentLang,
                     SpecializationLang,QuestionLang,
                     QuestionResponseLang,QualificationLang,
                     PriorityLang,AppointmentCode,)
from api.models.user_model import MultiLanguage


@admin.register(Duration)
class DurationAdmin(admin.ModelAdmin):
    list_display = ("number", "created_at", "updated_at",
                    "created_by", "updated_by")
    search_fields = ('number',)


@admin.register(Tooth)
class ToothAdmin(admin.ModelAdmin):
    list_display = ("number", "created_at", "updated_at",
                    "created_by", "updated_by")
    search_fields = ('number',)


class TreatmentResource(resources.ModelResource):
    class Meta:
        model = Treatment
        fields = ('id', "name")


@admin.register(Treatment)
class TreatmentAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = TreatmentResource
    list_display = ("name", "created_at", "updated_at",
                    "created_by", "updated_by")
    search_fields = ('name',)
    change_list_template = 'admin/common/treatment/change_list.html'

    def get_urls(self):
        urls = super().get_urls()
        new_urls = [path('treatment/', self.download_file), ]
        return new_urls + urls

    def download_file(self, request):
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        filename = 'Treatment.csv'
        filepath = BASE_DIR + '/utilities/files/' + filename
        path = open(filepath, 'r')
        mime_type, _ = mimetypes.guess_type(filepath)
        response = HttpResponse(path, content_type=mime_type)
        response['Content-Disposition'] = "attachment; filename=%s" % filename
        return response


class DiagnosticResource(resources.ModelResource):
    class Meta:
        model = Diagnostic
        fields = ('id', "name")


@admin.register(Diagnostic)
class DiagnosticAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = DiagnosticResource
    list_display = ("name", "created_at", "updated_at",
                    "created_by", "updated_by")
    search_fields = ('name',)
    change_list_template = 'admin/common/diagnostic/change_list.html'

    def get_urls(self):
        urls = super().get_urls()
        new_urls = [path('diagnostic/', self.download_file), ]
        return new_urls + urls

    def download_file(self, request):
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        filename = 'Diagnostic.csv'
        filepath = BASE_DIR + '/utilities/files/' + filename
        path = open(filepath, 'r')
        mime_type, _ = mimetypes.guess_type(filepath)
        response = HttpResponse(path, content_type=mime_type)
        response['Content-Disposition'] = "attachment; filename=%s" % filename
        return response


@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at", "updated_at",
                    "created_by", "updated_by")
    search_fields = ('name',)


@admin.register(Qualification)
class QualificationAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at", "updated_at",
                    "created_by", "updated_by")
    search_fields = ('name',)


@admin.register(LookUpType)
class LookUpTypeAdmin(admin.ModelAdmin):
    list_display = ("code", "created_at", "updated_at",
                    "created_by", "updated_by")
    search_fields = ('code',)


@admin.register(LookUp)
class LookUpAdmin(admin.ModelAdmin):
    list_display = ("name", 'group', 'code', "created_at",
                    "updated_at", "created_by", "updated_by")
    search_fields = ('code',)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", 'code', 'state', 'city', 'zipcode', 'country',
                    'is_active', "created_at", "created_by", "updated_by")
    search_fields = ('name',)


@admin.register(CompanyUser)
class CompanyUserAdmin(admin.ModelAdmin):
    list_display = ("company", 'user', 'doctor', 'group', 'status', 'is_owner',
                    'requested_at', 'approval_by', 'approval_at', 'is_active', 'joined_datetime')
    search_fields = ('company',)

    def get_form(self, request, obj=None, **kwargs):
        form = super(CompanyUserAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['status'].queryset = LookUp.objects.filter(
            group__code="APPROVAL")
        return form


@admin.register(DoctorType)
class DoctorTypeAdmin(admin.ModelAdmin):
    list_display = ('type', 'code', "created_at",
                    "updated_at", "created_by", "updated_by")
    search_fields = ('type',)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'reference_id', 'element_type', 'is_conditional_question',
                    'serial_no', "created_at", "updated_at", "created_by", "updated_by")
    search_fields = ('title',)

    def get_form(self, request, obj=None, **kwargs):
        form = super(QuestionAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['element_type'].queryset = LookUp.objects.filter(
            group__code="ELEMENT_TYPE")
        return form


@admin.register(QuestionResponse)
class QuestionResponseAdmin(admin.ModelAdmin):
    list_display = ('title', 'question', 'reference_id', 'serial_no',
                    "created_at", "updated_at", "created_by", "updated_by")
    search_fields = ('title',)


@admin.register(Priority)
class PriorityAdmin(admin.ModelAdmin):
    list_display = ('name', "created_at", "updated_at",
                    "created_by", "updated_by")
    search_fields = ('name',)
    
    
    
#Multi Language admin start

admin.site.register(MultiLanguage)
admin.site.register(CompanyLang)
admin.site.register(DiagnosticLang)
admin.site.register(TreatmentLang)
admin.site.register(SpecializationLang)
admin.site.register(QuestionLang)
admin.site.register(QuestionResponseLang)
admin.site.register(QualificationLang)
admin.site.register(PriorityLang)

#Multi Language admin end

#Appointment Code admin start

admin.site.register(AppointmentCode)

#Appointment Code admin end


