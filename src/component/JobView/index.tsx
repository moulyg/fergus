import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Button, Comment, Form, Input, InputRef, List, Modal, Select, Typography} from 'antd';
import {JobType, NoteType, Status, UserType} from '../../models/type';
import {SearchOutlined} from '@ant-design/icons';
import moment from "moment";
import CommentList from "../CommentList";
import {UserContext} from "../../App";

const {TextArea} = Input;
const {Option} = Select;

const {Title} = Typography;

type JobViewProps = {
    job: JobType | null,
    show: boolean,
    onClose: (job: JobType | null) => void
}

const JobView: React.FC<JobViewProps> = ({job, show, onClose}: JobViewProps) => {
    const [value, setValue] = useState<string>('');
    const [form, setForm] = useState<JobType | null>(null);
    const [editID, setEditId] = useState<number | null>(null);
    const userContext = useContext<UserType>(UserContext);
    useEffect(() => {
        setForm(job);
    }, [job]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };
    const onSubmit = () => {
        if (form) {
            if (editID) {
                form.notes = [
                    ...form.notes.map((item) => {
                        if (item.id === editID) {
                            item.content = value
                        }
                        return item;
                    })
                ];
                setEditId(null);
            } else {
                form.notes = [
                    ...form.notes,
                    {
                        id: form.notes.length + 1,
                        author: userContext.fullName,
                        userId: userContext.userId,
                        avatar:
                            'https://joeschmoe.io/api/v1/random',
                        content:
                        value,
                        datetime:
                            (moment().unix() * 1000).toString(),
                    }
                ];
            }
            setForm({...form});
        }
        setValue('');
    };
    const handleStatusChange = (value: string) => {
        if (form) {
            form.status = value as Status;
            setForm({...form});
        }
    };

    const onEdit = (note: NoteType) => {
        setValue(note.content);
        setEditId(note.id);
    };

    return (
        <Modal visible={show}
               title={`Job View (${job?.id})`}
               onOk={() => onClose(form)}
               okText="Save"
               onCancel={() => onClose(null)}>
            <List.Item key="id">
                <List.Item.Meta
                    title="ID"
                />
                <div>{job?.id}</div>
            </List.Item>
            <List.Item key="name">
                <List.Item.Meta
                    title="Name"
                />
                <div>{job?.name}</div>
            </List.Item>
            <List.Item key="contactNo">
                <List.Item.Meta
                    title="Contact No"
                />
                <div>{job?.contactNo}</div>
            </List.Item>
            <List.Item key="status">
                <List.Item.Meta
                    title="Status"
                />
                <Select value={form?.status} style={{width: 120}} onChange={handleStatusChange}>
                    <Option value="scheduled">Scheduled</Option>
                    <Option value="active">Active</Option>
                    <Option value="invoicing">Invoicing</Option>
                    <Option value="to priced">To Priced</Option>
                    <Option value="completed">Completed</Option>
                </Select>
            </List.Item>
            <List.Item key="dateTime">
                <List.Item.Meta
                    title="Date Time"
                />
                <div>{moment(Number(job?.dateTime)).format('lll')}</div>
            </List.Item>
            <Title level={5}>Notes</Title>


            {form != null && form?.notes != null && form?.notes?.length > 0 &&
            <CommentList onEdit={onEdit} notes={form.notes}/>}
            <Comment
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo"/>}
                content={
                    <>
                        <Form.Item>
                            <TextArea rows={4} onChange={handleChange} value={value}/>
                        </Form.Item>
                        <Form.Item>
                            <Button disabled={value === ''} htmlType="submit" onClick={onSubmit} type="primary">
                                {editID ? 'Update Note' : 'Add Note'}
                            </Button>
                        </Form.Item>
                    </>
                }
            />
        </Modal>
    )

};

export default JobView;
