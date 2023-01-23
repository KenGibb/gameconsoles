# Games Are Us Back-End Project

## User Stories
- As a user, I want vistors to be able to make an account
- As a user, I want vistors to be able to to log back into an account that they made
- As a user, I want vistors to save content from the shopping page to a saved items page
- As a user, I want vistors to be able to leave a review on the content 
- As a user, I want users to be able to sign out
- As a user, I want users to have their saved items whne they log back in

## ERD

![Alt text](Images/Screen%20Shot%202023-01-23%20at%2012.04.54%20AM.png)
![Alt text](Images/Screen%20Shot%202023-01-23%20at%2012.07.53%20AM.png)
![Alt text](Images/Screen%20Shot%202023-01-23%20at%2012.08.12%20AM.png)

## Route Tables

| **URL**          | **HTTP Verb**|**Action**|
|------------------|--------------|----------|
| /games/         | GET          | index  
| /games/:id      | GET          | show       
| /games/new      | GET          | new   
| /games          | POST         | create   
| /games/:id/edit | GET          | edit       
| /games/:id      | PATCH/PUT    | update    
| /games/:id      | DELETE       | destroy  

#### Comments

| **URL**          | **HTTP Verb**|**Action**|
|--------------------|--------------|----------|
| /comments/:gameId | POST         | create  
| /comments/delete/:gameId/:commentId      | DELETE          | destroy       


#### Users

| **URL**          | **HTTP Verb**|**Action**|
|------------------|--------------|----------|
| /users/signup    | GET         | new  
| /users/signup    | POST         | create  
| /users/login     | GET         | login       
| /users/login     | POST         | create       
| /users/logout    | DELETE       | destroy 
