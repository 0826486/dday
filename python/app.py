from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
# 경량 데이터베이스로 사용자 정보를 저장
import sqlite3
# 파일 경로를 동적으로 설정하기 위해 사용
import os
# 비밀번호 해싱 및 검증
# 비밀번호 안전하게 해싱, 저장된 해시와 입력된 비밀번호 비교
from werkzeug.security import generate_password_hash, check_password_hash
from plus import bp as plus_bp
# 모듈화된 Flask 앱 구조를 지원하며, plus.py에서 정의된 Blueprint를 가져옴

# 앱 인스턴스 생성, HTML 템플릿 렌더링, HTTP 요청 데이터를 처리, 다른 URL로 리다이렉트
# URL 생성, 클라이언트 세션 관리, 사용자 피드백 메시지 표시, JSON 응답을 생성

app = Flask(__name__, static_folder='../static', template_folder='../templates')
# static 폴더 : 정적 파일 경로
# template_folder: HTML 템플릿 경로

app.secret_key = 'your_secret_key_here'
# Flask에서 세션이나 CSRF 방지를 위해 필요

# 데이터베이스 경로 설정
DB_PATH = os.path.join(os.path.dirname(__file__), 'users.db')

# 데이터베이스 초기화 플래그
db_initialized = False

# 데이터베이스 초기화
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        # 테이블의 스키마 정보를 조회
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'name' not in columns:
            cursor.execute('ALTER TABLE users ADD COLUMN name TEXT')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                username TEXT UNIQUE,
                password TEXT
            )
        ''')
        conn.commit()

    # db_initialized : 데이터베이스가 초기화되었는지 확인
    
# Flask 요청이 처리되기 전 실행
# 데이터베이스가 초기화되지 않은 경우 초기화
# 애플리케이션을 실행할 때마다 데이터베이스 상태를 항상 확인하고, 초기화되지 않은 상태에서는 자동으로 초기화
@app.before_request
def before_request():
    global db_initialized
    if not db_initialized:
        init_db()
        db_initialized = True

# 데이터베이스 연결 함수
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    # 결과를 딕셔너리 형태로 반환
    conn.row_factory = sqlite3.Row
    return conn

# Blueprint 등록
app.register_blueprint(plus_bp, url_prefix='/plus')

# 각 라우트는 정해진 URL에 대해 특정 HTML 템플릿을 렌더링
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/plus')
def plus():
    return render_template('plus.html')

@app.route('/view_d_day')
def view_d_day():
    return render_template('view_d_day.html')

@app.route('/mypage')
def mypage():
    return render_template('mypage.html')

@app.route('/dayplus')
def dayplus():
    return render_template('dayplus.html')

@app.route('/see')
def see():
    return render_template('see.html')

# 회원가입 라우트
# GET : 회원가입 페이지 렌더링
# POST : 사용자가 입력한 데이터를 처리하여 데이터베이스에 저장 
@app.route('/join', methods=['GET', 'POST'])
def join():
    # 사용자가 회원가입 폼을 제출할 때 발생
    if request.method == 'POST':
        # 사용자로부터 받은 데이터를 가져오는 객체
        name = request.form['name']
        username = request.form['username']
        password = request.form['password']
        # 비밀번호를 안전하게 처리하기 위해 generate_password_hash를 사용
        # 그냥 비밀번호를 저장하지 않고, 해시값을 저장하여 보안을 강화
        hashed_password = generate_password_hash(password)

        try:
            # SQLite 데이터베이스 연결을 반환
            with get_db_connection() as conn:
                cursor = conn.cursor()
                # 사용자의 name, username, hashed_password를 users 테이블에 삽입
                cursor.execute('INSERT INTO users (name, username, password) VALUES (?, ?, ?)', 
                               (name, username, hashed_password))
                # 데이터베이스 변경 내용을 저장
                conn.commit()
                # JSON 형식으로 성공 메시지 반환
            return jsonify({"success": True, "message": "회원가입이 완료되었습니다."})
        # username 컬럼에 UNIQUE 제약 조건이 걸려 있어 중복된 사용자 이름 입력 시 발생
        except sqlite3.IntegrityError:
            return jsonify({"success": False, "message": "이미 사용 중인 아이디입니다."})
        except Exception as e:
            return jsonify({"success": False, "message": f"오류가 발생했습니다: {str(e)}"})

    return render_template('join.html')

# 로그인 라우트
# 데이터베이스에서 사용자를 조회
# 해시된 비밀번호 검증
# 로그인 성공 시 세션에 사용자 정보 저장
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
                user = cursor.fetchone()

                if user and check_password_hash(user['password'], password):
                    session['username'] = username
                    flash('로그인 성공!')
                    return redirect(url_for('index'))  # 로그인 성공 시 index 페이지로 리다이렉트
                else:
                    flash('아이디나 비밀번호가 틀렸습니다.')
        except Exception as e:
            flash(f'로그인 중 오류가 발생했습니다: {str(e)}')

    return render_template('login.html')

# 대시보드 라우트
# 세션에 사용자 정보가 없으면 로그인 페이지로 리다이렉트
@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return f'로그인된 사용자: {session["username"]}'  # 대시보드 내용 간단히 표시
    return redirect(url_for('login'))

# 디버그 모드 활성화
# 변경사항 자동 반영
if __name__ == '__main__':
    app.run(debug=True)