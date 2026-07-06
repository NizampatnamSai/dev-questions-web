from db_mongo import col_user_leaves


async def is_user_on_leave(user_id: str, date_str: str) -> bool:
    """date_str is 'YYYY-MM-DD' — plain string comparison works since that
    format sorts lexicographically the same as chronologically."""
    doc = await col_user_leaves().find_one({
        "userId": user_id,
        "startDate": {"$lte": date_str},
        "endDate": {"$gte": date_str},
    })
    return doc is not None
