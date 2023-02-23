import graphene
from api.models.user_model import User
from common.models import Company
from common.handle_error import get_object_or_None
from .models import Notification
from .types import NotificationType


class NotificationInput(graphene.InputObjectType):
    id = graphene.ID()
    is_read = graphene.Boolean()


class NotificationCreate(graphene.Mutation):
    class Arguments:
        input = NotificationInput()

    notification = graphene.Field(NotificationType)

    @staticmethod
    def mutate(root, info, input=None):
        notification_instance = Notification(
            created_by=User.objects.get(id=input.user),
            created_for=User.objects.get(id=input.user),
            company=Company.objects.get(id=input.user),
            notification_type=input.notification_type,
            notification_message=input.notification_message
        )
        notification_instance.save()
        return NotificationCreate(notification=notification_instance)


class DeleteNotification(graphene.Mutation):
    class Arguments:
        input = graphene.ID()

    notification = graphene.Field(NotificationType)

    @staticmethod
    def mutate(root, info, input):
        notification_instance = get_object_or_None(Notification, pk=input)
        notification_instance.delete()
        return None


class UpdateNotification(graphene.Mutation):
    class Arguments:
        input = NotificationInput()

    notification = graphene.Field(NotificationType)

    @staticmethod
    def mutate(root, info, input=None):
        notification_instance = get_object_or_None(Notification, pk=input.id)
        if notification_instance:
            notification_instance.is_read = input.is_read
            notification_instance.save()
            return UpdateNotification(notification=notification_instance)
        return None


class Mutation(graphene.ObjectType):
    create_notification = NotificationCreate.Field()
    delete_notification = DeleteNotification.Field()
    update_notification = UpdateNotification.Field()
