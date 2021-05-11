const deleteReq = async (body, redis, callback) => {
    const pipeline = redis.pipeline();
    expectedResponses = 0
    //Convert JSON to string and remove quotes from keys so that ioredis doesn't complain
    newBody = JSON.stringify(body).replace(/"([^"]+)":/g, '$1:');

    //Delete req
    pipeline.call("GRAPH.QUERY", "Employee", `MATCH(req:Req) WHERE ID(req)=${body['reqId']} DELETE req`)
    expectedResponses += 1

    const responses = await pipeline.exec();
    console.log(JSON.stringify(responses))
    // Need to update below to check response for each pipeline call instead of just first one
    if (responses.length === expectedResponses && responses[0][1] !== null){
        console.log(responses[0][1])
        callback('Req Deleted!');
    } else {
        console.log(responses);
        callback('Unexpected error deleting req');
    }
}

module.exports = deleteReq;
