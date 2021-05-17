const { json } = require("body-parser");

const getEmployee = async (id, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain

    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(n{id:${id}}) Return n`)
    expectedResponses += 1

    const responses = await pipeline.exec();

    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){    
        // console.log(responses)    
        response = responses[0][1][1]

        respList1 = []
        for(var resp of response){
            // console.log(JSON.stringify(resp))
            
            var temp = {}
            
            for(var entry of resp){ 
                if(entry){
                    // console.log(JSON.stringify(entry))
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
            }
            respList1.push(temp)
        }
        console.log(`Employee Profile Retrieved`);
        callback(respList1);
    } else {
        console.log(responses);
        callback('Error retrieving employee profile');
    }
}

module.exports = getEmployee;
