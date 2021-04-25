const createNodes = async (redis, callback) => {
    const pipeline = redis.pipeline();

    //Create Associate Level Nodes
    const associateLevelDetailMapping = ["{name: 'Level 1', level: 1, years_experience: 1, cost: 75000}",
                                         "{name: 'Level 2', level: 2, years_experience: 3, cost: 100000}",
                                         "{name: 'Level 3', level: 3, years_experience: 5, cost: 150000}",
                                         "{name: 'Level 4', level: 4, years_experience: 10, cost: 200000}"]

    for(var detail of associateLevelDetailMapping){
        pipeline.call("GRAPH.QUERY", "Employee", `CREATE(:AssociateLevel${detail})`)
    }

    //Create Office Location Nodes
    const officeLocations = ["{name: 'New York', state : 'New York', full_address : 'ABC 123, New York, NY 10001'}",
                             "{name: 'Arlington', state : 'Virginia', full_address : 'ABC 456, Arlington, VA 20330'}",
                             "{name: 'San Francisco', state : 'California', full_address : 'ABC 789, New York, NY 94016'}"]

    for(var office of officeLocations){
        pipeline.call("GRAPH.QUERY", "Employee", `CREATE(:OfficeLocation${office})`)
    }

    const responses = await pipeline.exec();

    const expectedResponses = associateLevelDetailMapping.length + officeLocations.length

    //TODO
    //Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){
        console.log(responses[0][1])
        callback('Nodes Created');
    } else {
        console.log(responses);
        callback('Unexpected error creating nodes');
    }
}

module.exports = createNodes;
