import express from "express";
import nunjucks from "nunjucks";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

nunjucks.configure(["views", "node_modules/govuk-frontend/dist"], {
  autoescape: true,
  express: app,
  watch: false
});

app.set("view engine", "njk");

app.use(
  "/assets",
  express.static(
    path.join(__dirname, "node_modules/govuk-frontend/dist/govuk/assets")
  )
);
app.use(
  "/govuk-frontend.min.css",
  express.static(
    path.join(
      __dirname,
      "node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css"
    )
  )
);
app.use(
  "/govuk-frontend.min.js",
  express.static(
    path.join(
      __dirname,
      "node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js"
    )
  )
);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", { pageName: "Home", currentPage: "home" });
});

interface BorrowRecord {
  id: number;
  memberId: string;
  memberName: string;
  bookTitle: string;
  copyId: string;
  borrowDate: string;
  dueDate: string;
  status: "on-time" | "overdue";
}

const sampleBorrows: BorrowRecord[] = [
  {
    id: 1,
    memberId: "M001",
    memberName: "John Smith",
    bookTitle: "1984",
    copyId: "C001",
    borrowDate: "2026-01-23",
    dueDate: "2026-02-06",
    status: "on-time"
  },
  {
    id: 2,
    memberId: "M001",
    memberName: "John Smith",
    bookTitle: "The Hobbit",
    copyId: "C007",
    borrowDate: "2026-01-25",
    dueDate: "2026-02-08",
    status: "on-time"
  },
  {
    id: 3,
    memberId: "M002",
    memberName: "Jane Doe",
    bookTitle: "Pride and Prejudice",
    copyId: "C004",
    borrowDate: "2026-01-15",
    dueDate: "2026-01-29",
    status: "overdue"
  },
  {
    id: 4,
    memberId: "M003",
    memberName: "Alice Brown",
    bookTitle: "To Kill a Mockingbird",
    copyId: "C010",
    borrowDate: "2026-01-30",
    dueDate: "2026-02-13",
    status: "on-time"
  }
];

app.get("/borrowing", (req, res) => {
  res.render("borrowing/index", {
    pageName: "Borrowing",
    currentPage: "borrowing",
    borrows: sampleBorrows
  });
});

app.get("/borrowing/checkout", (req, res) => {
  res.render("borrowing/checkout", {
    pageName: "Check out book",
    currentPage: "borrowing"
  });
});

app.get("/borrowing/checkin", (req, res) => {
  res.render("borrowing/checkin", {
    pageName: "Check in book",
    currentPage: "borrowing"
  });
});

app.get("/borrowing/success", (req, res) => {
  res.render("borrowing/success", {
    pageName: "Success",
    currentPage: "borrowing",
    transactionType: req.query.type || "checkout",
    memberName: "John Smith",
    bookTitle: "1984",
    copyId: "C001",
    dueDate: "2026-02-20"
  });
});

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
