import { json } from "@remix-run/node";
// Import Prisma db
import db from "../db.server";

export async function loader() {
    const data = await db.goldGSTRates.findFirst();
    return json(data, applicationUrl);
}