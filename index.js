const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

const port = 5000;

const bookRouter = express.Router();

app.use("/libaray", bookRouter);

// Connect to MongoDB (replace 'your-mongodb-uri' with the actual connection string)
mongoose
  .connect(
    `mongodb+srv://labClass:JpSOx9Et6fkqkJ1V@cluster0.hlzaati.mongodb.net/labClass?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define the Book schema and model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  department: String,
  ID: Number,
});

//model
const Book = mongoose.model("Book", bookSchema);

bookRouter.get("/", (req, res) => {
  res.send("Hello World!");
});

bookRouter.post("/ektaBookAddKorbo", async (req, res) => {
  try {
    const { title, author, department, ID } = req.body;
    const book = new Book({ title, author, department, ID });
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

bookRouter.get("/sobBoiDekhbo", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

bookRouter.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /books/:id
bookRouter.delete("/del/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (deletedBook) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /books/:id
bookRouter.put("/put/:id", async (req, res) => {
  try {
    const { title, author, department, ID } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, department, ID },
      { new: true }
    );
    if (updatedBook) {
      res.json(updatedBook);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log("App Listening");
});
