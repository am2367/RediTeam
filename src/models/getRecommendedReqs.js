const getRecommendedReqs = async (id, body, redis, callback) => {
    newBody = JSON.stringify(body).replace(/"([^"]+)":/g, '$1:');

    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain

    //Create relationship to associate level if not exists
    const query = ` MATCH(e:Employee{id:${id}})
                    MATCH (e)-[:Is_Closest_To]-(l) 
                    MATCH (e)-[:Is_Associate_Level]-(a) 
                    MATCH (e)-[:Has_Skill]-(s) MATCH(r:Req) 
                    WHERE NOT (e)-[:Applied_For]->(r)
                        AND (r)-[:Requires_Office_Location]-(l)
                        AND (r)-[:Requires_Associate_Level]-(a) 
                        AND (r)-[:Requires_Skill]-(s)
                    MERGE (e)-[:Recommended_Req]->(r)
                    RETURN DISTINCT r`

    pipeline.call("GRAPH.QUERY", "Employee", query)
    expectedResponses += 1

    const responses = await pipeline.exec();

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
        console.log(`Recommended Reqs Retrieved`);
        callback(reqList);
    } else {
        console.log(responses);
        callback('Error retrieving recommended reqs');
    }
}

module.exports = getRecommendedReqs;
