// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const tableName = process.env.BOOK_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.getOrderById = async (event) =>{
    try{
        if(event.httpMethod !== 'GET'){
            return {
                body: JSON.stringify({message: 'Method Not Allowed'})
            };
        }
        
     const orderId = event.pathParameters.orderId;
     
     const params = {
         TableName: tableName??'order-table',
         Key:{
             user_id : event.requestContext.authorizer.claims["cognito:username"] || event.requestContext.authorizer.claims.username,   
             id: orderId
         }
     }
     
     const data = await docClient.get(params).promise();
     
     if(!data.Item){
         return {
             statusCode: 404,
             body: JSON.stringify({message: 'Registro no encontrado'})
         }
     }
     
     return {
         statusCode: 200,
         body: JSON.stringify(data.Item)
     }
        
        
        
    }catch(error){
        console.error('Error al obtener el registro: ', error)
        
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Error de servidor', error})
        }
    }
}
