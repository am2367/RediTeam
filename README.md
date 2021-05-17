# RediTeam

A RedisConf 2021 Hackathon Project that solves for the ineffiencies around internal transfers within a company

## Manager View
![Screenshot](https://github.com/am2367/RediTeam/blob/master/client/src/assets/rediteamManagerScreenshot.JPG?raw=true)

## Associate View
![Screenshot](https://github.com/am2367/RediTeam/blob/master/client/src/assets/rediteamAssociateScreenshot.JPG?raw=true)

## Usage and High Level Feature Overview
### User Registration, Login, and Session Storage

* Registration
  * Only requires an email and password
  * Email must be unique
  * Password needs to be at least 8 characters long and must contain an upper case, lower case, number, and special character
  * Password is hashed and salted
* Login
  * Only requires a registered email and password
  * Stores a new session entry on successful login
* Session Storage
  * Has a max age value of `1200000`
  * Uses RedisStore as session storage
  * Includes a secret prefix

### User Profile Creation

* All users must create a new profile on login
* Requires a first name, last name, selection of whether you are a manager or not, manager name, team name, selection of office location, and selection of programming languages
* Once submitted, the user should be able to access the main dashboard

### Main Dashboard

* As a Manager you can:
  * Create a new Req for your team
  * Cancel a created Req
  * Accept a Req application
  * Reject a Req application
* As an Associate you can:
  * Browse open reqs
  * Apply to a req
  * Cancel an application
* As a Manager or Associate you can:
  * View team members

### Req Creation

* To create a new Req you have to click the "New Req" button
* Requires Req name, office location, associate level, programming languages, and description
* The Req will be published with the hiring manager name, team, and a unique Req ID

### Req Workflow
  
* Currently there is a `Submit (Associate) -> Accept (Hiring Manager)` model for completing an internal transfer
* Future state it should be `Submit (Associate) -> Accept (Hiring Manager) -> Accept Acceptance (Associate) -> Accept Transfer (Current Manager)`
* This would require that all parties agree on the transfer before it is completed

## Technologies
- Node.js
- Express
- ReactJS
- Material UI
- Redis
- RedisSearch
- RedisGraph

![Screenshot](https://github.com/am2367/RediTeam/blob/master/client/src/assets/technologies.PNG?raw=true)

## Architecture Diagram

* TO DO

## Data Types

* Redis
  * User - A registered user
    * Properties
      * id - unique id
      * email
      * password
* RedisGraph
  * `:Employee` - A registered user profile for an associate
    * Properties
      * id - User id
      * name - Full Name
      * firstName
      * lastName
      * programmingLanguages - List of programming languages
      * associateLevel - Can be 1,2,3,4
      * officeLocation - New York, Arlington, or San Francisco (hardcoded for now)
      * teamName
      * manager - Manager's full name
      * isManager - false
  * `:Manager` - A registered user profile for a manager
    * Properties
      * id - User id
      * name - Full Name
      * firstName
      * lastName
      * programmingLanguages - List of programming languages
      * associateLevel - Manager
      * officeLocation - New York, Arlington, or San Francisco (hardcoded for now)
      * teamName
      * manager - Full Name
      * isManager - true
  * `:Team`
    * Properties
      * name - Name of the team
  * `:Associate Level`
    * Properties
      * name - Name of the level
      * level - Can be 1,2,3,4 or Manager
      * yearsExperience - Can be 1,3,5, or 10
      * cost - Can be 75000, 100000, 150000, or 200000
  * `:ProgammingLanguage`
    * Properties
      * name - Name of the programming language 
  * `:OfficeLocation`
    * Properties
      * name - Name of the office location
      * state
      * full_address
  * `:Req`
    * Properties
      * name - Name of the Req
      * managerId - ID of the hiring manager
      * teamName - Name of the team for which the Req is for
      * manager - Full name of the manager
      * associateLevel
      * officeLocation
      * programmingLanguages
      * description
      
## RedisGraph Relationships

- `(:Employee)-[:Has_Skill]->(:ProgrammingLanguage)`
- `(:Employee)-[:Is_Associate_Level]->(:AssociateLevel)`
- `(:Employee)-[:Is_Closest_To]->(:OfficeLocation)`
- `(:Employee)-[:Is_Part_Of]->(:Team)`
-`(:Employee)-[:Is_Managed_By]->(:Manager)`
- `(:Manager)-[:Is_Managed_By]->(:Manager)`
- `(:Manager)-[:Is_Part_Of]->(:Team)`
- `(:Req)-[:Requires_Skill]->(:ProgrammingLanguage)`
- `(:Req)-[:Requires_Associate_Level]->(:AssociateLevel)`
- `(:Req)-[:Requires_Office_Location]->(:OfficeLocation)`
- `(:Req)-[:Hiring_For]->(:Team)`
- `(:Req)-[:Hiring_Manager]->(:Manager)`

## API Routes

- `/api/health`
  * GET
  * Returns 'API Healthy' if API is reachable
- `/api/redis_health`
  * GET
  * Returns RedisGraph and RedisSearch connection status (single connection if local)
- `/api/checkSession`
  * GET
  * Returns 'Active' if currently logged in user's session is active
- `/api/register`
  * POST
  * Params:
    * email (String)
    * password (String)
  * Returns 'Registered' if registration is successful
- `/api/login`
  * POST
  * Params:
    * email (String)
    * password (String)
  * Returns 'Correct' if login is successful
- `/api/logout`
  * GET
  * Returns 'Logged Out' if logout is successful
- `/api/email`
  * GET
  * Returns email of logged in user if successful
- `/api/profile`
  * POST
  * Params:
    * name (String)
    * firstName (String)
    * lastName (String)
    * programmingLanguages (List of strings)
    * associateLevel (Int)
    * officeLocation (String)
    * teamName (String)
    * manager (String)
    * isManager (Boolean)
  * Returns 'Employee Profile Created' if successful
- `/api/profile`
  * GET
  * Returns profile of logged in user if successful
- `/api/team/members`
  * GET
  * Returns team members of logged in user if successful
- `/api/team/manager`
  * GET
  * Returns manager of logged in user if successful 
- `/api/team/req`
  * POST
  * Params:
    * name (String)
    * teamName (String)
    * programmingLanguages (List of strings)
    * associateLevel (Int)
    * officeLocation (String)
    * manager (String)
    * description (String)
  * Returns 'Req Created' if successful
- `/api/team/reqs`
  * GET
  * Returns reqs for currently logged in user if it's a Manager
- `/api/team/applications`
  * GET
  * Returns applications for currently logged in user's team if it's a Manager
- `/api/reqs`
  * GET
  * Returns reqs not including recommended reqs for currently logged in user if it's an associate
- `/api/reqs/recommended`
  * GET
  * Returns recommended reqs not including other reqs for currently logged in user if it's an associate
- `/api/reqs/applied`
  * GET
  * Returns reqs that the current user has applied to if it's an associate
- `/api/req/apply`
  * POST
  * Params:
    * reqId (Int)
  * Returns 'Applied for Req!' if successful
- `/api/req/delete`
  * POST
  * Params:
    * reqId (Int)
  * Returns 'Req Deleted!' if successful
- `/api/req/cancel`
  * POST
  * Params:
    * reqId (Int)
  * Returns 'Req Application Cancelled!' if successful
- `/api/req/reject`
  * POST
  * Params:
    * reqId (Int)
    * id (Int)
  * Returns 'Req Rejected!' if successful
- `/api/req/accept`
  * POST
  * Params:
    * reqId (Int)
    * id (Int)
  * Returns 'Req Accepted!' if successful
  
## Running it locally
### Prerequisites

- Node
- NPM
- Docker
- RedisInsight (optional)

### Local installation

1. `git clone {this repository}`
2. `cd RediTeam`
3. `docker pull redislabs/redismod`
4. `docker run -p 6379:6379 redislabs/redismod`
5. `npm run build`
6. `npm run load`
  * You may get a bunch of errors. Ignore those.
7. `npm run dev`

You should now be able to navigate to `localhost:3000/Login` and log in using any of the emails from populated fake data or register a new users.

### Fake Data

The below fake data is automatically loaded into the application during step 5 of the installation process.

```
# Fake logins and profiles
[
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
                        
# Fake Reqs

[
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
```
