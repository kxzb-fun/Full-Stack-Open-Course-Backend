const express = require("express");
const app = express();

app.use(express.json());
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
// 中间件函数，用于记录请求到达的时间
app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
app.get("/api/info", (request, response) => {
  const len = persons.length;
  const responseTime = request.requestTime;

  response.send(
    `<h2>PhoneeBook has info ${len} people</h2><p>${responseTime}</p>`
  );
});

// app.get("/api/persons", (request, response) => {
//   response.json(persons);
// });

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  // console.log(typeof id);
  persons = persons.find((person) => person.id === id);
  if (persons) {
    response.json(persons);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  //   the status code 204 no content and return no data with the response.
  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const flag = persons.find(person=>person.name === body.name)
  if(flag.length) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
