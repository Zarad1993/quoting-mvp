from flask import Flask , request,  render_template, jsonify, Response

import json


""" Server Running on Flask port 5000 
	Trying to comprehend the understanding of sending and recieving API requests
	To start Implementing at BriteApps """

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = '\xfb\x12\xdf\xa1@i\xd6>V\xc0\xbb\x8fp\x16#Z\x0b\x81\xeb\x16'


@app.route('/')
def sayMyName():
	""" Rendering main template, just passing a client
	    as an example to see how it is displayed on the front end """

	return render_template('index.html', client = "Mohammad Al Bakri")

@app.route('/Insureds', methods = ['GET', 'POST'])
def inInsureds():
	""" At this route, Just testing the post and get requests 
		In get request, we are sending back a list of fake data to fetch it in the front-end
		In post request, trying to assure data sent by front end gets here in form of json. """


	data = request.json
	
	print(data['test_name'])

	posts = [  # fake array of posts
        { 
            'author': {'nickname': 'John'}, 
            'body': 'Beautiful day in Portland!' 
        },
        { 
            'author': {'nickname': 'Susan'}, 
            'body': 'The Avengers movie was so cool!' 
        }
    ]

	return jsonify(posts)


@app.route('/get/states', methods = ['GET'])
def getAllStates():
	states = ['Missouri', 'Kansas', 'Springfield', 'Chicago', 'New York']
	return jsonify(states)


@app.route('/submit/mortgage', methods = ['POST'])
def addMortgage():
	return "Mortgage has Submitted"


@app.route('/upload', methods = ['POST'])
def uploadPic():
	return "Photos Submitted"



"""
	Another route for getting the underwriting questions
	All fake data for training purposes 
"""

@app.route('/underwriting/questions', methods = ['GET'])
def getQuestions():
	questions = [
		'If we all support each other, will we achieve the impossible ?'
	]
	return jsonify(questions)

@app.route('/submit/disclosure', methods = ['POST'])
def submitDisclosure():
	data = request.json
	print(data['date']);

	return 'Successfully Closure Submitted'


@app.route('/get/policy/wide', methods= ['GET'])
def getPolicyWide():
    fakeData = [{
        'line_item' : 'Package Policy Discount',
        'date' : '08/18/2016',
        'limit' :  'null',
        'deductible' : 'None', 
        'pro_rata' : 'Pending', 
        'annual_amount' : 'Pending',
        'manual' : 'null'
    },{
        'line_item' : 'Policy Issue Fee',
        'date' : '08/18/2016',
        'limit' :  'null',
        'deductible' : 'None', 
        'pro_rata' : 'Pending', 
        'annual_amount' : 'Pending',
        'manual' : 'null'        
    },{
        'line_item' : 'General Information',
        'date' : '08/18/2016',
        'limit' :  'null',
        'deductible' : 'None', 
        'pro_rata' : 'Pending', 
        'annual_amount' : 'Pending',
        'manual' : 'null'
    }]
    return jsonify(result = fakeData)

@app.route('/get/address/<name>')
def getAddress(name):
    address = "%s / Amman Dahyet Al Rasheed, Antwon Dawoud St.Bld #7" % name
    return jsonify(result= address)


if __name__ == '__main__':
    app.secret_key = 'super secret key'
    app.run(debug=True, host='0.0.0.0')