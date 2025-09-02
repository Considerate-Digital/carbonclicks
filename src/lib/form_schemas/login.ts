import { z } from "zod";

export const login_schema = z.object({
  email: z.string().email(),
  consent: z.preprocess((val) => (val ? true : false), z.boolean()),
});
