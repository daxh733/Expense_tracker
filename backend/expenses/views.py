from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

from config.db import db

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_expense(request):
    data = request.data
    user = request.user

    amount = data.get("amount")
    category = data.get("category")
    description = data.get("description", "")
    date = data.get("date")

    # Validate presence (allow amount=0 but not missing/None)
    if amount is None or not category or not date:
        return Response(
            {"error": "amount, category and date are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate amount is a number
    try:
        amount_value = float(amount)
    except (TypeError, ValueError):
        return Response(
            {"error": "amount must be a number"},
            status=status.HTTP_400_BAD_REQUEST
        )

    expense = {
        "user_id": user.id,
        "amount": amount_value,
        "category": category,
        "description": description,
        "date": date,
        "created_at": datetime.utcnow()
    }
    print("REQUEST DATA:", request.data)
    print("AMOUNT TYPE:", type(request.data.get("amount")))


    db.expenses.insert_one(expense)

    return Response(
        {"message": "Expense added successfully"},
        status=status.HTTP_201_CREATED
    )
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expenses(request):
    user = request.user

    expenses = list(
        db.expenses.find(
            {"user_id": user.id}
        )
    )
    
    # Convert ObjectId to string for JSON serialization
    for expense in expenses:
        expense["_id"] = str(expense["_id"])

    return Response(expenses, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_expense(request, expense_id):
    from bson import ObjectId
    user = request.user
    
    try:
        result = db.expenses.delete_one({
            "user_id": user.id,
            "_id": ObjectId(expense_id)
        })
        
        if result.deleted_count == 0:
            return Response(
                {"error": "Expense not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(
            {"message": "Deleted successfully"},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
