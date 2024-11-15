from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash
from plus import bp as plus_bp  # plus.py에서 Blueprint를 import

app = Flask(__name__, static_folder='../static', template_folder='../templates')

app.secret_key = 'your_secret_key_here'

# 데이터베이스 경로 설정
DB_PATH = os.path.join(os.path.dirname(__file__), 'users.db')

# 데이터베이스 초기화 플래그
db_initialized = False

# 데이터베이스 초기화
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
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

@app.before_request
def before_request():
    global db_initialized
    if not db_initialized:
        init_db()
        db_initialized = True

# 데이터베이스 연결 함수
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Blueprint 등록
app.register_blueprint(plus_bp, url_prefix='/plus')

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
@app.route('/join', methods=['GET', 'POST'])
def join():
    if request.method == 'POST':
        name = request.form['name']
        username = request.form['username']
        password = request.form['password']
        hashed_password = generate_password_hash(password)

        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('INSERT INTO users (name, username, password) VALUES (?, ?, ?)', 
                               (name, username, hashed_password))
                conn.commit()
            return jsonify({"success": True, "message": "회원가입이 완료되었습니다."})
        except sqlite3.IntegrityError:
            return jsonify({"success": False, "message": "이미 사용 중인 아이디입니다."})
        except Exception as e:
            return jsonify({"success": False, "message": f"오류가 발생했습니다: {str(e)}"})

    return render_template('join.html')

# 로그인 라우트
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
@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return f'로그인된 사용자: {session["username"]}'  # 대시보드 내용 간단히 표시
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)