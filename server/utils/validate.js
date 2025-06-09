export async function validatedValues(validated, reply) {
  console.log("HHHHHHHH")
  console.log("OOOO=>", validated)
    console.log("OOOO=>", validated.data)
if (!validated.success) {
    const message =
      validated.error?.errors?.[0]?.message;
    reply.code(400).send({ message });
    throw new Error("Validation failed");
  }
  console.log("999999999999999999999999999999999999999")
  console.log(validated.data)
  return validated.data;
}

export default validatedValues