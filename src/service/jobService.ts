import {JobType} from "../models/type";

export class JobService {

    public getJobs(): Promise<JobType[]> {
        return fetch('/data/jobs.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json()
            })
    }

}
