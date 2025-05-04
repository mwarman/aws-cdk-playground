const handler = async (event: any) => {
  console.log("GetGreeting::event::", event);
  console.log("GetGreeting::env::", process.env);

  const DEFAULT_GREETING_TEXT = "Hello world!";
  const message = process.env.GREETING_TEXT || DEFAULT_GREETING_TEXT;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
      event,
    }),
  };
};

export { handler };
