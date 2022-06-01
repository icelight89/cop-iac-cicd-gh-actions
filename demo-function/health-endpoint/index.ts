import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log("HTTP trigger function processed a request.");
    const name = req.query.name || (req.body && req.body.name);
    const connectionString = process.env["PGCONNECTIONSTRING"];
    const client = new Client({
        connectionString
    });
    let dbConnectionStatus = undefined;
    try {
        await client.connect();
        dbConnectionStatus = "healthy";
        await client.end();
    } catch (error) {
        dbConnectionStatus = "unhealthy"
        context.log(`Error: ${error}`)
    }

    const response = { "function_health": "healthy" ,"db_health": dbConnectionStatus}
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: response,
    };
};

export default httpTrigger;
