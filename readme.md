cc19-Fakebook-API
===
### env guide
PORT=8899  
DATABASE_URL = ***  
JWT_SECRET= ***

CLOUDINARY_NAME =
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =

---
### service
|path|mothod|authen|params|query|body|
|:---|:---|:---|:---|:---|:---|
|/auth/register|post|-|-|-|{identity, firstName,lastName, password, confirmpassword}
|/auth/login|post|-|-|-| {identity,password}
|/auth/me|get|y|-|-|-|
|/post|get|y|-|-|-|
|/post|post|y|-|-|{message, image(file)}
|/post|put|y|:id|-|{message, image(file)}
|/post|delete|y|:id|-|-
|/comment|post|y|-|-|{message, postId} 
|/like|post|y|-|-|{postId}
|/like|delete|y|:id|-|-
---
## Note