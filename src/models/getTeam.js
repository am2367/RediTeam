const getTeam = async (body, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain

    //Create relationship to associate level if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(:Employee{id:"${body['id']}"})--(t:Team) Return t`)
    expectedResponses += 1

    const responses = await pipeline.exec();

    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){        
        response = responses[0][1][1]
        reqList = []
        for(var req of response){
            var tempReq = {}
            tempReq['id'] = req[0][0][1]
            tempReq['properties'] = req[0][2][1]
            reqList += tempReq
        }
        console.log(`Reqs Retrieved For Team ${body['teamName']}`);
        callback(reqList);
    } else {
        console.log(responses);
        callback('Error retrieving reqs');
    }
}

module.exports = getTeam;
