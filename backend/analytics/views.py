from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from config.db import db
from datetime import datetime
import calendar


# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_summary(request):
    user = request.user
    year_param = request.GET.get('year')
    month_param = request.GET.get('month')

    # Support two query styles:
    # 1) year=2025&month=12
    # 2) month=YYYY-MM (e.g., 2025-12)
    if year_param and month_param and '-' not in month_param:
        try:
            year = int(year_param)
            month = int(month_param)
        except ValueError:
            return Response(
                {"error": "year and month must be integers"},
                status=status.HTTP_400_BAD_REQUEST
            )
    elif month_param:
        try:
            # Accept formats like YYYY-MM or YYYY-M
            parts = month_param.split('-')
            if len(parts) != 2:
                raise ValueError("Invalid month format")
            year = int(parts[0])
            month = int(parts[1])
        except Exception:
            return Response(
                {"error": "month must be in YYYY-MM format"},
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        return Response(
            {"error": "Provide year & month, or month=YYYY-MM"},
            status=status.HTTP_400_BAD_REQUEST
        )

    start_date = f"{year}-{month:02d}-01"
    last_day = calendar.monthrange(year, month)[1]
    end_date = f"{year}-{month:02d}-{last_day}"
    pipeline = [
        {
            "$match": {
                "user_id": user.id,
                "date": {
                    "$gte": start_date,
                    "$lte": end_date
                }
            }
        },
        {
            "$group": {
                "_id": "$category",
                "total": {"$sum": "$amount"}
            }
        }
    ]

    category_data = list(db.expenses.aggregate(pipeline))

    total_spent = sum(item["total"] for item in category_data)

    return Response(
        {
            "year": year,
            "month": month,
            "total_spent": total_spent,
            "by_category": category_data
        },
        status=status.HTTP_200_OK
    )
