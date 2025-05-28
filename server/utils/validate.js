export async function validatedValues(validated, reply) {
if (!validated.success) {
    const message =
      validated.error?.errors?.[0]?.message;
    reply.code(400).send({ message });
    throw new Error("Validation failed");
  }
  console.log("ddddd",validated.data)
  return validated.data;
}

export default validatedValues