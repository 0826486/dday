from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# 데이터베이스 경로 설정
DB_PATH = os.path.join(os.path.dirname(__file__), 'users.db')

# 데이터베이스 초기화
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                username TEXT UNIQUE,
                password TEXT
            )
        ''')
        conn.commit()

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

# 회원가입 라우트
@app.route('/join', methods=['GET', 'POST'])
def join():
    if request.method == 'POST':
        name = request.form['name']
        username = request.form['username']
        password = request.form['password']
        hashed_password = generate_password_hash(password)

        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            try:
                cursor.execute('INSERT INTO users (name, username, password) VALUES (?, ?, ?)', (name, username, hashed_password))
                conn.commit()
                flash('회원가입이 완료되었습니다.')
                return redirect(url_for('login'))
            except sqlite3.IntegrityError:
                flash('이미 사용 중인 아이디입니다.')
                return redirect(url_for('join'))

    return render_template('join.html')

# 로그인 라우트
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
            user = cursor.fetchone()

            if user and check_password_hash(user[3], password):
                session['username'] = username
                flash('로그인 성공!')
                return redirect(url_for('dashboard'))
            else:
                flash('아이디나 비밀번호가 틀렸습니다.')
                return redirect(url_for('login'))

    return render_template('login.html')

# 대시보드 라우트
@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return f'로그인된 사용자: {session["username"]}'  # 대시보드 내용 간단히 표시
    return redirect(url_for('login'))

if __name__ == '__main__':
    init_db()  # 데이터베이스 테이블 초기화
    app.run(debug=True)