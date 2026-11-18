from flask import Flask, jsonify, request
from db import get_student_collection, get_questions_collection
import pandas as pd
import random
from bson import ObjectId

app = Flask(__name__)

def serialize_document(doc):
    """Convert MongoDB document to a serializable format."""
    doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
    return doc

@app.route('/add_student', methods=['POST'])
def add_student():
    student_data = {
        "name": request.json.get('name'),
        "email": request.json.get('email'),
        "phone": request.json.get('phone'),
        "year": request.json.get('year'),
        "division": request.json.get('division'),
        "branch": request.json.get('branch')
    }
    
    student_collection = get_student_collection()
    insert_result = student_collection.insert_one(student_data)
    student_data['_id'] = str(insert_result.inserted_id)  # Convert ObjectId to string

    return jsonify({'message': 'Random student added successfully!', 'data': student_data})

@app.route('/upload_students', methods=['POST'])
def upload_students():
    """Upload multiple students from a CSV/Excel file."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    
    if not file.filename.endswith(('.csv', '.xlsx')):
        return jsonify({'error': 'Only CSV or Excel files are allowed'}), 400

    if file.filename.endswith('.csv'):
        df = pd.read_csv(file)
    else:  # Excel file
        df = pd.read_excel(file)

    # Assuming columns: Name, Gmail, PhoneNumber, Year, Division, Branch
    students = df.to_dict(orient='records')  # Convert to a list of dictionaries
    student_collection = get_student_collection()
    
    inserted_ids = []
    for student in students:
        student_data = {
            "name": student.get('Name'),
            "email": student.get('Gmail'),
            "phone": student.get('PhoneNumber'),
            "year": student.get('Year'),
            "division": student.get('Division'),
            "branch": student.get('Branch')
        }
        insert_result = student_collection.insert_one(student_data)
        inserted_ids.append(str(insert_result.inserted_id))  # Convert ObjectId to string

    return jsonify({'message': f'{len(inserted_ids)} students added successfully!', 'inserted_ids': inserted_ids})

@app.route('/add_question', methods=['POST'])
def add_question():
    question_data = {
        "question": request.json.get('question'),
        "option_a": request.json.get('option_a'),
        "option_b": request.json.get('option_b'),
        "option_c": request.json.get('option_c'),
        "option_d": request.json.get('option_d'),
        "correct_option": request.json.get('correct_option')
    }
    
    questions_collection = get_questions_collection()
    questions_collection.insert_one(question_data)

    return jsonify({'message': 'Random question added successfully!', 'data': question_data})

@app.route('/upload_questions', methods=['POST'])
def upload_questions():
    """Upload multiple questions from a CSV/Excel file."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    
    if not file.filename.endswith(('.csv', '.xlsx')):
        return jsonify({'error': 'Only CSV or Excel files are allowed'}), 400

    if file.filename.endswith('.csv'):
        df = pd.read_csv(file)
    else:  # Excel file
        df = pd.read_excel(file)

    # Assuming columns: Question, OptionA, OptionB, OptionC, OptionD, CorrectOption
    questions = df.to_dict(orient='records')  # Convert to a list of dictionaries
    questions_collection = get_questions_collection()
    
    inserted_ids = []
    for question in questions:
        question_data = {
            "question": question.get('Question'),
            "option_a": question.get('OptionA'),
            "option_b": question.get('OptionB'),
            "option_c": question.get('OptionC'),
            "option_d": question.get('OptionD'),
            "correct_option": question.get('CorrectOption')
        }
        insert_result = questions_collection.insert_one(question_data)
        inserted_ids.append(str(insert_result.inserted_id))  # Convert ObjectId to string

    return jsonify({'message': f'{len(inserted_ids)} questions added successfully!', 'inserted_ids': inserted_ids})

@app.route('/students', methods=['GET'])
def get_students():
    student_collection = get_student_collection()
    students = list(student_collection.find())
    serialized_students = [serialize_document(student) for student in students]
    return jsonify(serialized_students)

@app.route('/questions', methods=['GET'])
def get_questions():
    questions_collection = get_questions_collection()
    questions = list(questions_collection.find())
    serialized_questions = [serialize_document(question) for question in questions]
    return jsonify(serialized_questions)

if __name__ == '__main__':
    app.run(debug=True)
