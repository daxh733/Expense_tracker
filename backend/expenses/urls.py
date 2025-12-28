from django.urls import path
from .views import add_expense, get_expenses,delete_expense

urlpatterns = [
    path('', get_expenses),
    path('add/', add_expense),
    path('delete/<str:expense_id>/', delete_expense)
]
