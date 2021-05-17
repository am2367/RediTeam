const createEmployee = async (body, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain
    newBody = JSON.stringify(body).replace(/"([^"]+)":/g, '$1:');

    //Create employee if not exists
    //Create programming languages if not exist
    //Create relationships to programming languages if not exist

    const employeeType = body['isManager'] ? "Manager" : "Employee"

    for(var lang of body['programmingLanguages']){
        const lower = lang.toLowerCase()
        pipeline.call("GRAPH.QUERY", "Employee", `MERGE(e:${employeeType}${newBody}) MERGE(p:ProgrammingLanguage{name:"${lower}"}) MERGE(e)-[r:Has_Skill]->(p)`)
        expectedResponses += 1
    }

    //Create relationship to associate level if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:${employeeType}${newBody}) MATCH(a:AssociateLevel{level:${body['associateLevel']}}) MERGE(e)-[r:Is_Associate_Level]->(a)`)
    expectedResponses += 1

    //Create relationship to office location if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:${employeeType}${newBody}) MATCH(o:OfficeLocation{name:"${body['officeLocation']}"}) MERGE(e)-[r:Is_Closest_To]->(o)`)
    expectedResponses += 1

    //Create team node if not exists
    //Create relationship to team if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:${employeeType}${newBody}) MERGE(t:Team{name:"${body['teamName']}"}) MERGE(e)-[r:Is_Part_Of]->(t)`)
    expectedResponses += 1

    //Create manager node if not exists
    //Create relationship to manager if not exists
    //Create relationship between manager and team if not exists
    if(employeeType === "Employee"){
        // const managerObj = `{name:"${body['manager']}",firstName:${body['manager'].split(' ')[0]},lastName:${body['manager'].split(' ')[1]},isManager:"true",associateLevel: 0, officeLocation: '', programmingLanguages: "[]", manager:${manager},}}`
        pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:${employeeType}${newBody}) MATCH(t:Team{name:"${body['teamName']}"}) MERGE(manager:Manager{name:"${body['manager']}"}) MERGE(e)-[r:Is_Managed_By]->(manager) MERGE(manager)-[r2:Is_Part_Of]->(t)`)
        expectedResponses += 1
    }
    else{
        pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:${employeeType}${newBody}) MATCH(t:Team{name:"${body['teamName']}"}) MERGE(e)-[r:Is_Managed_By]->(e) MERGE(e)-[r2:Is_Part_Of]->(t)`)
        expectedResponses += 1
    }

    const responses = await pipeline.exec();
    // console.log(JSON.stringify(responses))
    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){
        // console.log(responses[0][1])
        callback('Employee Profile Created');
    } else {
        console.log(responses);
        callback('Unexpected error creating employee profile');
    }
}

module.exports = createEmployee;
