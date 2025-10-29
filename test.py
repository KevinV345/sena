from flask import Flask
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

DB_CONFIG = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'olimpiadas',
    'raise_on_warnings': True,
    'use_pure': True,
    'charset': 'utf8mb4',
    'use_unicode': True
}

@app.route('/')
def test_db():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("SHOW TABLES;")
            tables = [t[0] for t in cursor.fetchall()]
            return f"✅ Conexión exitosa. Tablas: {tables}"
    except Error as e:
        return f"❌ Error de conexión: {e}"
    finally:
        if 'conn' in locals() and conn.is_connected():
            conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
