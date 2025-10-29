import mysql.connector
from mysql.connector import Error
from flask import Flask

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

def test_db():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            print("✅ Conexión exitosa a la base de datos")
            conn.close()
        else:
            print("❌ No se pudo conectar a la base de datos")
    except Error as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    test_db()
    app.run(host='0.0.0.0', port=3000)
