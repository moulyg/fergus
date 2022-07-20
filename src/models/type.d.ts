type Status = "scheduled" | "active" | "invoicing" | "to priced" | "completed";

export type JobType = {
    key: number;
    id: string;
    name: string;
    contactNo: string;
    status: Status;
    dateTime: string;
    notes: NoteType[];
}

export type NoteType = {
    id: number;
    author: string;
    avatar: string;
    content: string;
    datetime: string;
}


export type UserType = {
    fullName: string,
    userId: number
}
