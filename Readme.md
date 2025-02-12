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

8. Create Admin
patch request:
```bash
/api/v1/auth/create-admin
```
Super Admin access token must be in headers. because only he can made admin.
***Simple Output***
```json
{
    "success": true,
    "message": "The User role is updated",
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
***Simple Error***
```json
{
    "success": false,
    "message": "You are not authorized!",
    "errorSources": [
        {
            "path": "",
            "message": "You are not authorized!"
        }
    ],
    "err": {
        "statusCode": 401
    },
    "stack": "Error: You are not authorized!\n    at H:\\NSUHack\\BackEnd\\src\\app\\middleware\\auth.ts:16:19\n    at Generator.next (<anonymous>)\n    at H:\\NSUHack\\BackEnd\\src\\app\\middleware\\auth.ts:8:71\n    at new Promise (<anonymous>)\n    at __awaiter (H:\\NSUHack\\BackEnd\\src\\app\\middleware\\auth.ts:4:12)\n    at H:\\NSUHack\\BackEnd\\src\\app\\middleware\\auth.ts:11:81\n    at H:\\NSUHack\\BackEnd\\src\\app\\utilis\\CatchAsync.ts:6:25\n    at Layer.handle [as handle_request] (H:\\NSUHack\\BackEnd\\node_modules\\express\\lib\\router\\layer.js:95:5)\n    at next (H:\\NSUHack\\BackEnd\\node_modules\\express\\lib\\router\\route.js:149:13)\n    at Route.dispatch (H:\\NSUHack\\BackEnd\\node_modules\\express\\lib\\router\\route.js:119:3)"
}
```

9. Remove Admin
patch request
```bash
/api/v1/auth/remove-admin
```
Super Admin access token must be in headers. because only he can made admin.
***Simple Input***
```json
{
    "email":"msionlinekingdom@gmail.com"
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "The User role is updated",
    "statusCode": 200
}
```

10. Ban User
Patch request
```bash
/api/v1/auth/ban-user
```
Super Admin or Admin access token must be in headers. because only he can made admin.
***Simple Input***
```json
{
    "email":"msionlinekingdom@gmail.com"
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "The user is banned successfully",
    "statusCode": 200,
    "data": {
        "message": "The user is banned"
    }
}
```

11. Update Verified User Profile
Patch request
```bash
/api/v1/verified-users/edit-profile
```
***Simple Input ***
```json
{
    "bio":"MSI",
    "profile_pic":"https://i.ibb.co.com/xH0JL92/proPhoto.jpg"
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "Profile is updated successfully!",
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

12. Create Crime Post
Post request
```bash
/api/v1/crimes/create-crime-post
```
***Simple Input***
```json
{
  "title": "Armed Robbery in Central Park",
  "description": "An armed robbery occurred at Central Park around 10 PM. The suspect was described as wearing a black hoodie and a mask. No casualties were reported.",
  "division": "Dhaka",
  "district": "Manikganj",
  "crime_time": 1730592000000,
  "image_urls": [
    "https://example.com/images/crime1.jpg",
    "https://example.com/images/crime2.jpg"
  ]
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "Crime Post created successfully",
    "statusCode": 200,
    "data": [
        {
            "report_id": "d6cdec4c-304b-4c40-b2cc-cdbc19d2b726",
            "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
            "title": "Armed Robbery in Central Park",
            "description": "An armed robbery occurred at Central Park around 10 PM. The suspect was described as wearing a black hoodie and a mask. No casualties were reported.",
            "division": "Dhaka",
            "district": "Manikganj",
            "crime_time": 1730592000000,
            "image_urls": [
                "https://example.com/images/crime1.jpg",
                "https://example.com/images/crime2.jpg"
            ],
            "verification_score": 0,
            "is_banned": false,
            "_id": "67ab7578b8f878ea91648401",
            "createdAt": "2025-02-11T16:06:16.341Z",
            "updatedAt": "2025-02-11T16:06:16.341Z",
            "__v": 0
        }
    ]
}
```

13. Update Crime Post
Patch request
```bash
http://localhost:5000/api/v1/crimes/update-crime-post?report_id=d6cdec4c-304b-4c40-b2cc-cdbc19d2b726
```
***Simple Input***
```json
{
    "image_urls": [
    "https://example.com/images/crime1.jpg",
    "https://example.com/images/crime2.jpg",
    "https://example.com/images/crime3.jpg"
  ]
}
```
***Simple Input***
```json
{
    "success": true,
    "message": "Crime Post updated successfully",
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

14. Ban a Crime Post
Patch request
```bash
/api/v1/admin/ban_report\
```
***Simple Input***
```json
{
    "report_id":"d6cdec4c-304b-4c40-b2cc-cdbc19d2b726"
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "Crime Post banned successfully",
    "statusCode": 200,
    "data": {
        "message": "Post banned successfully."
    }
}
```

15. Do Comments
post request
```bash
/api/v1/crimes/create-comment?report_id=3a393b7b-9870-4078-962b-42006daa8be0
```
***Simple Input***
```json
{
    "comment": "Send Police Imidiately.",
    "proof_image_urls": [
        "https://example.com/images/crime24.jpg"
    ]
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "Comment created successfully",
    "statusCode": 200,
    "data": {
        "newComment": {
            "comment_id": "33cb0a42-ddd1-4d49-bdda-97bdff5954f5",
            "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
            "comment": "Send Police Imidiately.",
            "proof_image_urls": [
                "https://example.com/images/crime24.jpg"
            ]
        },
        "message": "Your comment posted."
    }
}
```
Increase verification number by 2 while commenting

16. Update Comment
patch request
```bash
/api/v1/crimes/update-comment?comment_id=e267a240-d185-4e58-adc8-a21ca10c50e0&report_id=3a393b7b-9870-4078-962b-42006daa8be0
```
***Simple Input***
```json
{
    "comment":"Please save us from the devil"
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "Comment updated successfully",
    "statusCode": 200,
    "data": {
        "comment_id": "e267a240-d185-4e58-adc8-a21ca10c50e0",
        "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
        "comment": "Please save us from the devil",
        "proof_image_urls": [
            "https://example.com/proof1.jpg",
            "https://example.com/proof2.jpg"
        ],
        "_id": "67aba40c21087eee8fccaf94",
        "createdAt": "2025-02-11T19:25:00.877Z",
        "updatedAt": "2025-02-11T19:52:18.162Z"
    }
}
```

17. Vote
post request
```bash
/api/v1/crimes/vote-post?report_id=3a393b7b-9870-4078-962b-42006daa8be0
```
***Simple Input***
```json
{
    "vote_type":"upVote"
}
```
***Simple Output***
```json
{
    "success": true,
    "message": "upVote successful.",
    "statusCode": 200,
    "data": {
        "message": "upVote successful."
    }
}
```

18. Get Crime Post and search
post request
```bash
/api/v1/crimes/get-post?page=1&limit=10&search=theft
```
***Simple Output***
```json
{
    "success": true,
    "message": "Crime posts fetched successfully",
    "statusCode": 200,
    "data": {
        "crimeReports": [
            {
                "_id": "67aba26dbf3428a7c8b61f53",
                "report_id": "3a393b7b-9870-4078-962b-42006daa8be0",
                "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
                "title": "Theft in Downtown",
                "description": "A theft occurred near the central park. The suspect was seen fleeing the scene on a bicycle.",
                "division": "Central",
                "district": "Downtown",
                "crime_time": 1698765432000,
                "image_urls": [
                    "https://example.com/images/crime1.jpg",
                    "https://example.com/images/crime2.jpg",
                    "https://example.com/images/crime37.jpg"
                ],
                "verification_score": 3,
                "is_banned": false,
                "comments": [
                    {
                        "is_removed": false,
                        "comment_id": "e267a240-d185-4e58-adc8-a21ca10c50e0",
                        "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
                        "comment": "Please save us from the devil",
                        "proof_image_urls": [
                            "https://example.com/proof1.jpg",
                            "https://example.com/proof2.jpg"
                        ],
                        "_id": "67aba40c21087eee8fccaf94",
                        "createdAt": "2025-02-11T19:25:00.877Z",
                        "updatedAt": "2025-02-11T19:52:18.162Z"
                    },
                    {
                        "is_removed": false,
                        "comment_id": "34705838-39d5-41f4-a876-8b6a56768c2b",
                        "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
                        "comment": "I saw the suspect wearing a red jacket.",
                        "proof_image_urls": [
                            "https://example.com/images/crime2.jpg"
                        ],
                        "_id": "67aba46021087eee8fccaf9a",
                        "createdAt": "2025-02-11T19:26:24.302Z",
                        "updatedAt": "2025-02-11T19:26:24.302Z"
                    },
                    {
                        "comment_id": "33cb0a42-ddd1-4d49-bdda-97bdff5954f5",
                        "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
                        "comment": "Send Police Imidiately.",
                        "proof_image_urls": [
                            "https://example.com/images/crime24.jpg"
                        ],
                        "is_removed": false,
                        "_id": "67abac142583325b34ac3dfc",
                        "createdAt": "2025-02-11T19:59:16.804Z",
                        "updatedAt": "2025-02-11T19:59:16.804Z"
                    }
                ],
                "upVotes": [
                    "",
                    null
                ],
                "downVotes": [
                    ""
                ],
                "createdAt": "2025-02-11T19:18:05.451Z",
                "updatedAt": "2025-02-11T20:48:29.362Z",
                "__v": 5
            },
            {
                "upVotes": [],
                "downVotes": [],
                "_id": "67ab7578b8f878ea91648401",
                "report_id": "d6cdec4c-304b-4c40-b2cc-cdbc19d2b726",
                "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
                "title": "Armed Robbery in Central Park",
                "description": "An armed robbery occurred at Central Park around 10 PM. The suspect was described as wearing a black hoodie and a mask. No casualties were reported.",
                "division": "Dhaka",
                "district": "Manikganj",
                "crime_time": 1730592000000,
                "image_urls": [
                    "https://example.com/images/crime1.jpg",
                    "https://example.com/images/crime2.jpg",
                    "https://example.com/images/crime3.jpg"
                ],
                "verification_score": 0,
                "is_banned": true,
                "createdAt": "2025-02-11T16:06:16.341Z",
                "updatedAt": "2025-02-11T17:42:43.646Z",
                "__v": 0,
                "comments": []
            }
        ],
        "totalReports": 2,
        "currentPage": 1,
        "totalPages": 1
    }
}
```

19. Get single post by id
```bash
/api/v1/crimes/get-single-post?report_id=3a393b7b-9870-4078-962b-42006daa8be0
```
***Simple Output***
```json
{
    "success": true,
    "message": "Crime report fetched successfully",
    "statusCode": 200,
    "data": {
        "_id": "67aba26dbf3428a7c8b61f53",
        "report_id": "3a393b7b-9870-4078-962b-42006daa8be0",
        "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
        "title": "Theft in Downtown",
        "description": "A theft occurred near the central park. The suspect was seen fleeing the scene on a bicycle.",
        "division": "Central",
        "district": "Downtown",
        "crime_time": 1698765432000,
        "image_urls": [
            "https://example.com/images/crime1.jpg",
            "https://example.com/images/crime2.jpg",
            "https://example.com/images/crime37.jpg"
        ],
        "verification_score": 3,
        "is_banned": false,
        "comments": [
            {
                "is_removed": false,
                "comment_id": "e267a240-d185-4e58-adc8-a21ca10c50e0",
                "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
                "comment": "Please save us from the devil",
                "proof_image_urls": [
                    "https://example.com/proof1.jpg",
                    "https://example.com/proof2.jpg"
                ],
                "_id": "67aba40c21087eee8fccaf94",
                "createdAt": "2025-02-11T19:25:00.877Z",
                "updatedAt": "2025-02-11T19:52:18.162Z"
            },
            {
                "is_removed": false,
                "comment_id": "34705838-39d5-41f4-a876-8b6a56768c2b",
                "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
                "comment": "I saw the suspect wearing a red jacket.",
                "proof_image_urls": [
                    "https://example.com/images/crime2.jpg"
                ],
                "_id": "67aba46021087eee8fccaf9a",
                "createdAt": "2025-02-11T19:26:24.302Z",
                "updatedAt": "2025-02-11T19:26:24.302Z"
            },
            {
                "comment_id": "33cb0a42-ddd1-4d49-bdda-97bdff5954f5",
                "user_id": "9a936322-4765-4203-88e3-4843cdd6c1b5",
                "comment": "Send Police Imidiately.",
                "proof_image_urls": [
                    "https://example.com/images/crime24.jpg"
                ],
                "is_removed": false,
                "_id": "67abac142583325b34ac3dfc",
                "createdAt": "2025-02-11T19:59:16.804Z",
                "updatedAt": "2025-02-11T19:59:16.804Z"
            }
        ],
        "upVotes": [
            "",
            null
        ],
        "downVotes": [
            ""
        ],
        "createdAt": "2025-02-11T19:18:05.451Z",
        "updatedAt": "2025-02-11T20:48:29.362Z",
        "__v": 5
    }
}
```