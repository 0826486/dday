from flask import Blueprint, request, jsonify
import sqlite3

bp = Blueprint('plus', __name__)  # 'list' 대신 'plus' 이름 사용

# 데이터베이스에 디데이 추가
@bp.route('/add_dday', methods=['POST'])
def add_dday():
    data = request.get_json()
    title = data.get('title')
    date = data.get('date')
    image_url = data.get('imageUrl')

    if title and date and image_url:
        with sqlite3.connect('ddays.db') as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS dday (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT,
                    date TEXT,
                    imageUrl TEXT
                )
            ''')
            cursor.execute('INSERT INTO dday (title, date, imageUrl) VALUES (?, ?, ?)', (title, date, image_url))
            conn.commit()
        return jsonify({'message': '디데이가 추가되었습니다.'}), 201
    return jsonify({'message': '모든 필드를 입력해주세요.'}), 400

# 데이터베이스에서 모든 디데이 가져오기
@bp.route('/get_ddays', methods=['GET'])
def get_ddays():
    with sqlite3.connect('ddays.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM dday')
        ddays = cursor.fetchall()
    return jsonify(ddays)