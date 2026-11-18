import requests
import sys
import os

def upload_file(file_path, api_url):
    """Upload the specified CSV file to the given API URL."""
    if not os.path.isfile(file_path):
        print(f"Error: The file '{file_path}' does not exist.")
        return

    # Determine the type of data to upload based on the file name
    if "student" in file_path.lower():
        endpoint = '/upload_students'
    elif "question" in file_path.lower():
        endpoint = '/upload_questions'
    else:
        print("Error: The file name must contain 'students' or 'questions'.")
        return

    url = api_url + endpoint
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, files=files)

    if response.status_code == 200:
        print(f"Success: {response.json()}")
    else:
        print(f"Error {response.status_code}: {response.text}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python upload_data.py <file_path> <api_url>")
        sys.exit(1)

    file_path = sys.argv[1]
    api_url = sys.argv[2]
    
    upload_file(file_path, api_url)
