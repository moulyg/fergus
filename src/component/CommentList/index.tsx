import React from 'react';
import {Comment, InputRef, List} from 'antd';
import {NoteType} from '../../models/type';
import {SearchOutlined} from '@ant-design/icons';
import moment from "moment";

type CommentListProps = {
    notes: NoteType[],
    onEdit: (note: NoteType) => void
}

const CommentList: React.FC<CommentListProps> = ({notes, onEdit}: CommentListProps) => {

    return (
        <List
            dataSource={notes}
            itemLayout="horizontal"
            renderItem={props => <Comment {...props}
                                          actions={[<span onClick={() => onEdit(props)}
                                                          key="comment-list-reply-to-0">Edit</span>]}
                                          datetime={moment(Number(props.datetime)).fromNow()}/>}
        />
    )

};

export default CommentList;
