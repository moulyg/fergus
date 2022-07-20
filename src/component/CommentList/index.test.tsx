import React from "react";
import {render} from '@testing-library/react';
import CommentList from "./index";
import '@testing-library/jest-dom'

test('has correct welcome text', () => {
    const {getByText} = render(<CommentList notes={[
        {
            "author": "Val Culp",
            "avatar": "https://robohash.org/sintoditet.png?size=50x50&set=set1",
            "content": "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.\n\nMaecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.",
            "datetime": "1644903744000",
            "id": 1
        }
    ]} onEdit={(note) => {
    }}/>)
    expect(getByText('Val Culp')).toBeInTheDocument()

})
