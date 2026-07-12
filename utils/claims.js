const fs = require("fs");

const file = "./data/claims.json";


function getClaims() {

    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, "[]");
    }

    return JSON.parse(
        fs.readFileSync(file, "utf8")
    );

}



function saveClaims(claims) {

    fs.writeFileSync(
        file,
        JSON.stringify(claims, null, 2)
    );

}



function addClaim(claim) {

    const claims = getClaims();

    claims.push(claim);

    saveClaims(claims);

}



function removeClaim(userId) {

    let claims = getClaims();

    claims = claims.filter(
        claim => claim.userId !== userId
    );

    saveClaims(claims);

}



module.exports = {
    getClaims,
    saveClaims,
    addClaim,
    removeClaim
};
