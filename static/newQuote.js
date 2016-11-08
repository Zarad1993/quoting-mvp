console.log('Start');
console.log('I will do the best I can to absorb knowledge and learn!');

function InsuredsPerson(name, namedTitle) {
    var self = this;
    self.name = ko.observable(name);
    self.title = ko.observable(namedTitle);

    self.fullName = ko.computed(function(){
        // Send API request and return some fake data. 
        if(self.name().length !== 0){
            // To  make a post request
            $.ajax("/Insureds", {
                data: ko.toJSON({ test_name: self.name() }),
                type: "POST", contentType: "application/json",
                success: function(result) { console.log(result) }
            });
            // To make a get Request
            /*
                $.getJSON('/Insureds', function(data){
                    console.log(data);
                })
                return self.name();
            */
        }
    }, self);
}

function AdditionalInterest(name) {
    var self = this;
    self.name = name;
    self.title = ko.observable("Additional Interest");

}


var QuotingViewModel = function(){

    // Named Insured Part 

	var self = this;

	self.folders = ['Insureds', 'Policy', 'Risks', 'Rating', 'Billing', 'Attachments', 'Submit'];
    self.chosenFolderId = ko.observable();
    self.numberToAdd = ko.observable("1");
    self.numberOfInterestToAdd = ko.observable("1");
    
    // Behaviours
    self.goToFolder = function(policy_view){ 
        location.hash = policy_view
        self.chosenFolderId(policy_view);
    };

    self.goToFolder('Risks'); // By default be in the insureds Page


    // Editable data
    self.insureds = ko.observableArray([
    	new InsuredsPerson("", "Primary Named Insured")
    	]);

    self.interests = ko.observableArray([]);
    
    self.addInsureds = function(name){
    	for(var i = 0; i < self.numberToAdd(); i++){
        	self.insureds.push(new InsuredsPerson("", "Named Insured"));
    	}
    };

    self.addInterest = function(){
    	for(var i = 0; i < self.numberOfInterestToAdd(); i++){
    		self.interests.push(new AdditionalInterest(""));	
    	}
    }
   
    self.removeInsureds = function(seat){
        self.insureds.remove(seat);
    };    	

    self.removeInterest = function(seat){
        self.interests.remove(seat);
    };    	

    // Policy Type Part 

    $.getJSON('/get/states', function(data){
        self.states = data;
    });

    self.chosenState = ko.observable();
    self.lines = ['Businessowners', 'Dwelling Property', 'Inland Marine'];

    self.policyTypeProperties = ko.computed(function(name){
        return self.chosenState();
    },this);


    self.getQuestion = ko.computed(function(){
        // Here we will call a request from the server to get us underwriting questions
        $.getJSON('/underwriting/questions',function(data){
            self.questions = data;
        })
    },self);


    self.checkUnderwriting = ko.observable("");

    self.computeUnderwriting = ko.computed(function(){
        if(self.checkUnderwriting() === 'yes'){
            alert('We are discontinuing the quote, Bye Bye');
            $('body').attr('hidden',true);
        }
    },self);

    // Risk Tab Section 

    self.cities = ['Amman', 'Madaba', 'Irbid'];

/*
*Adding a new Image File testing now 
*
*/     
    self.photosCounter = ko.observable(0);
    self.files = ko.observableArray([]);
    self.photosEncoded = ko.observableArray();


    self.fileUpload = function(data, e)
    {
        var file    = e.target.files[0];
        var reader  = new FileReader();

        reader.onloadend = function (onloadend_e) 
        {   
           var result = reader.result; // Here is your base 64 encoded file. Do with it what you want.
           self.photosEncoded.push(result);
        };

        if(file)
        {
            reader.readAsDataURL(file);
        }
    };

    self.addnewPhoto = function(){
        var current = self.photosCounter();
        var after = self.photosCounter(current+1);
        self.files.push(after);
    }

    // Add by default one photo on handle
    self.addnewPhoto();

/*
* Setting the disclosure part
*/
    self.monthDisclosure = ko.observable(null);
    self.dayDisclosure = ko.observable(null);
    self.yearDisclosure = ko.observable(null);
    self.textDisclosure = ko.observable(null);
    self.amountDisclosure = ko.observable(null);
    self.causeDisclosure = ko.observable(null);
    self.canSave = ko.observable(false);

    /*
    * This is a helper function for setting the values of the disclose back to null
    * In case there will be another disclosure submitted
    */ 
    self.refreshDisclosure = function(){
        self.monthDisclosure(null);
        self.dayDisclosure(null);
        self.yearDisclosure(null);
        self.textDisclosure(null);
        self.amountDisclosure(null);
        self.causeDisclosure(null);
        self.canSave(false);        
    }

    self.setDateDisclosure = ko.computed(function(){
        if(self.dayDisclosure() && self.yearDisclosure()){
            var date = [self.monthDisclosure(),self.dayDisclosure(),self.yearDisclosure()];
            date = date.join('/');
            self.dateOfDisclosure = new Date(date);
            if(self.dateOfDisclosure == 'Invalid Date'){
                self.monthDisclosure(null);
                self.dayDisclosure(null);
                self.yearDisclosure(null);
            };
        }
    },self);

    self.setFieldsDisclosure = ko.computed(function(){
        var date = self.dateOfDisclosure;
        var text = self.textDisclosure();
        var amount = self.amountDisclosure();
        var cause = self.causeDisclosure();
        if(date && text && amount && cause){
            self.canSave(true);
        } else {
            self.canSave(false);
        }
    },self);

    self.sendDisclosure = function(){
        var disclosure = {
            date : self.dateOfDisclosure,
            text : self.textDisclosure(),
            amount : self.amountDisclosure(),
            cause : self.causeDisclosure()
        }

        $.ajax("/submit/disclosure", {
            data: ko.toJSON(disclosure),
            type: "POST", contentType: "application/json",
            success: function(result) { 
                console.log(result) 
                self.refreshDisclosure();
            }
        });
    }




}


ko.applyBindings(new QuotingViewModel());