import PropTypes from "prop-types";
import React, { Component } from "react";

import Ad from "../components/ad/Ad";
import Post from "../components/post/Post";

export class SinglePost extends Component {
    static propTypes = {
        params: PropTypes.shape({
            postId: PropTypes.string.isRequired
        })
    };

    render() {
        return (
            <div className="single-post">
                <Post id={this.props.params.postId} />
                <Ad
                    url="https://www.manning.com/books/react-in-action"
                    imageUrl="/static/assets/ads/ria.png"
                />
            </div>
        );
    }
}

export default SinglePost;
