from flask import Flask, render_template, request, redirect, url_for
import qrcode
import io
from flask import send_file
import csv
from datetime import datetime

app = Flask(__name__)

student_data = []

@app.route('/')
def index():
    return render_template('form.html')

@app.route('/login', methods=['POST'])
def login():
    user_type = request.form['user_type']
    if user_type == 'faculty':
        # Generate the QR code URL
        qr_url = url_for('scan_qr', _external=True)
        return render_template('faculty_dashboard.html', students=student_data)
    elif user_type == 'student':
        return redirect(url_for('student_scan'))
    else:
        return redirect(url_for('index'))

@app.route('/student_scan')
def student_scan():
    return render_template('student_scan.html')

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
        with open('attendance.csv', mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([roll_number, student_name])

        student_data.append({'roll_number': roll_number, 'student_name': student_name})

        return "Attendance recorded!"
    return "Invalid QR scan!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=10000)
