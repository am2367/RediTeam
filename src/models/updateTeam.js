const updateTeam = async (body, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain
    newBody = JSON.stringify(body).replace(/"([^"]+)":/g, '$1:');
    

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
