"""Получение вариантов ответов и статистики по категории. v2"""
import json
import os
import psycopg2


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    params = event.get("queryStringParameters") or {}
    category_id = params.get("category_id")

    if not category_id:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "category_id required"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute("""
        SELECT o.id, o.label, COUNT(v.id) as votes
        FROM t_p7020977_anonymous_questions_.options o
        LEFT JOIN t_p7020977_anonymous_questions_.votes v ON v.option_id = o.id
        WHERE o.category_id = %s
        GROUP BY o.id, o.label
        ORDER BY o.id
    """, (category_id,))

    rows = cur.fetchall()

    cur.execute("""
        SELECT custom_text, created_at
        FROM t_p7020977_anonymous_questions_.votes
        WHERE category_id = %s AND custom_text IS NOT NULL AND custom_text != ''
        ORDER BY created_at DESC
        LIMIT 50
    """, (category_id,))

    custom_rows = cur.fetchall()

    cur.close()
    conn.close()

    options = [{"id": r[0], "label": r[1], "votes": r[2]} for r in rows]
    custom_answers = [{"text": r[0], "date": r[1].isoformat()} for r in custom_rows]
    total = sum(o["votes"] for o in options)

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"options": options, "custom_answers": custom_answers, "total": total}),
    }