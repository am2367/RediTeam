const updateRelationships = async (redis, callback) => {
    const pipeline = redis.pipeline();

    const responses = await pipeline.exec();

    //Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === 4 && responses[0][1] !== null){
        console.log(responses[0][1])
        callback('Relationships Updated');
    } else {
        console.log(responses);
        callback('Unexpected error updating relationships');
    }
}

module.exports = updateRelationships;
