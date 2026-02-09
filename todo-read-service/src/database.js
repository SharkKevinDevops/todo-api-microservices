const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

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

async function getItems() {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
    });
    const response = await docClient.send(command);
    return response.Items || [];
}

async function getItem(id) {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
    });
    const response = await docClient.send(command);
    return response.Item || null;
}

module.exports = { init, getItems, getItem };
