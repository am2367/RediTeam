const createReq = async (id, body, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain
    newBody = JSON.stringify(body).replace(/"([^"]+)":/g, '$1:');


    //Create req node if not exists
    //Create programming language node if not exists
    //Create relationship between req and programming language if not exists
    for(var lang of body['programmingLanguages']){
        const lower = lang.toLowerCase()
        pipeline.call("GRAPH.QUERY", "Employee", `MERGE(req:Req${newBody}) MERGE(p:ProgrammingLanguage{name:"${lower}"}) MERGE(req)-[r:Requires_Skill]->(p)`)
        expectedResponses += 1
    }
    

    //Create relationship to associate level if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(req:Req${newBody}) MATCH(a:AssociateLevel{level:${body['associateLevel']}}) MERGE(req)-[r:Requires_Associate_Level]->(a)`)
    expectedResponses += 1

    //Create relationship to office location if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(req:Req${newBody}) MATCH(o:OfficeLocation{name:"${body['officeLocation']}"}) MERGE(req)-[r:Requires_Office_Location]->(o)`)
    expectedResponses += 1

    //Create team node if not exists
    //Create relationship to team if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(req:Req${newBody}) MATCH(e:Manager{id:${id}})--(t:Team) MERGE(req)-[r:Hiring_For]->(t) SET req.teamName=t.name SET req.manager=e.name`)
    expectedResponses += 1

    //Create relationship to manager if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(req:Req${newBody}) MATCH(e:Manager{id:${id}}) MERGE(req)-[r:Hiring_Manager]->(e)`)
    expectedResponses += 1

    const responses = await pipeline.exec();

    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){
        // console.log(responses[0][1])
        callback('Req Created');
    } else {
        console.log(responses);
        callback('Unexpected error creating req');
    }
}

module.exports = createReq;
