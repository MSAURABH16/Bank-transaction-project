# SwiftLedger API Documentation

Base URL

```http
http://localhost:3000/api
```

---

# Authentication APIs

## Register User

Create a new user account.

### Endpoint

```http
POST /auth/register
```

### Request Body

```json
{
  "name": "Saurabh Kashyap",
  "email": "saurabh@example.com",
  "password": "password123"
}
```

### Success Response

**Status:** `201 Created`

```json
{
  "user": {
    "_id": "685123abc123",
    "email": "saurabh@example.com",
    "name": "Saurabh Kashyap"
  },
  "token": "jwt_token"
}
```

### Error Response

**Status:** `422 Unprocessable Entity`

```json
{
  "message": "User already exists with email.",
  "status": "failed"
}
```

---

## Login User

Authenticate an existing user.

### Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
  "email": "saurabh@example.com",
  "password": "password123"
}
```

### Success Response

**Status:** `200 OK`

```json
{
  "user": {
    "_id": "685123abc123",
    "email": "saurabh@example.com",
    "name": "Saurabh Kashyap"
  },
  "token": "jwt_token"
}
```

### Error Response

**Status:** `401 Unauthorized`

```json
{
  "message": "Email or password is INVALID"
}
```

---

## Logout User

Invalidate current JWT token.

### Endpoint

```http
POST /auth/logout
```

### Headers

```http
Authorization: Bearer <jwt_token>
```

### Success Response

**Status:** `200 OK`

```json
{
  "message": "User logged out successfully"
}
```

---

# Account APIs

> All Account APIs require authentication.

### Authorization Header

```http
Authorization: Bearer <jwt_token>
```

---

## Create Account

Create a new account for the authenticated user.

### Endpoint

```http
POST /accounts
```

### Success Response

**Status:** `201 Created`

```json
{
  "account": {
    "_id": "685abc123",
    "user": "684user123",
    "status": "ACTIVE"
  }
}
```

---

## Get User Accounts

Fetch all accounts owned by the logged-in user.

### Endpoint

```http
GET /accounts
```

### Success Response

**Status:** `200 OK`

```json
{
  "accounts": [
    {
      "_id": "685abc123",
      "user": "684user123",
      "status": "ACTIVE"
    }
  ]
}
```

---

## Get Account Balance

Fetch current account balance derived from ledger entries.

### Endpoint

```http
GET /accounts/balance/:accountId
```

### Example

```http
GET /accounts/balance/685abc123
```

### Success Response

**Status:** `200 OK`

```json
{
  "accountId": "685abc123",
  "balance": 5000
}
```

### Error Response

**Status:** `404 Not Found`

```json
{
  "message": "Account not found"
}
```

---

# Transaction APIs

> All Transaction APIs require authentication.

---

## Transfer Funds

Transfer money from one account to another.

### Endpoint

```http
POST /transactions
```

### Request Body

```json
{
  "fromAccount": "685abc123",
  "toAccount": "685xyz456",
  "amount": 1000,
  "idempotencyKey": "f9a64273-949e-4944-b8b7-ee97313d60dc"
}
```

### Success Response

**Status:** `201 Created`

```json
{
  "message": "Transaction completed successfully",
  "transaction": {
    "_id": "txn123",
    "fromAccount": "685abc123",
    "toAccount": "685xyz456",
    "amount": 1000,
    "status": "PENDING"
  }
}
```

### Error Responses

#### Missing Fields

**Status:** `400 Bad Request`

```json
{
  "message": "FromAccount, toAccount, amount and idempotencyKey are required"
}
```

#### Invalid Accounts

```json
{
  "message": "Invalid fromAccount or toAccount"
}
```

#### Inactive Account

```json
{
  "message": "Both fromAccount and toAccount must be ACTIVE to process transaction"
}
```

#### Insufficient Balance

```json
{
  "message": "Insufficient balance. Current balance is 500. Requested amount is 1000"
}
```

#### Duplicate Transaction

```json
{
  "message": "Transaction already processed",
  "transaction": {}
}
```

---

## Add Initial Funds (System User)

Used to credit funds into a newly created account.

### Endpoint

```http
POST /transactions/system/initial-funds
```

### Authentication

Requires System User Authentication.

### Request Body

```json
{
  "toAccount": "685abc123",
  "amount": 10000,
  "idempotencyKey": "seed-funds-001"
}
```

### Success Response

**Status:** `201 Created`

```json
{
  "message": "Initial funds transaction completed successfully",
  "transaction": {
    "_id": "txn001",
    "amount": 10000,
    "status": "COMPLETED"
  }
}
```

### Error Response

```json
{
  "message": "toAccount, amount and idempotencyKey are required"
}
```

```json
{
  "message": "Invalid toAccount"
}
```

```json
{
  "message": "System user account not found"
}
```

---

# Authentication Flow

```text
Register User
      ↓
Login User
      ↓
Create Account
      ↓
Add Initial Funds
      ↓
Transfer Funds
      ↓
Check Account Balance
```

---

# Features

* JWT Authentication
* Account Management
* Double Entry Ledger System
* Idempotent Transactions
* MongoDB Transactions
* Email Notifications
* Account Balance Derivation from Ledger
* Initial Funding Mechanism
* Secure Logout with Token Blacklisting
