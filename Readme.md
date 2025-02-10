Problem Statement: https://docs.google.com/document/d/1zsjvdeCcg1HkxweWm1hH5nFqXvuNLnKyrhdsN5DLnnY/edit?tab=t.0#heading=h.g5c2nyxjo68b

# End Points
1. Register User
```bash
/api/v1/users/register
```

***Sample Input***:

```json
{
    "email":"msionlinekingdom@gmail.com",
    "password":"Secret@1",
    "phone_number":"01234567890"
}
```
***Sample Output***:
```json
{
    "success": true,
    "message": "User registered successfully",
    "statusCode": 200,
    "data": [
        {
            "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
            "email": "msionlinekingdom@gmail.com",
            "password": "",
            "needs_password_change": false,
            "phone_number": "01234567890",
            "role": "UnVerifiedUser",
            "is_verified": false,
            "is_banned": false,
            "_id": "67aa11109d2570ae5526e6f5",
            "createdAt": "2025-02-10T14:45:36.409Z",
            "updatedAt": "2025-02-10T14:45:36.409Z",
            "__v": 0
        }
    ]
}
```

2. Login User

```bash
/api/v1/users/login
```
***Simple Input***
```json
{
    "email":"msionlinekingdom@gmail.com",
    "password":"Secret@1"
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "User logged in successfully",
    "statusCode": 200,
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1zaW9ubGluZWtpbmdkb21AZ21haWwuY29tIiwicm9sZSI6IlVuVmVyaWZpZWRVc2VyIiwiaWF0IjoxNzM5MTk5Mzc3LCJleHAiOjE3NDE3OTEzNzd9.rV2P1V7HrjIiIRjKonwqGARn5tyyg1qiU4BmJFRy5OE"
    }
}
```