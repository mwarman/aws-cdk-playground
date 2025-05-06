import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

import { DEFAULT_GREETING_TEXT } from "../utils/constants";

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log("GetGreeting::handler::", { event, context });

  try {
    const message = process.env.GREETING_TEXT || DEFAULT_GREETING_TEXT;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message,
      }),
    };
  } catch (error) {
    console.error("GetGreeting::error::", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving greeting",
        error: errorMessage,
      }),
    };
  }
};

export { handler };
