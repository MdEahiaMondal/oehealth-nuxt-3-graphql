from django.db.models.signals import post_save
from django.dispatch import receiver
from common.models import CompanyUser
from .models import Appointment
from chat.models import Connection


@receiver(post_save, sender=CompanyUser)
def update_appointment_on_company_user_change(sender, instance, created, **kwargs):
    if not created:
        if instance.request_type == "DOCTOR_REVOKE_PATIENT_ACCESS" or instance.request_type == "PATIENT_REVOKE_DOCTOR_ACCESS":
            appointments = Appointment.objects.filter(
                doctor_id=instance.doctor.id, patient_id=instance.user.id)
            for appointment in appointments:
                appointment.is_active = False
                appointment.save()
            connections = Connection.objects.filter(
                sender=instance.user, receiver=instance.doctor) | Connection.objects.filter(
                    sender=instance.doctor, receiver=instance.user)
            for connection in connections:
                connection.is_active = False
                connection.save()
        if instance.request_type == "PATIENT_ACCEPT_DOCTOR_REQUEST" or instance.request_type == "DOCTOR_ACCEPT_PATIENT_REQUEST":
            appointments = Appointment.objects.filter(
                doctor_id=instance.doctor.id, patient_id=instance.user.id)
            for appointment in appointments:
                appointment.is_active = True
                appointment.save()
            connections = Connection.objects.filter(
                sender=instance.user, receiver=instance.doctor) | Connection.objects.filter(
                    sender=instance.doctor, receiver=instance.user)
            for connection in connections:
                connection.is_active = True
                connection.save()
        if instance.status.name == "Reject":
            appointments = Appointment.objects.filter(
                doctor_id=instance.approval_by) | Appointment.objects.filter(
                    patient_id=instance.approval_by)
            for appointment in appointments:
                appointment.is_active = False
                appointment.save()
            connections = Connection.objects.filter(
                sender=instance.user, receiver=instance.doctor) | Connection.objects.filter(
                    sender=instance.doctor, receiver=instance.user)
            for connection in connections:
                connection.is_active = False
                connection.save()
                print(connection.is_active)
        if instance.status.name == "Approve":
            appointments = Appointment.objects.filter(
                doctor_id=instance.approval_by) | Appointment.objects.filter(
                    patient_id=instance.approval_by)
            for appointment in appointments:
                appointment.is_active = True
                appointment.save()
            connections = Connection.objects.filter(
                sender=instance.user, receiver=instance.doctor) | Connection.objects.filter(
                    sender=instance.doctor, receiver=instance.user)
            for connection in connections:
                connection.is_active = True
                connection.save()
                print(connection.is_active)
