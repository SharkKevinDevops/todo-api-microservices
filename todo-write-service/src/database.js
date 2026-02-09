const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'TodoItems';
const AWS_REGION = process.env.AWS_REGION || 'ap-southeast-1';
const AWS_ENDPOINT = process.env.AWS_ENDPOINT_URL;

const clientConfig = { region: AWS_REGION };
if (AWS_ENDPOINT) {
    clientConfig.endpoint = AWS_ENDPOINT;
}

const client = new DynamoDBClient(clientConfig);
const docClient = DynamoDBDocumentClient.from(client);

async function init() {
    console.log(`Connected to DynamoDB table: ${TABLE_NAME}`);
}

async function storeItem(item) {
    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
    });
    await docClient.send(command);
}

async function updateItem(id, item) {
    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'SET #name = :name, completed = :completed',
        ExpressionAttributeNames: {
            '#name': 'name',
        },
        ExpressionAttributeValues: {
            ':name': item.name,
            ':completed': item.completed,
        },
    });
    await docClient.send(command);
}

async function removeItem(id) {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
    });
    await docClient.send(command);
}

module.exports = { init, storeItem, updateItem, removeItem };
