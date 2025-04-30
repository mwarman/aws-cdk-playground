const handler = async (event: any) => {
  console.log("HellowWorldHandler::event::", event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello world!",
      input: event,
    }),
  };
};

export { handler };
