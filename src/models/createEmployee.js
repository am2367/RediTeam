const createEmployee = async (body, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain
    newBody = JSON.stringify(body).replace(/"([^"]+)":/g, '$1:');

    //Create employee if not exists
    //Create programming languages if not exist
    //Create relationships to programming languages if not exist
    for(var lang of body['programmingLanguages']){
        const lower = lang.toLowerCase()
        pipeline.call("GRAPH.QUERY", "Employee", `MERGE(e:Employee${newBody}) MERGE(p:ProgrammingLanguage{name:"${lower}"}) MERGE(e)-[r:Has_Skill]->(p)`)
        expectedResponses += 1
    }

    //Create relationship to associate level if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:Employee${newBody}) MATCH(a:AssociateLevel{level:${body['associateLevel']}}) MERGE(e)-[r:Is_Associate_Level]->(a)`)
    expectedResponses += 1

    //Create relationship to office location if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:Employee${newBody}) MATCH(o:OfficeLocation{name:"${body['officeLocation']}"}) MERGE(e)-[r:Is_Closest_To]->(o)`)
    expectedResponses += 1

    //Create team node if not exists
    //Create relationship to team if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:Employee${newBody}) MERGE(t:Team{name:"${body['teamName']}"}) MERGE(e)-[r:Is_Part_Of]->(t)`)
    expectedResponses += 1

    //Create manager node if not exists
    //Create relationship to manager if not exists
    //Create relationship between manager and team if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:Employee${newBody}) MATCH(t:Team{name:"${body['teamName']}"}) MERGE(manager:Employee{name:"${body['manager']}"}) MERGE(e)-[r:Is_Managed_By]->(manager) MERGE(manager)-[r2:Is_Part_Of]->(t)`)
    expectedResponses += 1

    const responses = await pipeline.exec();

    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){
        console.log(responses[0][1])
        callback('Employee Profile Created');
    } else {
        console.log(responses);
        callback('Unexpected error creating employee profile');
    }
}

module.exports = createEmployee;
