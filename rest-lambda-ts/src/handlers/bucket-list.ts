import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

import { listBuckets } from "../services/s3-service";

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log("ListBuckets::handler::", { event, context });

  try {
    const buckets = await listBuckets();

    return {
      statusCode: 200,
      body: JSON.stringify({
        buckets,
      }),
    };
  } catch (error) {
    console.error("ListBuckets::error::", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving bucket list",
        error: errorMessage,
      }),
    };
  }
};

export { handler };
