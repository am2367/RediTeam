const register = require('../models/register.js');
const createEmployee = require('../models/createEmployee.js');
const createReq = require('../models/createReq.js');
const Redis = require('ioredis');

const populateFakeData = async () => {

    const redis = new Redis({
        host: "localhost",
        port: "6379",
        password: ""
      });

    const fakeLoginList = [
                        {
                        "login" :   {"email" : "adrian.yu@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 1,
                                        "name" : "Adrian Yu",
                                        "firstName" : "Adrian",
                                        "lastName" : "Yu",
                                        "programmingLanguages" : ["Python", "Javascript"],
                                        "associateLevel" : "Manager",
                                        "officeLocation" : "New York",
                                        "teamName" : "Team A",
                                        "manager" : "Adrian Yu",
                                        "isManager" : true
                                    }
                        }, 
                        {"login" :   {"email" : "ardell.hyer@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 2,
                                        "name" : "Ardell Hyer",
                                        "firstName" : "Ardell",
                                        "lastName" : "Hyer",
                                        "programmingLanguages" : ["Node.js", "Ruby"],
                                        "associateLevel" : "Manager",
                                        "officeLocation" : "Arlington",
                                        "teamName" : "Team B",
                                        "manager" : "Ardell Hyer",
                                        "isManager" : true
                                    }
                        },
                        {"login" :   {"email" : "ranee.dubreuil@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 3,
                                        "name" : "Ranee Dubreuil",
                                        "firstName" : "Ranee",
                                        "lastName" : "Dubreuil",
                                        "programmingLanguages" : ["Python", "Javascript", "Node.js"],
                                        "associateLevel" : "Manager",
                                        "officeLocation" : "San Francisco",
                                        "teamName" : "Team C",
                                        "manager" : "Ranee Dubreuil",
                                        "isManager" : true
                                    }
                        },
                        {"login" :   {"email" : "camille.crosbie@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 4,
                                        "name" : "Camille Crosbie",
                                        "firstName" : "Camille",
                                        "lastName" : "Crosbie",
                                        "programmingLanguages" : ["Python"],
                                        "associateLevel" : 1,
                                        "officeLocation" : "San Francisco",
                                        "teamName" : "Team C",
                                        "manager" : "Ranee Dubreuil",
                                        "isManager" : false
                                    }
                        },
                        {"login" :   {"email" : "maximo.radford@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 5,
                                        "name" : "Maximo Radford",
                                        "firstName" : "Maximo",
                                        "lastName" : "Radford",
                                        "programmingLanguages" : ["Python", "Javascript"],
                                        "associateLevel" : 2,
                                        "officeLocation" : "San Francisco",
                                        "teamName" : "Team C",
                                        "manager" : "Ranee Dubreuil",
                                        "isManager" : false
                                    }
                        },
                        {"login" :   {"email" : "sol.heckel@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 6,
                                        "name" : "Sol Heckel",
                                        "firstName" : "Sol",
                                        "lastName" : "Heckel",
                                        "programmingLanguages" : ["Python", "Javascript", "Node.js"],
                                        "associateLevel" : 3,
                                        "officeLocation" : "New York",
                                        "teamName" : "Team C",
                                        "manager" : "Ranee Dubreuil",
                                        "isManager" : false
                                    }
                        },
                        {"login" :   {"email" : "giuseppina.gobin@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 7,
                                        "name" : "Giuseppina Gobin",
                                        "firstName" : "Giuseppina",
                                        "lastName" : "Gobin",
                                        "programmingLanguages" : ["Javascript", "Node.js"],
                                        "associateLevel" : 2,
                                        "officeLocation" : "New York",
                                        "teamName" : "Team B",
                                        "manager" : "Ardell Hyer",
                                        "isManager" : false
                                    }
                        },
                        {"login" :   {"email" : "chi.romanik@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 8,
                                        "name" : "Chi Romanik",
                                        "firstName" : "Chi",
                                        "lastName" : "Romanik",
                                        "programmingLanguages" : ["Javascript", "Node.js", "Python", "Ruby"],
                                        "associateLevel" : 4,
                                        "officeLocation" : "Arlington",
                                        "teamName" : "Team B",
                                        "manager" : "Ardell Hyer",
                                        "isManager" : false
                                    }
                        },
                        {"login" :   {"email" : "denny.castaneda@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 9,
                                        "name" : "Denny Castaneda",
                                        "firstName" : "Denny",
                                        "lastName" : "Castaneda",
                                        "programmingLanguages" : ["Python"],
                                        "associateLevel" : 1,
                                        "officeLocation" : "Arlington",
                                        "teamName" : "Team B",
                                        "manager" : "Ardell Hyer",
                                        "isManager" : false
                                    }
                        },
                        {"login" :   {"email" : "linnie.laroque@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 10,
                                        "name" : "Linnie Laroque",
                                        "firstName" : "Linnie",
                                        "lastName" : "Laroque",
                                        "programmingLanguages" : ["Javascript", "Node.js"],
                                        "associateLevel" : 2,
                                        "officeLocation" : "New York",
                                        "teamName" : "Team A",
                                        "manager" : "Adrian Yu",
                                        "isManager" : false
                                    }
                        },
                        {"login" :   {"email" : "john.smith@test.com", "password" : "Abc123!"},
                        "profile" : {	
                                        "id" : 11,
                                        "name" : "John Smith",
                                        "firstName" : "John",
                                        "lastName" : "Smith",
                                        "programmingLanguages" : ["Javascript", "Node.js", "Python"],
                                        "associateLevel" : 3,
                                        "officeLocation" : "San Francisco",
                                        "teamName" : "Team A",
                                        "manager" : "Adrian Yu",
                                        "isManager" : false
                                    }
                        }]
    
    const fakeReqList = [
                            {"name" : "Software Engineer 2",
                            "managerId" : 1,
                            "teamName" : "Team A",
                            "manager" : "Adrian Yu",
                            "associateLevel" : 2,
                            "programmingLanguages" : ["Javascript","Node.js"],
                            "officeLocation" : "New York",
                            "description" : "Looking for a strong Javascript engineer to build and maintain our awesome full stack apps!"
                            },
                            {"name" : "Software Engineer 3",
                            "managerId" : 3,
                            "teamName" : "Team C",
                            "manager" : "Ranee Dubreuil",
                            "associateLevel" : 3,
                            "programmingLanguages" : ["Javascript", "Node.js", "Python"],
                            "officeLocation" : "San Francisco",
                            "description" : "Looking for a very capable engineer with lots of Javascript and Python experience to help lead the buildout out of some of our new systems."
                            }
   ]

    for(const fakeLogin of fakeLoginList){
        register(fakeLogin['profile']['id'], fakeLogin['login'], redis, function(result){
            if(result === 'Registered'){
                console.log(result)
            }
            else{
                console.log(result)
            }
        })
    }

    for(const fakeLogin of fakeLoginList){
        createEmployee(fakeLogin['profile'], redis, function(result){
            if(result === 'Registered'){
                console.log(result)
            }
            else{
                console.log(result)
            }
        })
    }

    for(const fakeReq of fakeReqList){
        createReq(fakeReq['managerId'], fakeReq, redis, function(result){
            if(result === 'Registered'){
                console.log(result)
            }
            else{
                console.log(result)
            }
        })
    }

    console.log("Completed Populating Fake Data!")
    return
    // Need to update below to check response for each pipeline call instead of just first one
    // if (responses.length === expectedResponses && responses[0][1] !== null){
    //     console.log(responses[0][1])
    //     callback('Employee Profile Created');
    // } else {
    //     console.log(responses);
    //     callback('Unexpected error creating employee profile');
    // }
}

populateFakeData();