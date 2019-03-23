module.exports = (req, res) => {
    const hubChallenge = req.query['hub.challenge'];
    const hubMode = req.query['hub.mode'];
    const verifyTokenMatches = (req.query['hub.verify_token'] === 'abc');
    if (hubMode === 'subscribe' && verifyTokenMatches) {
        console.log('hubChallenge', hubChallenge);
        res.status(200).send(hubChallenge);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.status(403).end();
    }
};