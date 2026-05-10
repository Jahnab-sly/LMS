const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API Routes
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query =
    "SELECT * FROM authentication_system WHERE loginid=? AND password=?";

  db.query(query, [username, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (result.length === 0) {
      return res.json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    const user = result[0];

    db.query(
      "SELECT * FROM staff WHERE loginid=?",
      [user.loginid],
      (err2, staffResult) => {
        if (err2) {
          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        if (staffResult.length > 0) {
          return res.json({
            success: true,
            role: "admin",
            user: {
              username: user.loginid,
              role: "admin",
            },
          });
        }

        db.query(
          "SELECT * FROM readers WHERE user_id=?",
          [user.loginid],
          (err3, readerResult) => {
            if (err3) {
              return res.status(500).json({
                success: false,
                message: "Database error",
              });
            }

            if (readerResult.length > 0) {
              return res.json({
                success: true,
                role: "student",
                user: {
                  username: user.loginid,
                  userId: readerResult[0].user_id,
                  name: readerResult[0].name,
                  role: "student",
                },
              });
            }

            console.log("User found but no role assigned");
            return res.json({
              success: false,
              message: "User role not found",
            });
          },
        );
      },
    );
  });
});

app.post("/register-user", (req, res) => {
  const { user_id, firstname, lastname, email, phone_no, address, password } = req.body;

  console.log("Registration attempt:", { user_id, firstname, has_password: !!password });

  if (!user_id || !firstname) {
    return res.status(400).json({
      success: false,
      message: "User ID and First Name are required",
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  const checkQuery = "SELECT * FROM readers WHERE user_id=?";

  db.query(checkQuery, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
      });
    }

    if (result.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // First, create authentication entry with user-provided password
    const authQuery = "INSERT INTO authentication_system (loginid, password) VALUES (?, ?)";

    db.query(authQuery, [user_id, password], (authErr) => {
      if (authErr) {
        return res.status(500).json({
          success: false,
          message: "Failed to create authentication",
        });
      }

      // Then create reader entry
      const name = `${firstname} ${lastname || ""}`.trim();
      const insertQuery = `
        INSERT INTO readers
        (
            user_id,
            firstname,
            name,
            lastname,
            email,
            phone_no,
            address,
            enrollment_date,
            expiry_date
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            CURDATE(),
            DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
        )
      `;

      db.query(
        insertQuery,
        [user_id, firstname, name, lastname, email, phone_no, address],
        (insertErr) => {
          if (insertErr) {
            return res.status(500).json({
              success: false,
            });
          }

          res.json({
            success: true,
            message: "User registered successfully. You can now sign in.",
          });
        },
      );
    });
  });
});

