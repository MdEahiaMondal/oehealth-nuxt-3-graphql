# from backend.backend.settings import AUTH_USER_MODEL
from common.models import CompanyUser
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# User = AUTH_USER_MODEL


@receiver(post_save, sender=CompanyUser)
def create_notification(sender, **kwargs):
    if kwargs["instance"]:
        if kwargs["instance"].request_type == "DOCTOR_REQUEST":
            Notification.objects.create(
                created_by=kwargs["instance"].user,
                created_for=kwargs["instance"].company.created_by,
                company=kwargs["instance"].company,
                notification_type=kwargs["instance"].request_type,
                notification_text="Request to Join Your Company"
            )
        elif kwargs["instance"].request_type == "DOCTOR_APPROVAL":
            Notification.objects.create(
                created_by=kwargs["instance"].user,
                created_for=kwargs["instance"].company.created_by,
                company=kwargs["instance"].company,
                notification_type=kwargs["instance"].request_type,
                notification_text="Accept You in Company"
            )
        elif kwargs["instance"].request_type == "OWNER_REQUEST":
            Notification.objects.create(
                created_by=kwargs["instance"].company.created_by,
                created_for=kwargs["instance"].user,
                company=kwargs["instance"].company,
                notification_type=kwargs["instance"].request_type,
                notification_text="Request to Join The Company"
            )
        elif kwargs["instance"].request_type == "OWNER_APPROVAL":
            Notification.objects.create(
                created_by=kwargs["instance"].company.created_by,
                created_for=kwargs["instance"].user,
                company=kwargs["instance"].company,
                notification_type=kwargs["instance"].request_type,
                notification_text="Accept your Join Request in Company"
            )
        elif kwargs["instance"].request_type == "PATIENT_REQUEST_DOCTOR":
            Notification.objects.create(
                created_by=kwargs["instance"].requested_by,
                created_for=kwargs["instance"].doctor,
                notification_type=kwargs["instance"].request_type,
                notification_text="Request to Give Access as a Doctor"
            )
        elif kwargs["instance"].request_type == "DOCTOR_ACCEPT_PATIENT_REQUEST":
            Notification.objects.create(
                created_by=kwargs["instance"].doctor,
                created_for=kwargs["instance"].user,
                notification_type=kwargs["instance"].request_type,
                notification_text="Give access as a Doctor"
            )
        elif kwargs["instance"].request_type == "DOCTOR_REQUEST_PATIENT":
            Notification.objects.create(
                created_by=kwargs["instance"].doctor,
                created_for=kwargs["instance"].user,
                notification_type=kwargs["instance"].request_type,
                notification_text="Request to Have Access as a Patient"
            )
        elif kwargs["instance"].request_type == "PATIENT_ACCEPT_DOCTOR_REQUEST":
            Notification.objects.create(
                created_by=kwargs["instance"].user,
                created_for=kwargs["instance"].doctor,
                notification_type=kwargs["instance"].request_type,
                notification_text="Give access as a Patient"
            )
        elif kwargs["instance"].request_type == "DOCTOR_REVOKE_PATIENT_ACCESS":
            Notification.objects.create(
                created_by=kwargs["instance"].doctor,
                created_for=kwargs["instance"].user,
                notification_type=kwargs["instance"].request_type,
                notification_text="Revoke access as a Doctor"
            )
        elif kwargs["instance"].request_type == "PATIENT_REVOKE_DOCTOR_ACCESS":
            Notification.objects.create(
                created_by=kwargs["instance"].user,
                created_for=kwargs["instance"].doctor,
                notification_type=kwargs["instance"].request_type,
                notification_text="Revoke access as a Patient"
            )
        else:
            pass
    else:
        raise ValidationError("Please fill the form correctly.")


@receiver(post_save, sender=Notification)
def all_notification(sender, **kwargs):
    company_name = kwargs["instance"].company
    notification_receiver = kwargs["instance"].created_for.id
    company_name = kwargs["instance"].company
    if company_name is not None:
        company_name = kwargs["instance"].company.name
    else:
        company_name = "None"
    notify = {
        'data': {'notifications': [{'id': str(kwargs["instance"].id),
                                    'createdBy': {'name': kwargs["instance"].created_by.name},
                                    'createdFor': {'name': kwargs["instance"].created_for.name},
                                    'company': {'name': company_name},
                                    'notificationText': kwargs["instance"].notification_text,
                                    'notificationType': kwargs["instance"].notification_type,
                                    'createdAt': kwargs["instance"].created_at.isoformat(),
                                    "is_read": kwargs["instance"].is_read}]}
    }
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notification_{notification_receiver}',
        {
            "type": "notify",
            "text": notify,
        },
    )
