const { SaveInOut, GetInOut, GenUpdateInOut, DeleteInOut } = require("../controllers/generatedInOut.controller");


module.exports = (app)=>{
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/generatedInOut/add", SaveInOut )

  app.get("/api/generatedInOut/getOne/:userId/:problemId", GetInOut)

  app.post("/api/generatedInOut/UpdateOne/:userId/:problemId/:answer", GenUpdateInOut)

  app.delete("/api/generatedInOut/DeleteOne/:id", DeleteInOut)

}
