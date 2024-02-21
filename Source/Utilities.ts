import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";
import { Result } from "./Result";

export function CheckParams(Data: object, Checklist: object): Result {
    for (let i in Data) {
        if (Checklist[i] === undefined) {
            return new Result(false, "Parameter " + i + " unknown");
        }
        const AvailableTypes = ["string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function"];
        if (AvailableTypes.indexOf(Checklist[i]) === -1) {
            return new Result(false, "Parameter type " + Checklist[i] + " unknown");
        }
        if (typeof Data[i] !== Checklist[i]) {
            return new Result(false, "Parameter " + i + " expected type " + Checklist[i] + " actual type " + typeof Data[i]);
        }
    }
    for (let i in Checklist) {
        if (Data[i] === undefined) {
            return new Result(false, "Parameter " + i + " not found");
        }
    }
    return new Result(true, "Parameter check passed");
}
export function GenerateRandomString(Length: number, CharSet: string): string {
    let Result = "";
    for (let i = 0; i < Length; i++) {
        Result += CharSet.charAt(Math.floor(Math.random() * CharSet.length));
    }
    return Result;
}
export async function SendEmail(To: string, Subject: string, Content: string): void {
    mailChannelsPlugin({
        personalizations: [
            {
                to: [{ name: "User", email: To }],
            },
        ],
        from: {
            name: "Admin",
            email: "admin@chenlangning.me",
        },
        subject: Subject,
        content: [{
            type: "text/plain",
            value: Content,
        }],
    });
}