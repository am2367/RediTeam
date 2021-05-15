const getReqs = async (id, body, redis, callback) => {
    newBody = JSON.stringify(body).replace(/"([^"]+)":/g, '$1:');

    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain

    //Create relationship to associate level if not exists
    const query = ` MATCH(e:Employee{id:${id}})--(t:Team)
                    MATCH(req:Req${newBody}) 
                    WHERE NOT (e)-[:Applied_For]->(req) 
                    AND NOT (req)-[:Is_Hiring_For]->(t)
                    AND NOT (e)-[:Recommended_Req]->(req)
                    RETURN req`

    pipeline.call("GRAPH.QUERY", "Employee", query)
    expectedResponses += 1

    const responses = await pipeline.exec();
    console.log(JSON.stringify(responses))
    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){    
        console.log(responses)    
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
        console.log(`Reqs Retrieved`);
        callback(reqList);
    } else {
        console.log(responses);
        callback('Error retrieving reqs');
    }
}

module.exports = getReqs;
