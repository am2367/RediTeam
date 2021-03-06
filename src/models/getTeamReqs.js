const getTeamReqs = async (id, body, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain

    //Create relationship to associate level if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(e:Manager{id:${id}})--(t:Team)--(r:Req) Return r`)
    expectedResponses += 1

    const responses = await pipeline.exec();

    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){        
        // console.log(responses)    
        response = responses[0][1][1]

        reqList = []
        for(var req of response){
            var tempReq = {}
            tempReq['id'] = req[0][0][1]
            tempReq['properties'] = {}

            for(var prop of req[0][2][1]){
                if(prop[1][0] === '['){
                    tempReq['properties'][prop[0]] = prop[1].replace('[', '').replace(']', '').split(',');
                }
                else{
                    tempReq['properties'][prop[0]] = prop[1]
                }
                
            }
            
            reqList.push(tempReq)
        }
        console.log(`Reqs Retrieved For Team`);
        callback(reqList);
    } else {
        console.log(responses);
        callback('Error retrieving reqs');
    }
}

module.exports = getTeamReqs;
