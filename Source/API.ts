import { Result, ThrowErrorIfFailed } from "./Result";
import { Database } from "./Database";
import { Output } from "./Output";
import { Env } from "./Environment";
import * as Utilities from "./Utilities";

export class API {
    private DB: Database;
    private APIName: string;
    private RequestJSON: object;
    private ProcessFunctions = {
        CheckUsernameAvailable: async (Data: object): Promise<Result> => {
            ThrowErrorIfFailed(Utilities.CheckParams(Data, {
                Username: "string",
            }));
            let UserInfo = ThrowErrorIfFailed(await this.DB.Select("Users", [], {
                Username: Data["Username"],
            }))["Results"];
            return new Result(UserInfo.length === 0, "用户名" + (UserInfo.length === 0 ? "可用" : "已被占用"));
        },
        CheckEmailAvailable: async (Data: object): Promise<Result> => {
            ThrowErrorIfFailed(Utilities.CheckParams(Data, {
                EmailAddress: "string",
            }));
            let UserInfo = ThrowErrorIfFailed(await this.DB.Select("Users", [], {
                Email: Data["EmailAddress"],
            }))["Results"];
            return new Result(UserInfo.length === 0, "邮箱" + (UserInfo.length === 0 ? "可用" : "已被占用"));
        },
        SendVerificationCode: async (Data: object): Promise<Result> => {
            ThrowErrorIfFailed(Utilities.CheckParams(Data, {
                EmailAddress: "string",
            }));
            let VerificationCode = Utilities.GenerateRandomString(6, "0123456789");
            Utilities.SendEmail(Data["EmailAddress"], "验证码", "您的验证码是：" + VerificationCode);
            return new Result(true, "验证码已发送");
        },
        Login: async (Data: object): Promise<Result> => {
            ThrowErrorIfFailed(Utilities.CheckParams(Data, {
                Username: "string",
                Password: "string",
            }));
            let UserInfo = ThrowErrorIfFailed(await this.DB.Select("Users", [], {
                Username: Data["Username"],
            }))["Results"];
            console.log(UserInfo);
            if (UserInfo.length === 0) {
                return new Result(false, "用户名或密码错误");
            }
        },
        // NewPost: async (Data: object): Promise<Result> => {
        //     ThrowErrorIfFailed(this.Utilities.CheckParams(Data, {
        //         "ProblemID": "number",
        //         "Title": "string",
        //         "Content": "string",
        //         "CaptchaSecretKey": "string",
        //         "BoardID": "number"
        //     }));
        //     ThrowErrorIfFailed(await this.VerifyCaptcha(Data["CaptchaSecretKey"]));
        //     if (Data["Title"].trim() === "") {
        //         return new Result(false, "标题不能为空");
        //     }
        //     if (Data["Content"].trim() === "") {
        //         return new Result(false, "内容不能为空");
        //     }
        //     if (!this.IsAdmin() && (Data["BoardID"] == 0 || Data["BoardID"] == 5)) {
        //         return new Result(false, "没有权限发表公告");
        //     }
        //     if (Data["BoardID"] !== 0 && ThrowErrorIfFailed(await this.DB.GetTableSize("bbs_board", {
        //         board_id: Data["BoardID"]
        //     }))["TableSize"] === 0) {
        //         return new Result(false, "未找到板块");
        //     }
        //     let PostID = ThrowErrorIfFailed(await this.DB.Insert("bbs_post", {
        //         user_id: this.Username,
        //         problem_id: Data["ProblemID"],
        //         title: Data["Title"],
        //         post_time: new Date().getTime(),
        //         board_id: Data["BoardID"]
        //     }))["InsertID"];
        //     let ReplyID = ThrowErrorIfFailed(await this.DB.Insert("bbs_reply", {
        //         user_id: this.Username,
        //         post_id: PostID,
        //         content: Data["Content"],
        //         reply_time: new Date().getTime()
        //     }))["InsertID"];
        //     return new Result(true, "创建讨论成功", {
        //         PostID: PostID,
        //         ReplyID: ReplyID
        //     });
        // },
    };

    constructor(DB: Database, APIName: string, RequestJSON: object) {
        this.DB = DB;
        this.APIName = APIName;
        this.RequestJSON = RequestJSON;
        Output.Debug("API request: \n" +
            "APIName    : \"" + this.APIName + "\"\n" +
            "RequestJSON: " + JSON.stringify(this.RequestJSON));
    }

    public async Process(): Promise<object> {
        try {
            if (this.ProcessFunctions[this.APIName] === undefined) {
                throw new Result(false, "The page you are trying to access does not exist");
            }
            throw await this.ProcessFunctions[this.APIName](this.RequestJSON);
        } catch (ResponseData) {
            if (!(ResponseData instanceof Result)) {
                Output.Error(ResponseData);
                ResponseData = new Result(false, "Server error: " + String(ResponseData).split("\n")[0]);
            }
            return ResponseData;
        }
    }
}
