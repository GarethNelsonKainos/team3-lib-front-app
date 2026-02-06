import express from 'express';
import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nunjucks from 'nunjucks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const appViews = path.join(projectRoot, 'views');

const app = express();
const port = Number(process.env.PORT) || 5000;

const nunjucksConfig = {
  autoescape: true,
  noCache: true,
  express: app,
};

app.set('view engine', 'njk');
app.set('views', appViews);

const nunjucksEnv = nunjucks.configure(
  [appViews, path.join(projectRoot, 'node_modules/govuk-frontend/dist')],
  nunjucksConfig
);
nunjucksEnv.addGlobal('govukRebrand', true);

app.get('/', (req: Request, res: Response) => {
    res.render('dashboard');
});

app.use(express.urlencoded({ extended: true }));

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  year: number;
  copies: number;
  available: number;
}

interface CopyRecord {
  id: string;
  status: 'available' | 'borrowed';
  borrower?: string;
  dueDate?: string;
}

interface BorrowRecord {
  id: number;
  memberId: string;
  memberName: string;
  bookTitle: string;
  copyId: string;
  borrowDate: string;
  dueDate: string;
  status: 'on-time' | 'overdue';
}

const books: Book[] = [
  {
    id: 'B001',
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    genre: 'Dystopian',
    year: 1949,
    copies: 4,
    available: 2
  },
  {
    id: 'B002',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '9780547928227',
    genre: 'Fantasy',
    year: 1937,
    copies: 3,
    available: 3
  },
  {
    id: 'B003',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    genre: 'Classic',
    year: 1813,
    copies: 2,
    available: 0
  },
  {
    id: 'B004',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    genre: 'Fiction',
    year: 1960,
    copies: 5,
    available: 4
  }
];

const copiesByBookId: Record<string, CopyRecord[]> = {
  B001: [
    { id: 'C001', status: 'borrowed', borrower: 'John Smith', dueDate: '2026-02-06' },
    { id: 'C002', status: 'available' },
    { id: 'C003', status: 'borrowed', borrower: 'Jane Doe', dueDate: '2026-01-29' },
    { id: 'C004', status: 'available' }
  ],
  B002: [
    { id: 'C005', status: 'available' },
    { id: 'C006', status: 'available' },
    { id: 'C007', status: 'available' }
  ],
  B003: [
    { id: 'C008', status: 'borrowed', borrower: 'Alice Brown', dueDate: '2026-02-13' },
    { id: 'C009', status: 'borrowed', borrower: 'Tom Wilson', dueDate: '2026-02-10' }
  ],
  B004: [
    { id: 'C010', status: 'available' },
    { id: 'C011', status: 'available' },
    { id: 'C012', status: 'available' },
    { id: 'C013', status: 'available' },
    { id: 'C014', status: 'borrowed', borrower: 'Emma Green', dueDate: '2026-02-12' }
  ]
};

const sampleBorrows: BorrowRecord[] = [
  {
    id: 1,
    memberId: 'M001',
    memberName: 'John Smith',
    bookTitle: '1984',
    copyId: 'C001',
    borrowDate: '2026-01-23',
    dueDate: '2026-02-06',
    status: 'on-time'
  },
  {
    id: 2,
    memberId: 'M001',
    memberName: 'John Smith',
    bookTitle: 'The Hobbit',
    copyId: 'C007',
    borrowDate: '2026-01-25',
    dueDate: '2026-02-08',
    status: 'on-time'
  },
  {
    id: 3,
    memberId: 'M002',
    memberName: 'Jane Doe',
    bookTitle: 'Pride and Prejudice',
    copyId: 'C004',
    borrowDate: '2026-01-15',
    dueDate: '2026-01-29',
    status: 'overdue'
  },
  {
    id: 4,
    memberId: 'M003',
    memberName: 'Alice Brown',
    bookTitle: 'To Kill a Mockingbird',
    copyId: 'C010',
    borrowDate: '2026-01-30',
    dueDate: '2026-02-13',
    status: 'on-time'
  }
];

const findBookById = (bookId: string): Book | undefined =>
  books.find((book) => book.id === bookId);

app.get('/books', (req: Request, res: Response) => {
  res.render('books/index', {
    pageName: 'Books',
    currentPage: 'books',
    books
  });
});

app.get('/books/add', (req: Request, res: Response) => {
  res.render('books/add', {
    pageName: 'Add book',
    currentPage: 'books'
  });
});

app.get('/books/:id/edit', (req: Request, res: Response) => {
  const bookId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const book = findBookById(bookId);

  if (!book) {
    res.status(404).send('Book not found');
    return;
  }

  res.render('books/edit', {
    pageName: 'Edit book',
    currentPage: 'books',
    book
  });
});

app.get('/books/:id', (req: Request, res: Response) => {
  const bookId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const book = findBookById(bookId);

  if (!book) {
    res.status(404).send('Book not found');
    return;
  }

  res.render('books/view', {
    pageName: book.title,
    currentPage: 'books',
    book,
    copies: copiesByBookId[book.id] ?? []
  });
});

app.get('/borrowing', (req: Request, res: Response) => {
  res.render('borrowing/index', {
    pageName: 'Borrowing',
    currentPage: 'borrowing',
    borrows: sampleBorrows
  });
});

app.get('/borrowing/checkout', (req: Request, res: Response) => {
  res.render('borrowing/checkout', {
    pageName: 'Check out book',
    currentPage: 'borrowing'
  });
});

app.get('/borrowing/checkin', (req: Request, res: Response) => {
  res.render('borrowing/checkin', {
    pageName: 'Check in book',
    currentPage: 'borrowing'
  });
});

app.get('/borrowing/success', (req: Request, res: Response) => {
  const transactionType = Array.isArray(req.query.type) ? req.query.type[0] : req.query.type;
  res.render('borrowing/success', {
    pageName: 'Success',
    currentPage: 'borrowing',
    transactionType: transactionType || 'checkout',
    memberName: 'John Smith',
    bookTitle: '1984',
    copyId: 'C001',
    dueDate: '2026-02-20'
  });
});

app.use('/govuk', express.static(
  path.join(projectRoot, 'node_modules/govuk-frontend/dist/govuk')
));

app.use(
  '/govuk-frontend.min.css',
  express.static(
    path.join(projectRoot, 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css')
  )
);

app.use(
  '/govuk-frontend.min.js',
  express.static(
    path.join(projectRoot, 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js')
  )
);

app.use('/assets', express.static(
  path.join(projectRoot, 'node_modules/govuk-frontend/dist/govuk/assets')
));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});