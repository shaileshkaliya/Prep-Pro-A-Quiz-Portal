from pymongo import MongoClient

# MongoDB connection setup
client = MongoClient('mongodb+srv://Rama:RamKrishnaHari%4008@clusterforquiz.falcs.mongodb.net/')  # Replace with your MongoDB URI
# Connect to 'studentdetails' database
studentdetails_db = client['StudentProfile']
student_collection = studentdetails_db['StudentData']  # Replace with the collection name

# Connect to 'questions' database
questions_db = client['QuestionDB']
questions_collection = questions_db['Questions']  # Replace with the collection name

def get_student_collection():
    return student_collection

def get_questions_collection():
    return questions_collection
