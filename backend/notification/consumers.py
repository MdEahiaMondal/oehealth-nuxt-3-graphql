from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in
import json
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from appointment.models import Appointment
from common.models import CompanyUser
from asgiref.sync import async_to_sync


class RealTimeNotification(WebsocketConsumer):
    # Function to connect to the websocket
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.group_name = 'notification_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.group_name, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        self.close()

    # Custom Notify Function which can be called from Views or api to send message to the frontend
    def notify(self, event):
        self.send(text_data=json.dumps(event["text"]))
