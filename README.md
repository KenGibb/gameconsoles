# Games Are Us Back-End Project

## Description
As a visitor on this site, you will be able to get some of the latest and greatest video game consoles of the century, all inside of a secure account! Don't worry about having to look everywhere for the latest models because we have a large stock of some the most popular products!


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

## Technologies Used

- Express
- MongoDB
- Mongoose
- Node.js
- Liquid(Bootstrap)
- CSS
- HTML
- Javascript
