import * as HTTPStatusPhrasses from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const notFoundSchema = createMessageObjectSchema(HTTPStatusPhrasses.NOT_FOUND);
