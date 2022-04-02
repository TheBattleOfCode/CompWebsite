const { SaveProb, GetProb, GetProbs, DeleteProb } = require("../controllers/prob.controller");

module.exports = (app)=>{
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/problem/add", SaveProb )

  app.get("/api/problem/getall", GetProbs)

  app.get("/api/problem/getone/:id", GetProb)

  app.delete("/api/problem/delete/:id", DeleteProb)
}