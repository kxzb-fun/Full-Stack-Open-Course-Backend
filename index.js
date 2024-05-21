require("dotenv").config();

const express = require("express");
const app = express();

const Person = require("./models/person");

const morgan = require("morgan");
const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

// 自定义token来记录请求体内容
morgan.token("body", (req) => JSON.stringify(req.body));
// 定义日志格式，包含请求体内容
const logFormat =
  ":method :url :status :res[content-length] - :response-time ms :body";

// 使用morgan中间件
app.use(morgan(logFormat));

// 中间件函数，用于记录请求到达的时间
app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error);
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// 获取整体信息
app.get("/api/info", (request, response) => {
  Person.find({}).then((data) => {
    const len = data.length;
    const responseTime = request.requestTime;
    response.send(
      `<h2>PhoneeBook has info ${len} people</h2><p>${responseTime}</p>`
    );
  });
});

// 获取所有电话信息
app.get("/api/persons", (request, response) => {
  Person.find({}).then((data) => {
    response.json(data);
  });
});

// 按id查找电话
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// update person
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body
  // 关于findByIdAndUpdate方法添加了可选的 { new: true } 参数，这将导致我们的事件处理程序被新修改的文档而不是原始文档调用。
  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// 删除电话
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      // the status code 204 no content and return no data with the response.
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// 添加电话信息
app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  // console.log(body);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  Person.find({}).then((data) => {
    const flag = data.find((person) => person.name === body.name);
    if (flag) {
      return response.status(400).json({
        error: "name must be unique",
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then((savedPerson) => {
      response.json(savedPerson);
    }).catch(error => next(error))
  });
});

// this has to be the last loaded middleware, also all the routes should be registered before this!
// 所有路由注册之后
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
