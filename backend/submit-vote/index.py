"""Сохранение голоса пользователя за вариант ответа"""
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

    body = json.loads(event.get("body") or "{}")
    category_id = body.get("category_id")
    option_id = body.get("option_id")
    custom_text = body.get("custom_text", "").strip()

    if not category_id:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "category_id required"})}

    if not option_id and not custom_text:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "option_id or custom_text required"})}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO t_p7020977_anonymous_questions_.votes (option_id, custom_text, category_id)
        VALUES (%s, %s, %s)
        RETURNING id
    """, (option_id or None, custom_text or None, category_id))

    vote_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"ok": True, "vote_id": vote_id}),
    }
