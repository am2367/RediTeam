const acceptReq = async (body, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain
    newBody = JSON.stringify(body).replace(/"([^"]+)":/g, '$1:');

    //Delete relationship to old team
    //Delete req
    //Create relationship to new team
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:Employee{id:${body['id']}}) MATCH(req:Req) WHERE ID(req)=${body['reqId']} MATCH(req)--(newTeam:Team)  MATCH (e)-[rel:Is_Part_Of]-(:Team) SET e.teamName=newTeam.name DELETE rel DELETE req MERGE(e)-[r:Is_Part_Of]->(newTeam)`)
    expectedResponses += 1

    const responses = await pipeline.exec();
    console.log(JSON.stringify(responses))
    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){
        console.log(responses[0][1])
        callback('Req Accepted!');
    } else {
        console.log(responses);
        callback('Unexpected error accepting req');
    }
}

module.exports = acceptReq;
