from flask import Blueprint, request, jsonify
import sqlite3
from datetime import datetime

# Blueprint 생성
bp = Blueprint('plus', __name__)

# 디데이 정보를 데이터베이스에 추가
@bp.route('/add_dday', methods=['POST'])
def add_dday():
    data = request.get_json()
    title = data.get('title')
    date = data.get('date')
    image_url = data.get('imageUrl')

    # 필수 값이 모두 있는지 확인
    #  # 디데이를 DB에 추가하는 코드
    if title and date and image_url:
        with sqlite3.connect('ddays.db') as conn:
            cursor = conn.cursor()
            # 테이블이 존재하지 않을 경우 생성
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS dday (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    date TEXT NOT NULL,
                    imageUrl TEXT NOT NULL
                )
            ''')
            # 새 디데이 데이터 삽입
            cursor.execute('INSERT INTO dday (title, date, imageUrl) VALUES (?, ?, ?)', (title, date, image_url))
            conn.commit()
        return jsonify({'message': '디데이가 추가되었습니다.'}), 201
    return jsonify({'message': '모든 필드를 입력해주세요.'}), 400

# 데이터베이스에서 모든 디데이 항목 가져오기
@bp.route('/get_ddays', methods=['GET'])
def get_ddays():
    with sqlite3.connect('ddays.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, title, date, imageUrl FROM dday')
        ddays = cursor.fetchall()

    ddays_list = []
    for dday in ddays:
        id, title, date_str, image_url = dday

        # 남은 날짜 계산
        try:
            dday_date = datetime.strptime(date_str, '%Y-%m-%d')
            today = datetime.now()
            delta_days = (dday_date - today).days
            if delta_days >= 0:
                dday_display = f"D-{delta_days}"
            else:
                dday_display = f"D+{abs(delta_days)}"
        except ValueError:
            dday_display = "날짜 오류"

        ddays_list.append({
            'id': id,
            'title': title,
            'date': date_str,
            'imageUrl': image_url,
            'dday_display': dday_display
        })

    return jsonify(ddays_list)