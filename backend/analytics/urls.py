from django.urls import path
from .views import monthly_summary

urlpatterns = [
   
    path('monthly/', monthly_summary),
]
