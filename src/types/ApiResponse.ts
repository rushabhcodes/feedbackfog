import { Message } from "@/model/User.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    questions?: Array<string>;
    }