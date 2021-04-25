const updateTeam = async (body, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain
    newBody = JSON.stringify(body).replace(/"([^"]+)":/g, '$1:');
    newReqs = JSON.stringify(body['reqs']).replace(/"([^"]+)":/g, '$1:');
    console.log(newReqs)
    //Create manager node if not exists
    //Create relationship to manager if not exists
    //Create relationship between manager and team if not exists
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(t:Team{name:"${body['teamName']}"}) SET t.reqs=${newReqs}`)
    expectedResponses += 1

    const responses = await pipeline.exec();

    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){
        console.log(responses[0][1])
        callback('Team Updated');
    } else {
        console.log(responses);
        callback('Unexpected error updating team');
    }
}

module.exports = updateTeam;
