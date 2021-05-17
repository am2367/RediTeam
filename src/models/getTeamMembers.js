const getTeamMembers = async (id, body, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain

    //Create relationship to associate level if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(n{id:${id}})--(t:Team) MATCH(e:Employee)-[:Is_Part_Of]->(t) Return e`)
    expectedResponses += 1

    const responses = await pipeline.exec();

    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){    
        // console.log(JSON.stringify(responses))    
        response = responses[0][1][1]

        respList1 = []
        for(var resp of response){
            // console.log(JSON.stringify(resp))
            
            var temp = {}

            for(var entry of resp){ 
                const label = entry[1][1][0]
                temp[label] = {}
                temp[label]['id'] = entry[0][1]
                temp[label]['properties'] = {}
                for(var prop of entry[2][1]){
                    if(prop[1][0] === '['){
                        temp[label]['properties'][prop[0]] = prop[1].replace('[', '').replace(']', '').split(',');
                    }
                    else{
                        temp[label]['properties'][prop[0]] = prop[1]
                    }
                }
            }
            respList1.push(temp)
        }
        console.log(`Team Members Retrieved`);
        callback(respList1);
    } else {
        console.log(responses);
        callback('Error retrieving team members');
    }
}

module.exports = getTeamMembers;
