import { Process } from "./Process";
import { Env } from "./Environment";
import { Initial } from "./Initial";

export default {
    async fetch(RequestData: Request, Environment: Env, Context: any) {
        let Initializer = new Initial(Environment);
        await Initializer.Init();
        let Processor = new Process(RequestData, Environment);
        return await Processor.Process();
    },
};
