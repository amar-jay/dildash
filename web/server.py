from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    # Run the server on 0.0.0.0 to make it accessible from external machines
    app.run(host='0.0.0.0', port=3000)

