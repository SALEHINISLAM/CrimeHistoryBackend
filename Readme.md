Problem Statement: https://docs.google.com/document/d/1zsjvdeCcg1HkxweWm1hH5nFqXvuNLnKyrhdsN5DLnnY/edit?tab=t.0#heading=h.g5c2nyxjo68b

Error Types:
```js
success: true or false
message: text
errorSources:[
  path:'',
  message:''
]
err: details error
stack: details error source when in development mode
```
Response Types
```js
{
    "success": true or false,
    "message": text,
    "statusCode": 200,
    "data": details
}
```
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
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1zaW9ubGluZWtpbmdkb21AZ21haWwuY29tIiwicm9sZSI6IlZlcmlmaWVkVXNlciIsImlhdCI6MTczOTI3Njc0MiwiZXhwIjoxNzM5Mjc4NTQyfQ.ZTqQjDe4VtCY56Vljnv1icOkW_AsqjD3kB79IUlGb6s",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1zaW9ubGluZWtpbmdkb21AZ21haWwuY29tIiwicm9sZSI6IlZlcmlmaWVkVXNlciIsImlhdCI6MTczOTI3Njc0MiwiZXhwIjoxNzM5ODgxNTQyfQ.wM8RF2Etl8QzgBx7xnvsoz1pNPwjGkSebOxLwZiw1vk"
    }
}
```
Error
```json
{
    "success": false,
    "message": "Invalid credentials",
    "errorSources": [
        {
            "path": "",
            "message": "Invalid credentials"
        }
    ],
    "err": {
        "statusCode": 401
    },
    "stack": "Error: Invalid credentials\n    at H:\\NSUHack\\BackEnd\\src\\app\\modules\\Auth\\auth.services.ts:22:15\n    at Generator.next (<anonymous>)\n    at fulfilled (H:\\NSUHack\\BackEnd\\src\\app\\modules\\Auth\\auth.services.ts:5:58)"
}
```


3. Send Verification Code
```bash
/api/v1/users/verify-user
```
Add Authorization to the headers
```json
Authorization= Secret Access Token that you received in the times of login
```
***Simple Output***
```json
{
    "success": true,
    "message": "Verification token sent . Please check your email and verify your account.",
    "statusCode": 200,
    "data": {
        "success": true,
        "message": "Verification token sent and saved successfully"
    }
}
```

 * Code is 4 digit.

 4. Time for verification of the code
 ```bash
 /api/v1/users/verify-code
 ```
 ***Simple Input***
 ```json
 {
    "code":7047
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "You have successfully verified your account!",
    "statusCode": 200,
    "data": {
        "acknowledged": true,
        "modifiedCount": 1,
        "upsertedId": null,
        "upsertedCount": 0,
        "matchedCount": 1
    }
}
```
5. Forget Password Button
```bash
/api/v1/users/forget-password
```
just add authorization header
***Simple Output***
```json
{
    "success": true,
    "message": "Forget Password Token sent. Please check your email and verify it's you.",
    "statusCode": 200,
    "data": {
        "success": true,
        "message": "Verification token sent and saved successfully"
    }
}
```
compare the code with verify code
5. Reset The Password
```bash
/api/v1/users/reset-password
```
***Simple Input***
```json
{
    "password":"Secret@1"
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "You have successfully changed your password!",
    "statusCode": 200,
    "data": {
        "acknowledged": true,
        "modifiedCount": 1,
        "upsertedId": null,
        "upsertedCount": 0,
        "matchedCount": 1
    }
}
```

6. Get Access Token by Refresh Token
Set refresh token in the cookie
```bash
/api/v1/auth/refresh-token
```
***Simple Output***
```json
{
    "success": true,
    "message": "Access token is retrieved successfully!",
    "statusCode": 200,
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1zaW9ubGluZWtpbmdkb21AZ21haWwuY29tIiwicm9sZSI6IlZlcmlmaWVkVXNlciIsImlhdCI6MTczOTI3Njc4NSwiZXhwIjoxNzM5MzYzMTg1fQ.QTGl2BcOBUM-Zneg8z6SCcxwMukVisF-0Yq6QDylDsg"
    }
}
```

7. Change Password
```bash
/api/v1/auth/change-password
```
Access token must be in header
***Simple Input***
```bash
{
    "oldPassword":"Secret@1",
    "newPassword":"Salehin@27"
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "Password is updated successfully!",
    "statusCode": 200,
    "data": null
}
```