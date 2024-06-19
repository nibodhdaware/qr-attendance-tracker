from flask import Flask, render_template, request, redirect, url_for
import qrcode
import io
from flask import send_file
import pandas as pd
from datetime import datetime

app = Flask(__name__)

# Path to CSV file
csv_file = 'attendance.csv'

# Ensure the CSV file exists with the correct headers
def init_csv():
    try:
        df = pd.read_csv(csv_file)
    except FileNotFoundError:
        df = pd.DataFrame(columns=['roll_number', 'student_name', 'timestamp'])
        df.to_csv(csv_file, index=False)

init_csv()

@app.route('/')
def index():
    return render_template('form.html')

@app.route('/login', methods=['POST'])
def login():
    user_type = request.form['user_type']
    if user_type == 'faculty':
        # Generate the QR code URL
        qr_url = url_for('scan_qr', _external=True)
        return render_template('faculty_dashboard.html', qr_url=qr_url)
    elif user_type == 'student':
        roll_number = request.form['roll_number']
        student_name = request.form['student_name']
        # Here you can handle the student login if needed
        return redirect(url_for('index'))
    else:
        return redirect(url_for('index'))

@app.route('/generate_qr')
def generate_qr():
    qr_url = request.args.get('qr_url')
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_url)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    buf = io.BytesIO()
    img.save(buf)
    buf.seek(0)
    return send_file(buf, mimetype='image/png')

@app.route('/scan_qr', methods=['GET'])
def scan_qr():
    # Extract parameters if any, for example student information
    roll_number = request.args.get('roll_number')
    student_name = request.args.get('student_name')
    if roll_number and student_name:
        # Record the attendance
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        df = pd.read_csv(csv_file)
        df = df.append({'roll_number': roll_number, 'student_name': student_name, 'timestamp': timestamp}, ignore_index=True)
        df.to_csv(csv_file, index=False)
        return "Attendance recorded!"
    return "Invalid QR scan!"

if __name__ == '__main__':
    app.run(debug=True)