app.post("/issue-book", (req, res) => {
  const userId = String(req.body.userId || "").trim();
  const studentName = String(req.body.studentName || "").trim();
  const authNo = String(req.body.authNo || "").trim();
  const issue_date = String(req.body.issue_date || "").trim();
  const due_date = String(req.body.due_date || "").trim();

  if (!userId || !authNo) {
    return res.status(400).json({
      success: false,
      message: "User ID and Book ID required",
    });
  }

  if (!issue_date || !due_date) {
    return res.status(400).json({
      success: false,
      message: "Issue and Due date required",
    });
  }

  db.query(
    "SELECT user_id FROM readers WHERE user_id=?",
    [userId],
    (userErr, userResult) => {
      if (userErr) {
        console.error(userErr);

        return res.status(500).json({
          success: false,
        });
      }

      if (userResult.length === 0) {
        const insertUser = `
          INSERT INTO readers
          (
              user_id,
              name,
              enrollment_date,
              expiry_date
          )
          VALUES
          (
              ?,
              ?,
              CURDATE(),
              DATE_ADD(
                  CURDATE(),
                  INTERVAL 1 YEAR
              )
          )
        `;

        db.query(
          insertUser,
          [userId, studentName || "Unknown"],
          (insertErr) => {
            if (insertErr) {
              return res.status(500).json({
                success: false,
                message: "User insert failed",
              });
            }

            issueBook();
          },
        );
      } else {
        issueBook();
      }
    },
  );

  function issueBook() {
    db.query(
      "SELECT COUNT(*) as count FROM transactions WHERE user_id=? AND status='Issued'",
      [userId],
      (countErr, countResult) => {
        if (countErr) {
          return res.status(500).json({
            success: false,
            message: "Database error checking book count",
          });
        }

        const currentBookCount = countResult[0].count;

        if (currentBookCount >= 5) {
          return res.status(400).json({
            success: false,
            message: `Maximum book limit reached. You already have ${currentBookCount} books issued. Please return a book before issuing a new one.`,
          });
        }

        db.query(
          "SELECT * FROM transactions WHERE user_id=? AND authNo=? AND status='Issued'",
          [userId, authNo],
          (alreadyIssuedErr, alreadyIssuedResult) => {
            if (alreadyIssuedErr) {
              return res.status(500).json({
                success: false,
                message: "Database error",
              });
            }

            if (alreadyIssuedResult.length > 0) {
              return res.status(400).json({
                success: false,
                message: "This book is already issued to you",
              });
            }

            db.query(
              "SELECT authNo FROM books WHERE authNo=?",
              [authNo],
              (bookErr, bookResult) => {
                if (bookErr) {
                  return res.status(500).json({
                    success: false,
                    message: "Database error checking book",
                  });
                }

                if (bookResult.length === 0) {
                  return res.status(400).json({
                    success: false,
                    message: `Book not found with Auth No: ${authNo}`,
                  });
                }

                console.log("Book found! Creating transaction...");
                const insertTransaction = `
                  INSERT INTO transactions
                  (
                      user_id,
                      authNo,
                      reserve_date,
                      due_date,
                      status
                  )
                  VALUES
                  (
                      ?,
                      ?,
                      ?,
                      ?,
                      'Issued'
                  )
                `;

                db.query(
                  insertTransaction,
                  [userId, authNo, issue_date, due_date],
                  (insertErr) => {
                    if (insertErr) {
                      return res.status(500).json({
                        success: false,
                        message: "Failed to create transaction",
                      });
                    }

                    res.json({
                      success: true,
                      message: "Book issued successfully",
                    });
                  },
                );
              },
            );
          }
        );
      }
    );
  }
});

app.get("/transactions", (req, res) => {
  const query = `
    SELECT
        t.transaction_id,
        r.user_id,
        r.name,
        b.title,
        t.reserve_date,
        t.due_date,
        t.status
    FROM transactions t
    JOIN readers r ON r.user_id = t.user_id
    JOIN books b ON b.authNo = t.authNo
    ORDER BY t.transaction_id DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(result);
  });
});

app.get("/doc", (req, res) => {
  db.query("SELECT * FROM books", (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(result);
  });
});

app.get("/students", (req, res) => {
  db.query("SELECT user_id, name, email FROM readers", (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(result);
  });
});

app.get("/student-transactions/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT
      t.transaction_id,
      t.user_id,
      r.name,
      b.title,
      b.author,
      b.category,
      t.reserve_date,
      t.due_date,
      t.status
    FROM transactions t
    JOIN readers r ON r.user_id = t.user_id
    JOIN books b ON b.authNo = t.authNo
    WHERE t.user_id = ?
    ORDER BY t.transaction_id DESC
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(result);
  });
});

// TEST ENDPOINT - Check what's in authentication_system table
app.get("/test-users", (req, res) => {
  db.query("SELECT loginid, password FROM authentication_system", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// TEST ENDPOINT - Check what books exist
app.get("/test-books", (req, res) => {
  db.query("SELECT authNo, title FROM books", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// Add new book
app.post("/add-book", (req, res) => {
  const { authNo, title, author, ISBN, edition, category, price, publisher_id } = req.body;

  if (!authNo || !title) {
    return res.status(400).json({
      success: false,
      message: "Auth No and Title are required",
    });
  }

  db.query("SELECT authNo FROM books WHERE authNo=?", [authNo], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (result.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Book with this Auth No already exists",
      });
    }

    const insertQuery = `
      INSERT INTO books
      (authNo, title, author, ISBN, edition, category, price, publisher_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [authNo, title, author || null, ISBN || null, edition || null, category || null, price || null, publisher_id || null],
      (insertErr) => {
        if (insertErr) {
          return res.status(500).json({
            success: false,
            message: "Failed to add book",
          });
        }

        res.json({
          success: true,
          message: "Book added successfully",
        });
      }
    );
  });
});

app.listen(5500, () => {
  console.log("Server running on http://localhost:5500");
});
